. "C:\Users\vikra\.gemini\antigravity\scratch\mathnotes\wp_client.ps1"
$headers = Get-WPHeaders

try {
    $logs = Invoke-RestMethod -Uri "$global:WP_SITE_URL/wp-json/aipkit/v1/logs" -Headers $headers -Method Get -TimeoutSec 10
    $logs | ConvertTo-Json -Depth 3
} catch {
    Write-Host "Logs error: $($_.Exception.Message)"
}
