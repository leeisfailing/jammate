use keyring::Entry;
use std::time::{SystemTime, UNIX_EPOCH};

use crate::spotify::models::SpotifyTokenData;

const SERVICE_NAME: &str = "com.jammate.app";
const TOKEN_KEY: &str = "spotify_token";

pub fn store_token(token_data: &SpotifyTokenData) -> Result<(), String> {
    let entry =
        Entry::new(SERVICE_NAME, TOKEN_KEY).map_err(|e| format!("Keyring error: {e}"))?;
    let json = serde_json::to_string(token_data).map_err(|e| format!("Serialize error: {e}"))?;
    entry
        .set_password(&json)
        .map_err(|e| format!("Store error: {e}"))?;
    Ok(())
}

pub fn get_stored_token() -> Result<Option<SpotifyTokenData>, String> {
    let entry =
        Entry::new(SERVICE_NAME, TOKEN_KEY).map_err(|e| format!("Keyring error: {e}"))?;
    match entry.get_password() {
        Ok(json) => {
            let data: SpotifyTokenData =
                serde_json::from_str(&json).map_err(|e| format!("Deserialize error: {e}"))?;
            Ok(Some(data))
        }
        Err(keyring::Error::NoEntry) => Ok(None),
        Err(e) => Err(format!("Read error: {e}")),
    }
}

pub fn delete_token() -> Result<(), String> {
    let entry =
        Entry::new(SERVICE_NAME, TOKEN_KEY).map_err(|e| format!("Keyring error: {e}"))?;
    match entry.delete_credential() {
        Ok(()) => Ok(()),
        Err(keyring::Error::NoEntry) => Ok(()),
        Err(e) => Err(format!("Delete error: {e}")),
    }
}

pub fn is_token_expired(token_data: &SpotifyTokenData) -> bool {
    let now = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .unwrap()
        .as_secs();
    now >= token_data.expires_at
}

pub fn get_unix_timestamp() -> u64 {
    SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .unwrap()
        .as_secs()
}
