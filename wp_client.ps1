# WordPress Client for mathnotes.courses

$global:WP_SITE_URL = "https://mathnotes.courses"
$global:WP_USERNAME = "webxprodigital@gmail.com"
$global:WP_APP_PASSWORD = "ZXux Xhzh T78p 2Vkz wQID mK9p"

function Get-WPHeaders {
    $pair = "$($global:WP_USERNAME):$($global:WP_APP_PASSWORD)"
    $encoded = [System.Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes($pair))
    return @{
        "Authorization" = "Basic $encoded"
        "User-Agent" = "Antigravity/1.0"
        "Accept" = "application/json"
    }
}

function Get-WPCurrentUser {
    $headers = Get-WPHeaders
    return Invoke-RestMethod -Uri "$global:WP_SITE_URL/wp-json/wp/v2/users/me?context=edit" -Headers $headers -Method Get
}

function Get-WPPosts {
    param([int]$PerPage = 10, [string]$Status = "publish")
    $headers = Get-WPHeaders
    return Invoke-RestMethod -Uri "$global:WP_SITE_URL/wp-json/wp/v2/posts?per_page=$PerPage&status=$Status" -Headers $headers -Method Get
}

function New-WPPost {
    param([string]$Title, [string]$Content, [string]$Status = "draft")
    $headers = Get-WPHeaders
    $body = @{
        title = $Title
        content = $Content
        status = $Status
    } | ConvertTo-Json
    return Invoke-RestMethod -Uri "$global:WP_SITE_URL/wp-json/wp/v2/posts" -Headers $headers -Method Post -Body $body -ContentType "application/json"
}

function Get-WPTutorCourses {
    $headers = Get-WPHeaders
    try {
        return Invoke-RestMethod -Uri "$global:WP_SITE_URL/wp-json/wp/v2/courses" -Headers $headers -Method Get
    } catch {
        return Invoke-RestMethod -Uri "$global:WP_SITE_URL/wp-json/tutor/v1/courses" -Headers $headers -Method Get
    }
}
