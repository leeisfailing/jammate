fn main() {
    tauri_build::try_build(
        tauri_build::Attributes::new().app_manifest(
            tauri_build::AppManifest::new()
                .commands(&[
                    "start_spotify_auth",
                    "complete_spotify_auth",
                    "refresh_spotify_token",
                    "get_stored_spotify_token",
                    "logout_spotify",
                ]),
        ),
    )
    .unwrap();
}
