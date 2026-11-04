. "C:\Users\vikra\.gemini\antigravity\scratch\mathnotes\wp_client.ps1"
$headers = Get-WPHeaders

Write-Host "=== CHECKING WP_KNOWLEDGE ==="
try {
    $know = Invoke-RestMethod -Uri "$global:WP_SITE_URL/wp-json/wp/v2/wp_knowledge" -Headers $headers -Method Get -TimeoutSec 10
    $know | Select-Object id, @{N='Title';E={$_.title.rendered}}, slug | Format-Table -AutoSize
} catch {
    Write-Host "wp_knowledge error: $($_.Exception.Message)"
}

Write-Host "=== TESTING BOT IDs 1 to 10 ==="
for ($i = 1; $i -le 10; $i++) {
    try {
        $raw = Invoke-RestMethod -Uri "$global:WP_SITE_URL/wp-json/aipkit/v1/chatbots/$i/embed-config" -Headers $headers -Method Get -TimeoutSec 5
        Write-Host "ID $i returned type: $($raw.GetType().Name)"
        if ($raw -is [string]) {
            $parsed = $raw | ConvertFrom-Json
            Write-Host "ID $i Parsed headerName: $($parsed.config.headerName) | starters: $($parsed.config.starters -join ', ')"
        } elseif ($raw.config) {
            Write-Host "ID $i config headerName: $($raw.config.headerName) | starters: $($raw.config.starters -join ', ')"
        }
    } catch {
        Write-Host "ID $i : $($_.Exception.Message)"
    }
}
