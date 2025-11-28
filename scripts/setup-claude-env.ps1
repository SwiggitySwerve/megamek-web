$ErrorActionPreference = "Stop"

$defaultBaseUrl = "https://api.z.ai/api/anthropic"
$configDir = Join-Path $env:USERPROFILE ".claude"
$configPath = Join-Path $configDir "settings.json"

if (-not (Test-Path $configDir)) {
    New-Item -ItemType Directory -Path $configDir | Out-Null
}

Write-Host "Claude Code + Z.AI setup (Windows PowerShell)"
$apiKey = Read-Host -Prompt "Enter your Z.AI API key"
if ([string]::IsNullOrWhiteSpace($apiKey)) {
    throw "API key cannot be empty."
}

$baseUrlInput = Read-Host -Prompt "Anthropic-compatible base URL [$defaultBaseUrl]"
$baseUrl = if ([string]::IsNullOrWhiteSpace($baseUrlInput)) { $defaultBaseUrl } else { $baseUrlInput }

function Get-ExistingPayload {
    param([string] $Path)
    if (-not (Test-Path $Path)) {
        return @{}
    }
    try {
        $raw = Get-Content -Path $Path -Raw
        if ([string]::IsNullOrWhiteSpace($raw)) {
            return @{}
        }
        $json = $raw | ConvertFrom-Json
        if ($json -isnot [PSCustomObject]) {
            return @{}
        }
        return $json
    } catch {
        throw "Unable to parse $Path: $($_.Exception.Message)"
    }
}

$payload = Get-ExistingPayload -Path $configPath

if (-not ($payload.PSObject.Properties.Name -contains "env") -or ($payload.env -isnot [hashtable] -and $payload.env -isnot [PSCustomObject])) {
    $payload | Add-Member -MemberType NoteProperty -Name env -Value @{}
}

if ($payload.env -is [PSCustomObject]) {
    $envHash = @{}
    foreach ($property in $payload.env.PSObject.Properties) {
        $envHash[$property.Name] = $property.Value
    }
    $payload.env = $envHash
} elseif ($payload.env -isnot [hashtable]) {
    $payload.env = @{}
}

$payload.env["ANTHROPIC_AUTH_TOKEN"] = $apiKey
$payload.env["ANTHROPIC_BASE_URL"] = $baseUrl

$payload | ConvertTo-Json -Depth 8 | Set-Content -Path $configPath -Encoding utf8
Write-Host "Updated $configPath"

$envPrompt = Read-Host -Prompt "Also set Windows user-level env vars (ANTHROPIC_AUTH_TOKEN/ANTHROPIC_BASE_URL)? (y/N)"
if ($envPrompt -match '^(y|yes)$') {
    [System.Environment]::SetEnvironmentVariable("ANTHROPIC_AUTH_TOKEN", $apiKey, [System.EnvironmentVariableTarget]::User)
    [System.Environment]::SetEnvironmentVariable("ANTHROPIC_BASE_URL", $baseUrl, [System.EnvironmentVariableTarget]::User)
    Write-Host "User-level environment variables set."
}

Write-Host "Open a new terminal session before running claude."

