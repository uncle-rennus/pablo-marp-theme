# Exit on error
$ErrorActionPreference = "Stop"

# Clear previous build
if (Test-Path build/html) {
    Remove-Item -Recurse -Force build/html
}

# Create build directory
New-Item -ItemType Directory -Force -Path build/html

# Build HTML documentation
sphinx-build -b html source/ build/html

Write-Host "Documentation built successfully in build/html/"
