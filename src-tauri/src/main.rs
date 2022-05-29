#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

extern crate serde;
extern crate serde_json;
extern crate directories;
extern crate ureq;

mod paths;
mod profiles;
mod commands;
mod constants;
mod data;
mod packs;
mod downloads;

use std::fs::File;
use std::io::Write;

fn setup_files() {
    let preferences = data::data_path("preferences.json");

    if !preferences.exists() {
        // create new preferences file
        let mut f = File::create(preferences).expect("failed to create preferences file");
        write!(f, "{}", constants::PREFERENCES_DEFAULT).expect("failed to write to preferences file");
    }
}

fn main() {
    // setup initial files (if needed)
    setup_files();

    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            commands::get_profiles,
            commands::get_profile,
            commands::save_profile,
            commands::get_curseforge_api_key,
            commands::get_installed_packs,
            commands::download_pack,
            commands::try_delete_pack,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
