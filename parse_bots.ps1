. "C:\Users\vikra\.gemini\antigravity\scratch\mathnotes\wp_client.ps1"
$headers = Get-WPHeaders

$botIds = @(3, 4, 5, 6, 9, 10)
foreach ($id in $botIds) {
    try {
        $raw = Invoke-RestMethod -Uri "$global:WP_SITE_URL/wp-json/aipkit/v1/chatbots/$id/embed-config" -Headers $headers -Method Get -TimeoutSec 10
        if ($raw -match '"headerName":"([^"]*)"') {
            $name = $matches[1]
        } else {
            $name = "Unknown"
        }
        if ($raw -match '"starters":\[([^\]]*)\]') {
            $starters = $matches[1]
        } else {
            $starters = ""
        }
        if ($raw -match '"popupLabelText":"([^"]*)"') {
            $label = $matches[1]
        } else {
            $label = ""
        }
        Write-Host "BOT ID: $id | HeaderName: '$name' | Label: '$label' | Starters: $starters"
    } catch {
        Write-Host "BOT ID: $id error: $($_.Exception.Message)"
    }
}
