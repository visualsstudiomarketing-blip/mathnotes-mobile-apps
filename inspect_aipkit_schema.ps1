. "C:\Users\vikra\.gemini\antigravity\scratch\mathnotes\wp_client.ps1"
$headers = Get-WPHeaders

try {
    $root = Invoke-RestMethod -Uri "$global:WP_SITE_URL/wp-json/aipkit/v1" -Headers $headers -Method Get -TimeoutSec 10
    foreach ($route in $root.routes.PSObject.Properties) {
        Write-Host "Route: $($route.Name)"
        $eps = $route.Value.endpoints
        foreach ($ep in $eps) {
            Write-Host "  Method: $($ep.methods -join ', ')"
            if ($ep.args) {
                Write-Host "  Args: $(($ep.args.PSObject.Properties | Select-Object -ExpandProperty Name) -join ', ')"
            }
        }
    }
} catch {
    Write-Host "Error: $($_.Exception.Message)"
}
