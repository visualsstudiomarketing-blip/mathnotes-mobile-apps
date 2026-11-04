. "C:\Users\vikra\.gemini\antigravity\scratch\mathnotes\wp_client.ps1"
$headers = Get-WPHeaders

try {
    $courses = Invoke-RestMethod -Uri "$global:WP_SITE_URL/wp-json/tutor/v1/courses" -Headers $headers -Method Get -TimeoutSec 10
    Write-Host "Tutor courses count: $($courses.data.Count)"
    $courses.data | Select-Object id, post_title, post_name | Format-Table -AutoSize
} catch {
    Write-Host "Tutor courses error: $($_.Exception.Message)"
}
