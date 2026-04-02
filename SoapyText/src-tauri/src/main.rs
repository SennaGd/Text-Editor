// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

fn main() {
    let file_path: &str = "src-tauri/src/test.txt";
    println!("In file {file_path}");
    soapytext_lib::run()
}
