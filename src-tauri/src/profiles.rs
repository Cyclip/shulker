use std::fs;

use std::path::{
    Path,
    PathBuf,
};

use serde_json::{
    Value,
    map::Map,
};

use serde::{
    Serialize,
    Deserialize,
};

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

/// ALl details pertaining a single profit
/// Used when selecting a profile
#[derive(Serialize, Deserialize)]
pub struct DetailedProfile {
    created: String,
    icon: String,
    java_args: String,
    last_used: String,
    last_version_id: String,
    name: String,
    prof_type: String,
}

impl DetailedProfile {
    pub fn new(path: PathBuf, id: String) -> Result<DetailedProfile, String> {
        let profile_val = read_json(&path);
        let profile_obj = profile_val["profiles"][id].as_object().expect("cant find specific profile by id");

        let created = match DetailedProfile::handle_index(&profile_obj, "created") {
            Ok(x) => x,
            Err(e) => {return Err(e)}
        };

        let icon = match DetailedProfile::handle_index(&profile_obj, "icon") {
            Ok(x) => x,
            Err(e) => {return Err(e)}
        };

        let java_args = match DetailedProfile::handle_index(&profile_obj, "javaArgs") {
            Ok(x) => x,
            Err(e) => {return Err(e)}
        };

        let last_used = match DetailedProfile::handle_index(&profile_obj, "lastUsed") {
            Ok(x) => x,
            Err(e) => {return Err(e)}
        };

        let last_version_id = match DetailedProfile::handle_index(&profile_obj, "lastVersionId") {
            Ok(x) => x,
            Err(e) => {return Err(e)}
        };

        let name = match DetailedProfile::handle_index(&profile_obj, "name") {
            Ok(x) => x,
            Err(e) => {return Err(e)}
        };

        let prof_type = match DetailedProfile::handle_index(&profile_obj, "type") {
            Ok(x) => x,
            Err(e) => {return Err(e)}
        };

        Ok(DetailedProfile {
            created,
            icon,
            java_args,
            last_used,
            last_version_id,
            name,
            prof_type: prof_type,
        })
    }

    /// Save profile to path
    pub fn save(&self, id: String, path: PathBuf) -> Result<(), String> {
        let mut profile_val = read_json(&path);

        // modify
        if let Value::Object(_obj) = &mut profile_val["profiles"][id] {
            *_obj = self.make_object();
        }

        println!("profile val: {:#?}", &profile_val);

        // serialize into json to path
        let file = match fs::OpenOptions::new()
            .write(true)
            .open(path) {
                Ok(x) => x,
                Err(e) => {
                    return Err(format!("error while opening file: {}", e));
                }
            };

        match serde_json::to_writer_pretty(&file, &profile_val) {
            Ok(x) => Ok(x),
            Err(e) => Err(format!("error while saving json: {}", e))
        }
    }

    /// Convert to a serde_json Value object
    fn make_object(&self) -> Map<String, Value> {
        let mut map = Map::new();

        map.insert("created".to_string(), Value::String(self.created.clone()));
        map.insert("icon".to_string(), Value::String(self.icon.clone()));
        map.insert("javaArgs".to_string(), Value::String(self.java_args.clone()));
        map.insert("lastUsed".to_string(), Value::String(self.last_used.clone()));
        map.insert("lastVersionId".to_string(), Value::String(self.last_version_id.clone()));
        map.insert("name".to_string(), Value::String(self.name.clone()));
        map.insert("type".to_string(), Value::String(self.prof_type.clone()));

        map
    }

    fn handle_index(profile_obj: &Map<String, Value>, index: &str) -> Result<String, String> {
        if profile_obj.contains_key(index) {
            Ok(profile_obj[index].to_string())
        } else {
            Err(format!("invalid profile, missing key {:?}", index))
        }
    }
}

impl Profiles {
    pub fn new(path: PathBuf) -> Profiles {
        let profile_val = read_json(&path);
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

            if version_id.starts_with("latest-") {
                continue;
            }

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

fn read_json(path: &PathBuf) -> Value {
    let file_contents = match fs::read_to_string(path) {
        Ok(x) => x,
        Err(e) => {
            panic!("cant read launcher profiles, {}", e);
        }
    };

    let value = serde_json::from_str(&file_contents).expect("failed to jsonify launcher profiles");
    value
}