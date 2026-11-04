. "C:\Users\vikra\.gemini\antigravity\scratch\mathnotes\wp_client.ps1"
$headers = Get-WPHeaders

Write-Host "=== TESTING PLUGIN ENDPOINT PERMISSIONS ==="
try {
    $plugins = Invoke-RestMethod -Uri "$global:WP_SITE_URL/wp-json/wp/v2/plugins" -Headers $headers -Method Get -TimeoutSec 10
    Write-Host "Found $($plugins.Count) installed plugins on server."
    $active = $plugins | Where-Object { $_.status -eq 'active' }
    Write-Host "Active plugins count: $($active.Count)"
} catch {
    Write-Host "Plugins GET error: $($_.Exception.Message)"
}
