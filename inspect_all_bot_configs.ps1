. "C:\Users\vikra\.gemini\antigravity\scratch\mathnotes\wp_client.ps1"
$headers = Get-WPHeaders

Write-Host "=== SCANNING FOR CHATBOTS BY EMBED-CONFIG ==="
for ($id = 1; $id -le 30; $id++) {
    try {
        $raw = Invoke-RestMethod -Uri "$global:WP_SITE_URL/wp-json/aipkit/v1/chatbots/$id/embed-config" -Headers $headers -Method Get -TimeoutSec 5
        if ($raw.Length -gt 100) {
            Write-Host "--- BOT ID: $id (length $($raw.Length)) ---"
            if ($raw -match '"headerName":"([^"]+)"') {
                Write-Host "  headerName: $($matches[1])"
            }
            if ($raw -match '"popupLabelText":"([^"]+)"') {
                Write-Host "  popupLabelText: $($matches[1])"
            }
            if ($raw -match '"provider":"([^"]+)"') {
                Write-Host "  provider: $($matches[1])"
            }
            if ($raw -match '"starters":\[([^\]]+)\]') {
                Write-Host "  starters: $($matches[1])"
            }
            if ($raw -match '"botId":(\d+)') {
                Write-Host "  botId: $($matches[1])"
            }
        }
    } catch {
        # ignore
    }
}
