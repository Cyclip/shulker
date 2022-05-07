use crate::{
    paths,
};

use serde_json::{
    Value,
};

use std::fs;
use std::path::PathBuf;

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
    raw.replace("+", " ")
}

fn is_installed(installed: &Vec<String>, test: &String) -> bool {
    println!("{:?}: {}", test, installed.contains(&test));
    
    installed.contains(&test)
}