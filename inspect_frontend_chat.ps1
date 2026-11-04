try {
    $html = (Invoke-WebRequest -Uri "https://mathnotes.courses/" -TimeoutSec 10).Content
    if ($html -match 'aipkit[a-zA-Z0-9_\-\.]*') {
        Write-Host "Found aipkit in HTML:"
        $matches = [regex]::Matches($html, '(?i)(?:aipkit|chatbot)[^"''\s><]{0,100}')
        $matches | Select-Object -First 15 -ExpandProperty Value
    }
    # Check for script configs
    $scripts = [regex]::Matches($html, '<script[^>]*>(.*?)</script>', [System.Text.RegularExpressions.RegexOptions]::Singleline)
    foreach ($s in $scripts) {
        if ($s.Value -match 'aipkit|bot|chat') {
            Write-Host "Script snippet:"
            $snippet = $s.Value
            if ($snippet.Length -gt 500) { $snippet = $snippet.Substring(0, 500) }
            Write-Host $snippet
        }
    }
} catch {
    Write-Host "Error: $($_.Exception.Message)"
}
