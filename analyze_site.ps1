. "C:\Users\vikra\.gemini\antigravity\scratch\mathnotes\wp_client.ps1"
$headers = Get-WPHeaders

Write-Host "=== PAGES ==="
try {
    $pages = Invoke-RestMethod -Uri "$global:WP_SITE_URL/wp-json/wp/v2/pages?per_page=50" -Headers $headers -Method Get -TimeoutSec 10
    $pages | Select-Object id, @{N='Title';E={$_.title.rendered}}, slug, link | Format-Table -AutoSize
} catch {
    Write-Host "Pages error: $($_.Exception.Message)"
}

Write-Host "=== POSTS ==="
try {
    $posts = Invoke-RestMethod -Uri "$global:WP_SITE_URL/wp-json/wp/v2/posts?per_page=15" -Headers $headers -Method Get -TimeoutSec 10
    $posts | Select-Object id, @{N='Title';E={$_.title.rendered}}, slug, date | Format-Table -AutoSize
} catch {
    Write-Host "Posts error: $($_.Exception.Message)"
}

Write-Host "=== TUTOR COURSES ==="
try {
    $courses = Invoke-RestMethod -Uri "$global:WP_SITE_URL/wp-json/wp/v2/courses?per_page=20" -Headers $headers -Method Get -TimeoutSec 10
    $courses | Select-Object id, @{N='Title';E={$_.title.rendered}}, slug, link | Format-Table -AutoSize
} catch {
    Write-Host "Courses error: $($_.Exception.Message)"
}

Write-Host "=== TUTOR LESSONS ==="
try {
    $lessons = Invoke-RestMethod -Uri "$global:WP_SITE_URL/wp-json/wp/v2/lesson?per_page=15" -Headers $headers -Method Get -TimeoutSec 10
    $lessons | Select-Object id, @{N='Title';E={$_.title.rendered}}, slug | Format-Table -AutoSize
} catch {
    Write-Host "Lessons error: $($_.Exception.Message)"
}
