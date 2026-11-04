. "C:\Users\vikra\.gemini\antigravity\scratch\mathnotes\wp_client.ps1"
$headers = Get-WPHeaders

Write-Host "=== ACTIVE PLUGINS ==="
try {
    $plugins = Invoke-RestMethod -Uri "$global:WP_SITE_URL/wp-json/wp/v2/plugins" -Headers $headers -Method Get -TimeoutSec 10
    $plugins | Select-Object plugin, name, status, version | Format-Table -AutoSize
} catch {
    Write-Host "Plugins error: $($_.Exception.Message)"
}

Write-Host "=== HOME PAGE CONTENT ==="
try {
    $homePage = Invoke-RestMethod -Uri "$global:WP_SITE_URL/wp-json/wp/v2/pages/20" -Headers $headers -Method Get -TimeoutSec 10
    $plain = $homePage.content.rendered -replace '<[^>]+>', ' ' -replace '\s+', ' '
    Write-Host $plain
} catch {
    Write-Host "Home error: $($_.Exception.Message)"
}

Write-Host "=== POST 738 CONTENT ==="
try {
    $post738 = Invoke-RestMethod -Uri "$global:WP_SITE_URL/wp-json/wp/v2/posts/738" -Headers $headers -Method Get -TimeoutSec 10
    $plainPost = $post738.content.rendered -replace '<[^>]+>', ' ' -replace '\s+', ' '
    Write-Host $plainPost
} catch {
    Write-Host "Post error: $($_.Exception.Message)"
}
