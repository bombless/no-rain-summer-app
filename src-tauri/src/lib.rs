// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/


#[tauri::command]
async fn get_data(url: String) -> Result<String, String> {
    println!("Fetching data from: {}", url);
    let resp = reqwest::get(&url).await.map_err(|e| e.to_string())?;
    println!("Response status: {}", resp.status());
    let body = resp.text().await.map_err(|e| e.to_string())?;
    if body.chars().count() > 99 {
        println!("Data fetched successfully: {}...", body.chars().take(99).collect::<String>());
    } else {
        println!("Data fetched successfully: {}", body);
    }
    Ok(body)
}
#[tauri::command]
async fn log_string(msg: String) -> Result<(), ()> {
    println!("[LOG] {}", msg);
    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![get_data, log_string])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
