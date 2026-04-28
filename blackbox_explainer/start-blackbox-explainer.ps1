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
$canStartBackend = $true
if (-not $ollamaCommand) {
    $canStartBackend = $false
}

if ($canStartBackend) {
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
        $canStartBackend = $false
    }

    if ($canStartBackend) {
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
    }
}

Start-Process cmd.exe -ArgumentList "/c", "cd /d `"$frontendDir`" && npm.cmd run dev" | Out-Null

for ($attempt = 0; $attempt -lt 20; $attempt++) {
    Start-Sleep -Milliseconds 500
    try {
        Invoke-WebRequest -Uri $frontendUrl -UseBasicParsing -TimeoutSec 2 | Out-Null
        break
    }
    catch {
    }
}

try {
    Start-Process $frontendUrl | Out-Null
}
catch {
}
