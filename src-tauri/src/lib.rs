mod auth;
mod commands;
mod spotify;
mod storage;

use tauri::{Emitter, Manager};
use tauri_plugin_deep_link::DeepLinkExt;

fn handle_auth_code(code: String, handle: &tauri::AppHandle) {
    let pending = crate::commands::spotify_auth::PENDING_AUTH.lock();
    let Ok(mut pending) = pending else {
        return;
    };
    let Some(auth) = pending.take() else {
        return;
    };

    let handle = handle.clone();
    tauri::async_runtime::spawn(async move {
        match crate::commands::spotify_auth::complete_spotify_auth(
            code,
            auth.code_verifier,
            auth.redirect_uri,
            auth.client_id,
        )
        .await
        {
            Ok(_) => {
                let _ = handle.emit("spotify-auth-complete", true);
            }
            Err(e) => {
                let _ = handle.emit("spotify-auth-error", e);
            }
        }
    });
}

fn focus_main_window(app: &tauri::AppHandle) {
    if let Some(window) = app.get_webview_window("main") {
        let _ = window.unminimize();
        let _ = window.show();
        let _ = window.set_focus();
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let mut builder = tauri::Builder::default();

    builder = builder.plugin(tauri_plugin_single_instance::init(|app, args, _cwd| {
        focus_main_window(app);
        for arg in args {
            if arg.starts_with("jammate://callback") {
                if let Ok(url) = url::Url::parse(&arg) {
                    if let Some(code) = url
                        .query_pairs()
                        .find(|(k, _)| k == "code")
                        .map(|(_, v)| v.to_string())
                    {
                        handle_auth_code(code, app);
                    }
                }
            }
        }
    }));

    builder
        .plugin(tauri_plugin_deep_link::init())
        .setup(|app| {
            let handle = app.handle().clone();

            let _ = app.deep_link().register_all();

            app.deep_link().on_open_url(move |event| {
                for url in event.urls() {
                    let url_str = url.to_string();
                    if url_str.starts_with("jammate://callback") {
                        if let Some(code) = url
                            .query_pairs()
                            .find(|(k, _)| k == "code")
                            .map(|(_, v)| v.to_string())
                        {
                            handle_auth_code(code, &handle);
                        }
                    }
                }
            });

            if let Ok(Some(urls)) = app.deep_link().get_current() {
                let handle = app.handle().clone();
                for url in urls {
                    let url_str = url.to_string();
                    if url_str.starts_with("jammate://callback") {
                        if let Some(code) = url
                            .query_pairs()
                            .find(|(k, _)| k == "code")
                            .map(|(_, v)| v.to_string())
                        {
                            handle_auth_code(code, &handle);
                        }
                    }
                }
            }

            Ok(())
        })
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
