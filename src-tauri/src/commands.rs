/*
  FILE: src-tauri/src/commands.rs
  PHASE: 1
  MISSION: 1-Tauri
  CHANGES:
    - Added BackendProcess state struct to hold the sidecar CommandChild handle
      so stop_backend() can kill the process on exit instead of orphaning it
*/
use tauri::{AppHandle, Manager, State, Window};
use std::sync::Mutex;
use std::env;
use tauri_plugin_shell::process::CommandChild;

pub struct BackendUrl(pub Mutex<String>);
pub struct StartupStatus(pub Mutex<String>);
pub struct BackendProcess(pub Mutex<Option<CommandChild>>);

#[tauri::command]
pub fn get_backend_url(url: State<'_, BackendUrl>) -> String {
    url.0.lock().unwrap().clone()
}

#[tauri::command]
pub fn get_startup_status(status: State<'_, StartupStatus>) -> String {
    status.0.lock().unwrap().clone()
}

#[tauri::command]
pub fn read_reset_code() -> Result<Option<String>, String> {
    let tmp_dir = env::temp_dir();
    let file_path = tmp_dir.join("taskflow_reset_pending.tmp");
    if file_path.exists() {
        match std::fs::read_to_string(&file_path) {
            Ok(contents) => {
                let _ = std::fs::remove_file(file_path);
                Ok(Some(contents))
            }
            Err(e) => Err(e.to_string()),
        }
    } else {
        Ok(None)
    }
}

#[tauri::command]
pub fn get_version(app: AppHandle) -> String {
    app.package_info().version.to_string()
}

#[tauri::command]
pub fn window_minimize(window: Window) {
    let _ = window.minimize();
}

#[tauri::command]
pub fn window_maximize(window: Window) {
    if let Ok(is_max) = window.is_maximized() {
        if is_max {
            let _ = window.unmaximize();
        } else {
            let _ = window.maximize();
        }
    }
}

#[tauri::command]
pub fn window_close(window: Window) {
    let _ = window.close();
}

#[tauri::command]
pub async fn open_file_dialog() -> Result<Option<String>, String> {
    Ok(None)
}

#[tauri::command]
pub fn get_app_data_dir(app: AppHandle) -> Result<String, String> {
    app.path().app_data_dir()
        .map(|p| p.to_string_lossy().to_string())
        .map_err(|e| e.to_string())
}
