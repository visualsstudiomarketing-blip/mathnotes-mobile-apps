. "C:\Users\vikra\.gemini\antigravity\scratch\mathnotes\wp_client.ps1"
$headers = Get-WPHeaders

Write-Host "=== SCANNING FOR AIPKIT CHATBOTS ==="
for ($id = 1; $id -le 30; $id++) {
    try {
        $bot = Invoke-RestMethod -Uri "$global:WP_SITE_URL/wp-json/aipkit/v1/chatbots/$id/embed-config" -Headers $headers -Method Get -TimeoutSec 5
        Write-Host "FOUND BOT ID: $id"
        $bot | ConvertTo-Json -Depth 3
    } catch {
        # not found
    }
}
