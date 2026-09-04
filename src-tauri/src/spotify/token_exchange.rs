use reqwest::Client;
use serde::{Deserialize, Serialize};

use super::models::SpotifyTokenResponse;

#[derive(Debug, Serialize)]
struct TokenExchangeRequest {
    grant_type: String,
    code: String,
    redirect_uri: String,
    client_id: String,
    code_verifier: String,
}

#[derive(Debug, Serialize)]
struct RefreshRequest {
    grant_type: String,
    refresh_token: String,
    client_id: String,
}

#[derive(Debug, Deserialize)]
pub struct TokenErrorResponse {
    pub error: Option<String>,
    pub error_description: Option<String>,
}

pub async fn exchange_code(
    code: &str,
    redirect_uri: &str,
    client_id: &str,
    code_verifier: &str,
) -> Result<SpotifyTokenResponse, String> {
    let client = Client::new();
    let params = TokenExchangeRequest {
        grant_type: "authorization_code".to_string(),
        code: code.to_string(),
        redirect_uri: redirect_uri.to_string(),
        client_id: client_id.to_string(),
        code_verifier: code_verifier.to_string(),
    };

    let response = client
        .post("https://accounts.spotify.com/api/token")
        .header("Content-Type", "application/x-www-form-urlencoded")
        .form(&params)
        .send()
        .await
        .map_err(|e| format!("Network error: {e}"))?;

    if response.status().is_success() {
        response
            .json::<SpotifyTokenResponse>()
            .await
            .map_err(|e| format!("Parse error: {e}"))
    } else {
        let err: TokenErrorResponse = response
            .json()
            .await
            .unwrap_or(TokenErrorResponse {
                error: None,
                error_description: None,
            });
        Err(format!(
            "Token exchange failed: {} {}",
            err.error.unwrap_or_default(),
            err.error_description.unwrap_or_default()
        ))
    }
}

pub async fn refresh_token(
    refresh_token: &str,
    client_id: &str,
) -> Result<SpotifyTokenResponse, String> {
    let client = Client::new();
    let params = RefreshRequest {
        grant_type: "refresh_token".to_string(),
        refresh_token: refresh_token.to_string(),
        client_id: client_id.to_string(),
    };

    let response = client
        .post("https://accounts.spotify.com/api/token")
        .header("Content-Type", "application/x-www-form-urlencoded")
        .form(&params)
        .send()
        .await
        .map_err(|e| format!("Network error: {e}"))?;

    if response.status().is_success() {
        response
            .json::<SpotifyTokenResponse>()
            .await
            .map_err(|e| format!("Parse error: {e}"))
    } else {
        let err: TokenErrorResponse = response
            .json()
            .await
            .unwrap_or(TokenErrorResponse {
                error: None,
                error_description: None,
            });
        Err(format!(
            "Token refresh failed: {} {}",
            err.error.unwrap_or_default(),
            err.error_description.unwrap_or_default()
        ))
    }
}
