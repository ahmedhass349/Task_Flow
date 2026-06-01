/*
  FILE: src-tauri/src/backend.rs
  PHASE: 1
  MISSION: 1-Tauri
  CHANGES:
    - R-01: Fixed sidecar name "taskflow" → "taskflow-backend" (matches externalBin in tauri.conf.json)
    - R-02: Production stdout now uses a line-accumulating buffer so the TASKFLOW_BACKEND_READY:
      token is detected correctly even when it arrives split across multiple Stdout chunks
    - R-03: stop_backend() now accepts AppHandle, retrieves the stored CommandChild from
      BackendProcess state, and calls kill() to prevent the backend process from being
      orphaned on app exit
*/
use tauri::{AppHandle, Manager};
use std::process::Stdio;
use tokio::io::{AsyncBufReadExt, BufReader};
use tauri_plugin_shell::ShellExt;
use tauri_plugin_shell::process::CommandEvent;
use crate::commands::{BackendUrl, StartupStatus, BackendProcess};

fn get_or_create_jwt_key(app: &AppHandle) -> String {
    let app_data_dir = app.path().app_data_dir().unwrap();
    let key_path = app_data_dir.join("jwt.key");

    if key_path.exists() {
        if let Ok(key) = std::fs::read_to_string(&key_path) {
            if key.trim().len() >= 64 {
                return key.trim().to_string();
            }
        }
    }

    let mut rng = rand::thread_rng();
    let mut bytes = [0u8; 32];
    rand::Rng::fill(&mut rng, &mut bytes);
    let key = hex::encode(bytes);

    let _ = std::fs::create_dir_all(&app_data_dir);
    let _ = std::fs::write(&key_path, &key);
    key
}

fn handle_ready_line(app: &AppHandle, url: &str) {
    let url_state = app.state::<BackendUrl>();
    *url_state.0.lock().unwrap() = url.trim().to_string();

    let status_state = app.state::<StartupStatus>();
    *status_state.0.lock().unwrap() = "Backend ready".to_string();

    if let Some(m) = app.get_webview_window("main") {
        let _ = m.show();
    }
    if let Some(s) = app.get_webview_window("splashscreen") {
        let _ = s.close();
    }
}

pub fn spawn_backend(app: AppHandle) {
    let is_dev = cfg!(debug_assertions);

    let db_path = if is_dev {
        "".to_string()
    } else {
        let app_data_dir = app.path().app_data_dir().unwrap();
        app_data_dir.to_string_lossy().to_string()
    };

    let jwt_key = get_or_create_jwt_key(&app);

    let env_vars: Vec<(&str, String)> = vec![
        ("ASPNETCORE_ENVIRONMENT", (if is_dev { "Development" } else { "Production" }).to_string()),
        ("ASPNETCORE_URLS", (if is_dev { "http://127.0.0.1:5000" } else { "http://127.0.0.1:0" }).to_string()),
        ("TASKFLOW_DB_PATH", db_path),
        ("TASKFLOW_JWT_KEY", jwt_key),
        ("DOTNET_TieredCompilation", "1".to_string()),
        ("DOTNET_TC_QuickJit", "1".to_string()),
        ("DOTNET_TC_QuickJitForLoops", "1".to_string()),
        ("DOTNET_NOLOGO", "1".to_string()),
        ("COMPlus_EnableDiagnostics", "0".to_string()),
    ];

    let app_clone = app.clone();

    tauri::async_runtime::spawn(async move {
        if is_dev {
            let mut cmd = tokio::process::Command::new("dotnet");
            cmd.arg("run")
               .arg("--project")
               .arg("../TaskFlow.csproj")
               .arg("--no-launch-profile")
               .current_dir("../")
               .stdout(Stdio::piped())
               .stderr(Stdio::piped())
               .kill_on_drop(true);

            for (k, v) in &env_vars {
                cmd.env(k, v);
            }

            let mut child = cmd.spawn().expect("Failed to spawn backend in dev");
            let stdout = child.stdout.take().unwrap();
            let mut reader = BufReader::new(stdout).lines();

            while let Ok(Some(line)) = reader.next_line().await {
                let part = line.trim();
                if part.is_empty() { continue; }
                println!("[BACKEND STDOUT] {}", part);
                if let Some(url) = part.strip_prefix("TASKFLOW_BACKEND_READY:") {
                    handle_ready_line(&app_clone, url);
                }
            }
        } else {
            let mut command = app_clone.shell().sidecar("taskflow-backend").unwrap();
            for (k, v) in &env_vars {
                command = command.env(k, v);
            }

            let (mut rx, child) = command.spawn().expect("Failed to spawn sidecar");

            // Store the CommandChild so stop_backend() can kill it on exit.
            {
                let process_state = app_clone.state::<BackendProcess>();
                *process_state.0.lock().unwrap() = Some(child);
            }

            // Accumulate bytes across Stdout events so a token split across chunks
            // is still matched correctly.
            let mut line_buf = String::new();

            while let Some(event) = rx.recv().await {
                if let CommandEvent::Stdout(bytes) = event {
                    line_buf.push_str(&String::from_utf8_lossy(&bytes));
                    while let Some(newline_pos) = line_buf.find('\n') {
                        let line: String = line_buf.drain(..=newline_pos).collect();
                        let part = line.trim();
                        if part.is_empty() { continue; }
                        println!("[BACKEND STDOUT] {}", part);
                        if let Some(url) = part.strip_prefix("TASKFLOW_BACKEND_READY:") {
                            handle_ready_line(&app_clone, url);
                        }
                    }
                }
            }
        }
    });
}

pub fn stop_backend(app: &AppHandle) {
    let process_state = app.state::<BackendProcess>();
    let mut guard = process_state.0.lock().unwrap();
    if let Some(child) = guard.take() {
        let _ = child.kill();
        println!("[BACKEND] Sidecar process killed.");
    }
}
