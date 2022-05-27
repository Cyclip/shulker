use crate::{
    data,
    paths,
    packs,
    downloads,
};

use crate::profiles::{
    Profiles,
    DetailedProfile,
};

use serde_json::{
    Value,
};

use std::path::PathBuf;

/// Get all basic visible information on profiles
#[tauri::command]
pub fn get_profiles() -> Profiles {
    let launcher_profiles_path = paths::minecraft_path(
        Some(PathBuf::from("launcher_profiles.json"))
    );

    let profiles = Profiles::new(launcher_profiles_path);
    profiles
}

/// Get detailed information on a single profile
#[tauri::command]
pub fn get_profile(id: String) -> Result<DetailedProfile, String> {
    let launcher_profiles_path = paths::minecraft_path(
        Some(PathBuf::from("launcher_profiles.json"))
    );

    DetailedProfile::new(launcher_profiles_path, id)
}

/// Save profile data
#[tauri::command]
pub fn save_profile(id: String, profile: DetailedProfile) -> Result<(), String> {
    let launcher_profiles_path = paths::minecraft_path(
        Some(PathBuf::from("launcher_profiles.json"))
    );
    
    profile.save(id, launcher_profiles_path)
}

#[tauri::command]
pub fn get_curseforge_api_key() -> String {
    match data::read_preferences()["CURSEFORGE_API_KEY"].as_str() {
        Some(x) => {
            x.to_string()
        },
        None => {
            panic!("missing key 'CURSEFORGE_API_KEY' in preferences");
        }
    }
}

#[tauri::command]
pub fn get_installed_packs(packs: Value) -> Vec<String> {
    packs::get_installed_packs(packs)
}

#[tauri::command]
pub async fn download_pack(url: String, name: String) -> Result<(), ()> {
    let mut path = paths::minecraft_path(
        Some(PathBuf::from("resourcepacks"))
    );

    path.push(name);

    downloads::download_file(url, path);
    Ok(())
}