/*
  FILE: src-tauri/src/lib.rs
  PHASE: 1
  MISSION: 1-Tauri
  CHANGES:
    - R-04: Removed window.hide() + api.prevent_close() from CloseRequested — the window
      now closes normally, which triggers RunEvent::ExitRequested for cleanup
    - R-03: Registered BackendProcess state so the sidecar handle is accessible app-wide
    - R-03: Passed app_handle to stop_backend() in ExitRequested so the sidecar is killed
      rather than orphaned when the user closes the application
*/
mod commands;
mod backend;

use tauri::Manager;
use std::sync::Mutex;
use commands::{BackendUrl, StartupStatus, BackendProcess};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_log::Builder::default().build())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_http::init())
        .plugin(tauri_plugin_single_instance::init(|app, _args, _cwd| {
            if let Some(main) = app.get_webview_window("main") {
                let _ = main.show();
                let _ = main.set_focus();
            }
        }))
        .setup(|app| {
            app.manage(BackendUrl(Mutex::new(String::new())));
            app.manage(StartupStatus(Mutex::new("Starting backend...".to_string())));
            app.manage(BackendProcess(Mutex::new(None)));

            // Show the splashscreen while the backend starts.
            if let Some(splash) = app.get_webview_window("splashscreen") {
                let _ = splash.show();
            }

            backend::spawn_backend(app.handle().clone());

            Ok(())
        })
        .on_window_event(|_window, _event| {})
        .invoke_handler(tauri::generate_handler![
            commands::get_backend_url,
            commands::get_startup_status,
            commands::read_reset_code,
            commands::get_version,
            commands::window_minimize,
            commands::window_maximize,
            commands::window_close,
            commands::open_file_dialog,
            commands::get_app_data_dir
        ])
        .build(tauri::generate_context!())
        .expect("error while building tauri application")
        .run(|app_handle, event| match event {
            tauri::RunEvent::ExitRequested { .. } => {
                backend::stop_backend(app_handle);
            }
            _ => {}
        });
}
