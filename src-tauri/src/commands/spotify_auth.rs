use reqwest::Client;
use serde::Serialize;
use tauri::command;

use crate::auth::pkce;
use crate::spotify::models::SpotifyUserProfile;
use crate::spotify::token_exchange;
use crate::storage::secure_store;

#[derive(Debug, Serialize)]
pub struct AuthStartResult {
    pub auth_url: String,
    pub code_verifier: String,
}

#[command]
pub async fn start_spotify_auth(client_id: String, redirect_uri: String) -> Result<AuthStartResult, String> {
    let code_verifier = pkce::generate_code_verifier();
    let code_challenge = pkce::generate_code_challenge(&code_verifier);

    let scopes = "user-read-playback-state user-modify-playback-state user-read-currently-playing user-read-email user-read-private";

    let auth_url = pkce::build_spotify_auth_url(
        &client_id,
        &redirect_uri,
        &code_challenge,
        scopes,
    );

    Ok(AuthStartResult {
        auth_url,
        code_verifier,
    })
}

#[command]
pub async fn complete_spotify_auth(
    code: String,
    code_verifier: String,
    redirect_uri: String,
    client_id: String,
) -> Result<SpotifyUserProfile, String> {
    let token_response =
        token_exchange::exchange_code(&code, &redirect_uri, &client_id, &code_verifier).await?;

    let expires_at =
        crate::storage::secure_store::get_unix_timestamp() + token_response.expires_in;

    let token_data = crate::spotify::models::SpotifyTokenData {
        access_token: token_response.access_token.clone(),
        refresh_token: token_response.refresh_token.clone(),
        expires_at,
        scope: token_response.scope.clone(),
    };

    secure_store::store_token(&token_data)?;

    let client = Client::new();
    let resp = client
        .get("https://api.spotify.com/v1/me")
        .bearer_auth(&token_response.access_token)
        .send()
        .await
        .map_err(|e| format!("Network error: {e}"))?;

    if resp.status().is_success() {
        resp.json::<SpotifyUserProfile>()
            .await
            .map_err(|e| format!("Parse error: {e}"))
    } else {
        Err(format!("Failed to fetch user profile: {}", resp.status()))
    }
}

#[command]
pub async fn refresh_spotify_token(client_id: String) -> Result<String, String> {
    let token_data = secure_store::get_stored_token()
        .map_err(|e| e)?
        .ok_or_else(|| "No stored token".to_string())?;

    let refresh = token_data
        .refresh_token
        .ok_or_else(|| "No refresh token".to_string())?;

    let response = token_exchange::refresh_token(&refresh, &client_id).await?;

    let expires_at = secure_store::get_unix_timestamp() + response.expires_in;

    let new_token_data = crate::spotify::models::SpotifyTokenData {
        access_token: response.access_token.clone(),
        refresh_token: Some(response.refresh_token.unwrap_or(refresh)),
        expires_at,
        scope: response.scope.clone(),
    };

    secure_store::store_token(&new_token_data)?;

    Ok(response.access_token)
}

#[command]
pub fn get_stored_spotify_token() -> Result<Option<crate::spotify::models::SpotifyTokenData>, String> {
    secure_store::get_stored_token()
}

#[command]
pub fn logout_spotify() -> Result<(), String> {
    secure_store::delete_token()
}
