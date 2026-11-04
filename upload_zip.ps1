. "C:\Users\vikra\.gemini\antigravity\scratch\mathnotes\wp_client.ps1"
$headers = Get-WPHeaders
$zipPath = "C:\Users\vikra\.gemini\antigravity\scratch\mathnotes\mathnotes-mobile-core.zip"
$zipBytes = [System.IO.File]::ReadAllBytes($zipPath)
$headers["Content-Disposition"] = 'attachment; filename="mathnotes-mobile-core.zip"'
$headers["Content-Type"] = "application/zip"

try {
    $res = Invoke-RestMethod -Uri "$global:WP_SITE_URL/wp-json/wp/v2/media" -Headers $headers -Method Post -Body $zipBytes -TimeoutSec 15
    Write-Host "Uploaded successfully to WordPress Media:"
    Write-Host "Direct Download URL: $($res.source_url)"
} catch {
    Write-Host "Media upload note: $($_.Exception.Message)"
}
