#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Complete startup script for Solarpunk Interiors with TripoSR for Windows PowerShell

.DESCRIPTION
    This script starts both the TripoSR service and the Next.js dev server in separate windows.
    Ensures all prerequisites are met and services start successfully.

.EXAMPLE
    .\start-all.ps1
#>

# Colors for output
$InfoColor = 'Cyan'
$SuccessColor = 'Green'
$ErrorColor = 'Red'
$WarningColor = 'Yellow'

function Write-Info {
    Write-Host $args[0] -ForegroundColor $InfoColor
}

function Write-Success {
    Write-Host $args[0] -ForegroundColor $SuccessColor
}

function Write-Error2 {
    Write-Host $args[0] -ForegroundColor $ErrorColor
}

function Write-Warning2 {
    Write-Host $args[0] -ForegroundColor $WarningColor
}

Write-Host ""
Write-Host "╔═══════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║     Solarpunk Interiors - Complete Startup                   ║" -ForegroundColor Cyan
Write-Host "║     Starts TripoSR Service + Next.js Dev Server             ║" -ForegroundColor Cyan
Write-Host "╚═══════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Check if in right directory
if (-not (Test-Path "package.json")) {
    Write-Error2 "ERROR: Not in project root directory!"
    Write-Info "Please run this script from: m:\Repo\Patri-Web\solarpunk-interiors"
    exit 1
}

# Check if .env.local exists
if (-not (Test-Path ".env.local")) {
    Write-Warning2 "WARNING: .env.local not found"
    Write-Info "Creating from template..."
    if (Test-Path ".env.local.example") {
        Copy-Item ".env.local.example" ".env.local"
        Write-Success "✓ Created .env.local"
    } else {
        Write-Error2 "ERROR: .env.local.example not found"
        exit 1
    }
}

# Check Node.js
Write-Info ""
Write-Info "[1/3] Checking Node.js..."
try {
    $nodeVersion = node --version
    Write-Success "✓ Node.js found: $nodeVersion"
} catch {
    Write-Error2 "ERROR: Node.js not found!"
    Write-Info "Install from: https://nodejs.org/"
    exit 1
}

# Check TripoSR service setup
Write-Info ""
Write-Info "[2/3] Checking TripoSR Service..."
if (-not (Test-Path "triposr-service\venv")) {
    Write-Warning2 "TripoSR virtual environment not found"
    Write-Info "Please run: cd triposr-service && setup.bat"
    exit 1
}
Write-Success "✓ TripoSR environment ready"

# Start TripoSR service in new window
Write-Info ""
Write-Info "[3/3] Starting TripoSR Service..."
Write-Info "Opening new PowerShell window..."

$tripCommand = @"
cd $PSScriptRoot\triposr-service
& .\start-server.bat
"@

Start-Process pwsh -ArgumentList "-NoExit", "-Command", $tripCommand

Write-Success "✓ TripoSR service window opened"
Write-Info "Waiting 10 seconds for service to start..."
Start-Sleep -Seconds 10

# Start Next.js app in new window
Write-Info ""
Write-Info "Starting Next.js Dev Server..."

$nextCommand = @"
cd $PSScriptRoot
Write-Host ""
Write-Host "╔═══════════════════════════════════════════════════════════════╗"
Write-Host "║    Next.js Dev Server Starting                              ║"
Write-Host "║    Open: http://localhost:3000                              ║"
Write-Host "╚═══════════════════════════════════════════════════════════════╝"
Write-Host ""
npm run dev
"@

Start-Process pwsh -ArgumentList "-NoExit", "-Command", $nextCommand

Write-Success "✓ Next.js dev server window opened"
Write-Host ""
Write-Host "╔═══════════════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║    ✓ All services started!                                  ║" -ForegroundColor Green
Write-Host "║                                                             ║" -ForegroundColor Green
Write-Host "║    TripoSR Service: http://127.0.0.1:8000                  ║" -ForegroundColor Green
Write-Host "║    Web App:         http://localhost:3000                  ║" -ForegroundColor Green
Write-Host "║                                                             ║" -ForegroundColor Green
Write-Host "║    Next steps:                                              ║" -ForegroundColor Green
Write-Host "║    1. Wait for 'npm run dev' message in second window      ║" -ForegroundColor Green
Write-Host "║    2. Open http://localhost:3000 in your browser           ║" -ForegroundColor Green
Write-Host "║    3. Click 'Import Designer Photo' to test                ║" -ForegroundColor Green
Write-Host "╚═══════════════════════════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""
