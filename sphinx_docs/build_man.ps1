# Exit on error
$ErrorActionPreference = "Stop"

# Clear previous build
if (Test-Path build/man) {
    Remove-Item -Recurse -Force build/man
}

# Create build directory
New-Item -ItemType Directory -Force -Path build/man

# Build man pages
sphinx-build -b man source/ build/man

Write-Host "Man pages built successfully in build/man/"
