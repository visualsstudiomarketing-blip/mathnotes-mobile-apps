. "C:\Users\vikra\.gemini\antigravity\scratch\mathnotes\wp_client.ps1"
$headers = Get-WPHeaders

for ($id = 1; $id -le 50; $id++) {
    try {
        $res = Invoke-RestMethod -Uri "$global:WP_SITE_URL/wp-json/aipkit/v1/chatbots/$id/embed-config" -Headers $headers -Method Get -TimeoutSec 3
        if ($res.config) {
            Write-Host "FOUND BOT: ID = $($res.config.botId) | Name = $($res.config.headerName) | starters = $($res.config.starters -join '; ')"
        }
    } catch {
        # ignore 404
    }
}
