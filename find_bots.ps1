. "C:\Users\vikra\.gemini\antigravity\scratch\mathnotes\wp_client.ps1"
$headers = Get-WPHeaders

Write-Host "=== POST TYPES ==="
try {
    $types = Invoke-RestMethod -Uri "$global:WP_SITE_URL/wp-json/wp/v2/types" -Headers $headers -Method Get -TimeoutSec 10
    $types.PSObject.Properties | Select-Object Name | Format-Table -AutoSize
} catch {
    Write-Host "Types error: $($_.Exception.Message)"
}
