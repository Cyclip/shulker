pub mod installed {
    use crate::{
        paths,
    };
    
    use serde_json::{
        Value,
    };
    
    use std::fs;
    use std::path::PathBuf;

    use serde::{
        Serialize,
        Deserialize,
    };
    
    use std::fs::File;
    use std::io::prelude::*;
    use sha1::{Sha1, Digest};
    use std::ffi::OsStr;
    
    /// Represents a single resource pack
    #[derive(Serialize, Deserialize)]
    pub struct Pack {
        // display name of resource pack
        name: String,

        // description in pack.mcmeta
        desc: String,

        // file name of resource pack
        filename: String,

        // path to the cached image file
        cached_img_path: String,

        // path to resource pack .zip
        path: String,
    }

    impl Pack {
        /// Construct pack from cached directory
        /// cache_dir: PathBuf of the cached directory
        /// pack_dir: PathBuf of the .zip resource pack file
        fn from_cached_dir(cache_dir: &PathBuf, pack_dir: &PathBuf) -> Pack {
            let mcmeta_path = cache_dir.join("pack.mcmeta");
            let png_path = cache_dir.join("pack.png");
            let path_slice = pack_dir.as_path();

            let name = Pack::os_to_string(path_slice.file_stem().expect("invalid filename stem"));
            let filename = Pack::os_to_string(path_slice.file_name().expect("invalid filename"));
            let desc = Pack::get_desc(&mcmeta_path).expect("invalid desc");
            let cached_img_path = png_path.to_str().expect("invalid unicode png path").to_owned();
            let path = pack_dir.to_str().expect("invalid unicode png path").to_owned();

            Pack {
                name,
                desc,
                filename,
                cached_img_path,
                path,
            }
        }

        fn os_to_string(s: &OsStr) -> String {
            s.to_str().unwrap().into()
        }

        fn get_desc(path: &PathBuf) -> Result<String, String> {
            let json: Value = Pack::read_json(path);
            let desc = match json["pack"]["description"].as_str() {
                Some(x) => x,
                None => {
                    return Err("no desc".to_owned());
                }
            };

            Ok(desc.to_owned())
        }

        fn read_json(path: &PathBuf) -> Value {
            let file_contents = match fs::read_to_string(path) {
                Ok(x) => x,
                Err(e) => {
                    panic!("cant read json, {}", e);
                }
            };
        
            let value = serde_json::from_str(&file_contents).expect("failed to jsonify launcher profiles");
            value
        }
    }

    /// Get a vector of resource packs
    pub fn get_installed_packs(base_dir: PathBuf, cache_dir: PathBuf) -> Result<Vec<Pack>, String> {
        // get all files and their filenames
        let resource_path = paths::minecraft_path(Some(PathBuf::from("resourcepacks")));
        let mut packs: Vec<Pack> = Vec::new();

        for file in fs::read_dir(resource_path).expect("couldnt read resource folder") {
            let file = file.unwrap();

            let filename: String = match file.file_name().into_string() {
                Ok(x) => x,
                Err(_) => {continue;}
            };

            let file_path = file.path();
            let hash = get_hash(&filename);

            let hash_dir = cache_dir.join(hash);

            // cache if needed
            if !(hash_dir.exists() && hash_dir.is_dir()) {
                // is not hashed, so extract
                let mut mcmeta_contents: Vec<u8> = Vec::new();
                let mut png_contents: Vec<u8> = Vec::new();
                
                let zipfile = File::open(&file_path).unwrap();
                extract_to(&zipfile, "pack.mcmeta", &mut mcmeta_contents).expect("failed mcmeta");
                extract_to(&zipfile, "pack.png", &mut png_contents).expect("failed png");
                
                // cache output
                cache_contents(&hash_dir, mcmeta_contents, png_contents);

            }
            
            // create pack from cached dir
            packs.push(
                Pack::from_cached_dir(&hash_dir, &file_path)
            );

        }

        Ok(packs)
    }

    fn cache_contents(dir: &PathBuf, mcmeta: Vec<u8>, png: Vec<u8>) -> Result<(), String> {
        // ensure the directory is valid
        match fs::create_dir_all(dir) {
            Ok(_) => {},
            Err(e) => {
                println!("error creating cache dir {:?}: {}", dir, e);
                return Err(e.to_string());
            }
        };

        //  file paths
        let mcmeta_path = dir.join("pack.mcmeta");
        let png_path = dir.join("pack.png");

        // write to
        match write_to(mcmeta_path, mcmeta) {
            Ok(_) => {},
            Err(e) => {return Err(e.to_string());}
        };

        match write_to(png_path, png) {
            Ok(_) => {},
            Err(e) => {return Err(e.to_string());}
        };

        Ok(())
    }

    fn write_to(path: PathBuf, contents: Vec<u8>) -> Result<(), String> {
        match File::create(&path) {
            Ok(mut x) => {
                match x.write(&contents) {
                    Ok(_) => {},
                    Err(e) => {
                        println!("error writing to file {:?}: {}", &path, e);
                        return Err(e.to_string());
                    }
                }
            },
            Err(e) => {
                println!("error creating file {:?}: {}", path, e);
                return Err(e.to_string());
            }
        }

        Ok(())
    }

    /// Extract a file from a .zip into a Vec<u8>
    fn extract_to(from_file: &File, filename: &str, out: &mut Vec<u8>) -> Result<(), String> {
        let mut archive = zip::ZipArchive::new(from_file).unwrap();
        let mut file = match archive.by_name(filename) {
            Ok(x) => x,
            Err(e) => {
                return Err(e.to_string());
            }
        };

        file.read_to_end(out);
        Ok(())
    }

    /// compute hashed result
    fn get_hash(s: &String) -> String {
        let mut hasher = Sha1::new();
        hasher.update(s.as_bytes());
        let result = hasher.finalize();
        format!("{:x}", result)
    }
}

