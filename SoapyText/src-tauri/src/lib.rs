// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
use std::env;
use std::fs;
// use std::fs;
// use std::io::Error;

// #[tauri::command]
// fn read_file(filepath: &str) -> Result<String, Error> {
//     let contents = fs::read_to_string(filepath)?;
//     Ok(contents)
// }
#[tauri::command]
fn overwrite_file(filepath: &str, text: &str) {
    let _ = fs::write(filepath, text);
}



#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_global_shortcut::Builder::new().build())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![overwrite_file])
        // .invoke_handler(tauri::generate_handler![read_file])

        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
