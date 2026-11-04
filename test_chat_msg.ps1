. "C:\Users\vikra\.gemini\antigravity\scratch\mathnotes\wp_client.ps1"
$headers = Get-WPHeaders
$headers["Content-Type"] = "application/json"

$body = @{
    bot_id = 20
    conversation_uuid = [System.Guid]::NewGuid().ToString()
    messages = @(
        @{
            role = "user"
            content = "Hi, what is Mathnotes?"
        }
    )
} | ConvertTo-Json -Depth 5

try {
    Write-Host "Sending test message to bot 20..."
    $response = Invoke-RestMethod -Uri "$global:WP_SITE_URL/wp-json/aipkit/v1/chat/20/message" -Headers $headers -Method Post -Body $body -TimeoutSec 15
    Write-Host "Bot Response:"
    $response | ConvertTo-Json -Depth 5
} catch {
    Write-Host "Error: $($_.Exception.Message)"
    if ($_.Exception.Response) {
        $stream = $_.Exception.Response.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($stream)
        Write-Host "Body: $($reader.ReadToEnd())"
    }
}
