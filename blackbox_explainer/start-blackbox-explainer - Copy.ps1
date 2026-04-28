$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$backendVenvPython = Join-Path $projectRoot "backend\.venv\Scripts\python.exe"
$frontendDir = Join-Path $projectRoot "frontend"
$backendDir = Join-Path $projectRoot "backend"
$frontendUrl = "http://127.0.0.1:5173"
$ollamaUrl = "http://127.0.0.1:11434"
$ollamaTagsUrl = "$ollamaUrl/api/tags"

function Test-ServiceReady {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Url
    )

    try {
        Invoke-WebRequest -Uri $Url -UseBasicParsing -TimeoutSec 2 | Out-Null
        return $true
    }
    catch {
        return $false
    }
}

if (-not (Test-Path $backendVenvPython)) {
    throw "Backend virtual environment not found at $backendVenvPython"
}

$ollamaCommand = Get-Command ollama -ErrorAction SilentlyContinue
if (-not $ollamaCommand) {
    throw "Ollama is not installed or not available on PATH."
}

$ollamaReady = Test-ServiceReady -Url $ollamaTagsUrl
if (-not $ollamaReady) {
    $existingOllama = Get-CimInstance Win32_Process -Filter "Name = 'ollama.exe'" |
        Where-Object {
            $_.CommandLine -and
            $_.CommandLine -like "*serve*"
        } |
        Select-Object -First 1

    if (-not $existingOllama) {
        Start-Process powershell -ArgumentList "-NoExit", "-Command", "ollama serve" | Out-Null
    }

    for ($attempt = 0; $attempt -lt 30; $attempt++) {
        Start-Sleep -Milliseconds 500
        if (Test-ServiceReady -Url $ollamaTagsUrl) {
            $ollamaReady = $true
            break
        }
    }
}

if (-not $ollamaReady) {
    throw "Ollama did not become ready at $ollamaUrl. Start it manually with 'ollama serve' and try again."
}

$existingBackendProcess = Get-CimInstance Win32_Process -Filter "Name = 'python.exe' OR Name = 'pythonw.exe'" |
    Where-Object {
        $_.CommandLine -and
        $_.CommandLine -like "*uvicorn*" -and
        $_.CommandLine -like "*main:app*" -and
        $_.CommandLine -like "*--port 8000*"
    } |
    Select-Object -First 1

if (-not $existingBackendProcess) {
    $backendLaunchCommand = @(
        "Set-Location '$backendDir'"
        "`$env:BBE_BASE_URL = '$ollamaUrl'"
        "& '$backendVenvPython' -m uvicorn main:app --reload --host 127.0.0.1 --port 8000"
    ) -join "; "

    Start-Process powershell -ArgumentList "-NoExit", "-Command", $backendLaunchCommand | Out-Null
}

$existingFrontendProcess = Get-CimInstance Win32_Process -Filter "Name = 'node.exe'" |
    Where-Object {
        $_.CommandLine -and
        $_.CommandLine -like "*dev-server.mjs*" -and
        $_.CommandLine -like "*blackbox_explainer*"
    } |
    Select-Object -First 1

if (-not $existingFrontendProcess) {
    $frontendLaunchCommand = @(
        "Set-Location '$frontendDir'"
        "npm run dev"
    ) -join "; "

    Start-Process powershell -ArgumentList "-NoExit", "-Command", $frontendLaunchCommand | Out-Null
}

for ($attempt = 0; $attempt -lt 20; $attempt++) {
    Start-Sleep -Milliseconds 500
    try {
        Invoke-WebRequest -Uri $frontendUrl -UseBasicParsing -TimeoutSec 2 | Out-Null
        break
    }
    catch {
    }
}

Start-Process $frontendUrl
