#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

extern crate serde;
extern crate serde_json;
extern crate directories;

mod paths;
mod profiles;
mod commands;

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            commands::get_profiles,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
