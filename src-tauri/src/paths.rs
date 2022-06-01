use std::path::{
    Path,
    PathBuf
};

use std::fs;

use directories::{
    BaseDirs,
    ProjectDirs,
};

/// Get .minecraft path
/// Only supports default path
pub fn minecraft_path(extra: Option<PathBuf>) -> PathBuf {
    let path = BaseDirs::new().unwrap();
    let mut path = path.data_dir()
        .strip_prefix("C:/")
        .unwrap()
        .join(".minecraft");

    if let Some(i) = extra {
        path.push(i);
    }

    Path::new("C:/").join(path)
}

/// Return cache directory with optional path parameter
pub fn cache_path(extra: Option<PathBuf>) -> PathBuf {
    let path = if let Some(proj_dirs) = ProjectDirs::from("com", "Cyclip", "shulker") {
        let x = proj_dirs.cache_dir();
        x.to_path_buf()
    } else {
        panic!("couldnt get project dirs");
    };

    if let Some(f) = extra {
        PathBuf::from(path).join(f)
    } else {
        PathBuf::from(path)
    }
}