pub mod search {
    use crate::{
        paths,
    };

    use serde_json::{
        Value,
    };

    use std::fs;
    use std::path::PathBuf;

    /// From an array of packs, identify which are already installed
    pub fn get_installed_packs(packs: Value) -> Vec<String> {
        // get all installed lists
        let all_installed = get_all_installed();
        println!("installed: {:?}", all_installed);

        // name of the given packs that are installed
        let mut matching_installed: Vec<String> = Vec::new();

        for (key, value) in packs.as_object().unwrap() {
            let valid_names: Vec<String> = match value.as_array() {
                Some(x) => parse_filenames(x),
                None => {continue;}
            };

            let is_installed = valid_names.iter().any(
                |x| is_installed(&all_installed, x)
            );


            if is_installed {
                matching_installed.push(key.to_string());
            }
        }

        matching_installed
    }

    fn parse_filenames(filenames: &Vec<Value>) -> Vec<String> {
        let rv: Vec<String> = filenames.into_iter()
            .map(|x| x.as_str().expect("non-string").to_string())
            .collect();
        rv
    }

    /// Get all resource packs filenames
    fn get_all_installed() -> Vec<String> {
        let resource_path = paths::minecraft_path(Some(PathBuf::from("resourcepacks")));

        let paths: Vec<String> = fs::read_dir(resource_path).expect("couldnt read resourcepacks folder")
            .map(
                |path| get_filename(path.unwrap())
            )
            .collect();
        
        paths
    }

    fn get_filename(path: fs::DirEntry) -> String {
        let raw = path.path().file_name().unwrap().to_string_lossy().into_owned();
        // downloading might result in '+' instead of ' ' in the filenames
        // raw.replace("+", " ")
        raw
    }

    fn is_installed(installed: &Vec<String>, test: &String) -> bool {
        println!("{:?}: {}", test, installed.contains(&test));
        
        installed.contains(&test)
    }
}