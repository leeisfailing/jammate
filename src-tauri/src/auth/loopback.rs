use tokio::io::{AsyncReadExt, AsyncWriteExt};
use tokio::net::{TcpListener, TcpStream};
use tokio::time::{timeout, Duration};
use url::Url;

const CALLBACK_TIMEOUT_SECS: u64 = 180;

pub fn is_loopback_redirect(redirect_uri: &str) -> bool {
    Url::parse(redirect_uri)
        .ok()
        .and_then(|u| u.host_str().map(|h| h == "127.0.0.1"))
        .unwrap_or(false)
}

pub fn callback_path(redirect_uri: &str) -> Result<String, String> {
    let parsed = parse_loopback_uri(redirect_uri)?;
    Ok(parsed.path().to_string())
}

pub async fn bind(redirect_uri: &str) -> Result<TcpListener, String> {
    let parsed = parse_loopback_uri(redirect_uri)?;
    let port = parsed
        .port()
        .ok_or_else(|| "Redirect URI must include a port".to_string())?;

    TcpListener::bind(("127.0.0.1", port))
        .await
        .map_err(|e| format!("Could not listen on 127.0.0.1:{port}: {e}"))
}

pub async fn accept_auth_code(
    listener: TcpListener,
    expected_path: &str,
) -> Result<String, String> {
    let (mut socket, _) = timeout(Duration::from_secs(CALLBACK_TIMEOUT_SECS), listener.accept())
        .await
        .map_err(|_| "Spotify login timed out. Please try again.".to_string())?
        .map_err(|e| format!("Callback connection failed: {e}"))?;

    let request = read_http_request(&mut socket).await?;
    let callback = parse_request_url(&request)?;

    if let Some(error) = query_value(&callback, "error") {
        let description = query_value(&callback, "error_description").unwrap_or_default();
        let _ = write_html(
            &mut socket,
            400,
            "Authorization did not complete. You can close this tab.",
        )
        .await;
        return Err(format!("Spotify authorization failed: {error} {description}"));
    }

    if !paths_match(callback.path(), expected_path) {
        let _ = write_html(&mut socket, 404, "Unexpected callback path.").await;
        return Err("Spotify callback path did not match the redirect URI.".into());
    }

    let code = query_value(&callback, "code")
        .ok_or_else(|| "No authorization code in Spotify callback".to_string())?;

    write_html(
        &mut socket,
        200,
        "Connected to Spotify. You can close this tab and return to JamMate.",
    )
    .await?;

    Ok(code)
}

fn parse_loopback_uri(redirect_uri: &str) -> Result<Url, String> {
    let parsed = Url::parse(redirect_uri).map_err(|e| format!("Invalid redirect URI: {e}"))?;
    if parsed.scheme() != "http" || parsed.host_str() != Some("127.0.0.1") {
        return Err("Redirect URI must be http://127.0.0.1:PORT/callback".into());
    }
    Ok(parsed)
}

fn paths_match(received: &str, expected: &str) -> bool {
    received.trim_end_matches('/') == expected.trim_end_matches('/')
}

fn query_value(url: &Url, key: &str) -> Option<String> {
    url.query_pairs()
        .find(|(k, _)| k == key)
        .map(|(_, v)| v.into_owned())
}

fn parse_request_url(request: &str) -> Result<Url, String> {
    let path_and_query = request
        .lines()
        .next()
        .and_then(|line| line.split_whitespace().nth(1))
        .ok_or_else(|| "Invalid HTTP callback request".to_string())?;
    Url::parse(&format!("http://127.0.0.1{path_and_query}"))
        .map_err(|_| "Invalid Spotify callback URL".to_string())
}

async fn read_http_request(socket: &mut TcpStream) -> Result<String, String> {
    let mut buf = Vec::new();
    let mut chunk = [0u8; 1024];
    loop {
        let n = socket
            .read(&mut chunk)
            .await
            .map_err(|e| format!("Failed to read Spotify callback: {e}"))?;
        if n == 0 {
            break;
        }
        buf.extend_from_slice(&chunk[..n]);
        if buf.windows(4).any(|w| w == b"\r\n\r\n") || buf.len() > 16_384 {
            break;
        }
    }
    String::from_utf8(buf).map_err(|_| "Spotify callback was not valid UTF-8".to_string())
}

async fn write_html(socket: &mut TcpStream, status: u16, message: &str) -> Result<(), String> {
    let reason = if status == 200 { "OK" } else { "Bad Request" };
    let body = format!(
        "<!DOCTYPE html><html><body style=\"font-family:Segoe UI,sans-serif;background:#0c0c0c;color:#f2f2f2;display:flex;align-items:center;justify-content:center;height:100vh;margin:0\"><p>{message}</p></body></html>"
    );
    let response = format!(
        "HTTP/1.1 {status} {reason}\r\nContent-Type: text/html; charset=utf-8\r\nContent-Length: {}\r\nConnection: close\r\n\r\n{body}",
        body.len()
    );
    socket
        .write_all(response.as_bytes())
        .await
        .map_err(|e| format!("Failed to write callback response: {e}"))?;
    let _ = socket.flush().await;
    Ok(())
}
