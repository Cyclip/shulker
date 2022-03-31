use crate::profiles::{
    Profiles,
    DetailedProfile,
};

use std::path::PathBuf;

use crate::paths;

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