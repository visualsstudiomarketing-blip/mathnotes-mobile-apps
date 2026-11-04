. "C:\Users\vikra\.gemini\antigravity\scratch\mathnotes\wp_client.ps1"
$headers = Get-WPHeaders

Write-Host "=== SEARCH FOR CHATBOT / BOTS ==="
$terms = @("MathNotes AI", "Teachers AI", "chatbot", "bot", "rag", "puffer")
foreach ($t in $terms) {
    try {
        $res = Invoke-RestMethod -Uri "$global:WP_SITE_URL/wp-json/wp/v2/search?search=$([System.Uri]::EscapeDataString($t))&per_page=10" -Headers $headers -Method Get -TimeoutSec 10
        Write-Host "--- Search '$t' (count: $($res.Count)) ---"
        $res | Select-Object id, title, subtype, type, url | Format-Table -AutoSize
    } catch {
        Write-Host "Search '$t' error: $($_.Exception.Message)"
    }
}
