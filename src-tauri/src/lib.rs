mod auth;
mod commands;
mod spotify;
mod storage;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_deep_link::init())
        .invoke_handler(tauri::generate_handler![
            commands::spotify_auth::start_spotify_auth,
            commands::spotify_auth::complete_spotify_auth,
            commands::spotify_auth::refresh_spotify_token,
            commands::spotify_auth::get_stored_spotify_token,
            commands::spotify_auth::logout_spotify,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
