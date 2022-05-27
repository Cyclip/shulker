// manage downloads

use std::io;
use std::fs::File;
use std::path::PathBuf;

pub fn download_file(url: String, path: PathBuf) -> Result<(), String> {
    println!("Downloading {} to {:?}", url, path);
    let mut req = ureq::get(&url)
        .call().expect("failed call")
        .into_reader();

    let mut out = File::create(path).expect("failed to create file");
    io::copy(&mut req, &mut out).expect("failed to copy");
    Ok(())
}