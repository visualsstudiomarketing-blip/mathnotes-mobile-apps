. "C:\Users\vikra\.gemini\antigravity\scratch\mathnotes\wp_client.ps1"
$headers = Get-WPHeaders

try {
    $b4 = Invoke-RestMethod -Uri "$global:WP_SITE_URL/wp-json/aipkit/v1/chatbots/4/embed-config" -Headers $headers -Method Get -TimeoutSec 10
    Write-Host "Bot 4 Header: $($b4.config.headerName)"
    Write-Host "Bot 4 Provider: $($b4.config.provider)"
    Write-Host "Bot 4 Starters: $($b4.config.starters -join ' | ')"
    Write-Host "Bot 4 Nonce: $($b4.config.nonce)"
    Write-Host "Bot 4 AjaxUrl: $($b4.config.ajaxUrl)"
} catch {
    Write-Host "Error: $($_.Exception.Message)"
}
