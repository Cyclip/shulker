use serde_json::{
    Value,
};

use std::path::{
    Path,
    PathBuf
};

use std::fs;

/// Get path to data store
pub fn data_path(target: &str) -> PathBuf {
    let path = directories::ProjectDirs::from("com", "Cyclip", "shulker").expect("couldnt get data path");

    fs::create_dir_all(path.config_dir()).expect("couldnt create data path");

    let path = path.config_dir()
        .strip_prefix("C:/")
        .unwrap()
        .join(target);

    Path::new("C:/").join(path)
}

/// Read preferences.json from data
pub fn read_preferences() -> Value {
    let path = data_path("preferences.json");
    let file_contents = match fs::read_to_string(path) {
        Ok(x) => x,
        Err(e) => {
            panic!("cant read preferences, {}", e);
        }
    };

    let value = serde_json::from_str(&file_contents).expect("failed to jsonify preferences");
    value
}