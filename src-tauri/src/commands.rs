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
use std::fs;

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
    packs::search::get_installed_packs(packs)
}

#[tauri::command]
/// It downloads a resource pack from a URL and saves it to a path
/// 
/// Arguments:
/// 
/// * `url`: The URL to the resource pack.
/// * `name`: The name of the resource pack.
/// 
/// Returns:
/// 
/// A Result<(), ()>
pub async fn download_pack(url: String, name: String) -> Result<(), ()> {
    let mut path = paths::minecraft_path(
        Some(PathBuf::from("resourcepacks"))
    );

    path.push(name);

    downloads::download_file(url, path);
    Ok(())
}

#[tauri::command]
pub async fn try_delete_pack(filenames: Vec<String>) -> Result<(), String> {
    let base_path = paths::minecraft_path(
        Some(PathBuf::from("resourcepacks"))
    );

    // create a vector of paths
    let paths: Vec<PathBuf> = filenames.iter().map(
        |x| base_path.join(x)
    ).collect();

    // attempt to delete files
    for path in paths.iter() {
        match fs::remove_file(path) {
            Ok(_) => {
                println!("deleted {:?}", path);
                return Ok(());
            },
            Err(e) => println!("couldnt delete {:?}: {}", path, e)
        };
    }

    Err("no files deleted".to_owned())
}

#[tauri::command]
pub async fn get_all_installed_packs() -> Result<Vec<packs::installed::Pack>, String> {
    let base_path = paths::minecraft_path(
        Some(PathBuf::from("resourcepacks"))
    );

    let cache_path = paths::cache_path(
        Some(PathBuf::from("packs/"))
    );

    packs::installed::get_installed_packs(
        base_path,
        cache_path,
    )
}