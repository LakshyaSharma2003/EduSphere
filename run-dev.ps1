param(
    [switch]$SkipInstall,
    [switch]$CheckOnly
)

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$frontendPath = Join-Path $root "src\EduSphere.Frontend"
$backendPath = Join-Path $root "src\EduSphere.Backend"
$jobs = @()

function Write-Step {
    param([string]$Message)
    Write-Host ""
    Write-Host "==> $Message" -ForegroundColor Cyan
}

function Test-Command {
    param([string]$Name)
    return $null -ne (Get-Command $Name -ErrorAction SilentlyContinue)
}

function Stop-DevJobs {
    if ($jobs.Count -gt 0) {
        Write-Step "Stopping EduSphere dev servers"
        $jobs | Stop-Job -ErrorAction SilentlyContinue
        $jobs | Remove-Job -Force -ErrorAction SilentlyContinue
    }
}

try {
    Write-Step "EduSphere full-stack launcher"
    Write-Host "Workspace: $root"

    if (-not (Test-Command "npm.cmd")) {
        throw "npm.cmd was not found. Install Node.js 22+ before running the frontend."
    }

    if ($CheckOnly) {
        Write-Step "Launcher check"
        Write-Host "npm.cmd: available" -ForegroundColor Green
        if (Test-Command "dotnet") {
            Write-Host "dotnet: available" -ForegroundColor Green
        }
        else {
            Write-Host "dotnet: missing. Backend will not start until the .NET SDK is installed." -ForegroundColor Yellow
        }
        return
    }

    if (-not $SkipInstall -and -not (Test-Path (Join-Path $frontendPath "node_modules"))) {
        Write-Step "Installing frontend dependencies"
        Push-Location $frontendPath
        npm.cmd install
        Pop-Location
    }

    if (Test-Command "dotnet") {
        Write-Step "Starting backend API on http://localhost:5221"
        $jobs += Start-Job -Name "EduSphere.Backend" -ScriptBlock {
            param($backendPath)
            Set-Location $backendPath
            dotnet run --urls "http://localhost:5221"
        } -ArgumentList $backendPath
    }
    else {
        Write-Host ""
        Write-Host "Backend not started: dotnet SDK was not found on this machine." -ForegroundColor Yellow
        Write-Host "Install the .NET SDK, then run this launcher again to start the API too." -ForegroundColor Yellow
    }

    Write-Step "Starting Angular frontend on http://localhost:4200"
    $jobs += Start-Job -Name "EduSphere.Frontend" -ScriptBlock {
        param($frontendPath)
        Set-Location $frontendPath
        npm.cmd start -- --host 127.0.0.1 --port 4200
    } -ArgumentList $frontendPath

    Write-Host ""
    Write-Host "EduSphere is starting." -ForegroundColor Green
    Write-Host "Frontend: http://localhost:4200"
    Write-Host "Backend:  http://localhost:5221/api/health"
    Write-Host ""
    Write-Host "Press Ctrl+C in this terminal to stop the dev servers."

    while ($true) {
        foreach ($job in $jobs) {
            Receive-Job $job
        }

        $failed = $jobs | Where-Object { $_.State -in @("Failed", "Stopped", "Completed") }
        if ($failed.Count -gt 0) {
            Write-Host ""
            Write-Host "One or more dev server jobs stopped:" -ForegroundColor Yellow
            $failed | Format-Table Name, State -AutoSize
            break
        }

        Start-Sleep -Seconds 2
    }
}
finally {
    Stop-DevJobs
}
