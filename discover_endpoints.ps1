. "C:\Users\vikra\.gemini\antigravity\scratch\mathnotes\wp_client.ps1"
$headers = Get-WPHeaders

Write-Host "=== DISCOVERING AIPKIT / AI PUFFER ENDPOINTS ==="
try {
    $schema = Invoke-RestMethod -Uri "$global:WP_SITE_URL/wp-json/aipkit/v1" -Headers $headers -Method Get -TimeoutSec 10
    $schema.routes.PSObject.Properties | Select-Object Name | Format-Table -AutoSize
} catch {
    Write-Host "AIPKit v1 error: $($_.Exception.Message)"
}

Write-Host "=== DISCOVERING TUTOR LMS REST ENDPOINTS ==="
try {
    $tutorSchema = Invoke-RestMethod -Uri "$global:WP_SITE_URL/wp-json/tutor/v1" -Headers $headers -Method Get -TimeoutSec 10
    $tutorSchema.routes.PSObject.Properties | Select-Object Name | Format-Table -AutoSize
} catch {
    Write-Host "Tutor v1 error: $($_.Exception.Message)"
}
