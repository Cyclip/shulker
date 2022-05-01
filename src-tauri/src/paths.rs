use std::path::{
    Path,
    PathBuf
};

use std::fs;

use directories::BaseDirs;

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
