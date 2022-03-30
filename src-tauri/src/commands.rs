use crate::profiles::{
    Profiles,
    Profile,
};

use std::path::PathBuf;

use crate::paths;

#[tauri::command]
pub fn get_profiles() -> Profiles {
    let launcher_profiles_path = paths::minecraft_path(
        Some(PathBuf::from("launcher_profiles.json"))
    );
    
    // println!("{:?}", launcher_profiles_path);

    let profiles = Profiles::new(launcher_profiles_path);
    profiles
}