use std::fs;
use std::path::{
    Path,
    PathBuf,
};
use serde_json::{
    Value,
};
use serde::{Serialize};

/// Vector of basic profile details
#[derive(Serialize)]
pub struct Profiles {
    pub profiles: Vec<Profile>
}

/// Details pertaining a single profile
#[derive(Serialize)]
pub struct Profile {
    pub id: String,
    pub name: String,
    pub version_id: String,
}

impl Profiles {
    pub fn new(path: PathBuf) -> Profiles {
        let profile_val = read_json(path);
        let profiles_obj = profile_val["profiles"].as_object().expect("cant find profiles key");

        let mut profiles: Vec<Profile> = Vec::new();
        for (id, val) in profiles_obj.iter() {
            let name = match val["name"].as_str() {
                Some(x) => x,
                None => {
                    println!("WARNING: Skipping profile (missing name)");
                    continue;
                }
            };

            let version_id = match val["lastVersionId"].as_str() {
                Some(x) => x,
                None => {
                    println!("WARNING: Skipping profile {} (missing version_id)", name);
                    continue;
                }
            };

            profiles.push(Profile {
                id: id.to_string(),
                name: name.to_string(),
                version_id: version_id.to_string(),
            });
        }

        Profiles {
            profiles
        }
    }
}

fn read_json(path: PathBuf) -> Value {
    println!("path: {:?}", path);
    let file_contents = match fs::read_to_string(path) {
        Ok(x) => x,
        Err(e) => {
            panic!("cant read launcher profiles, {}", e);
        }
    };

    let value = serde_json::from_str(&file_contents).expect("failed to jsonify launcher profiles");
    value
}