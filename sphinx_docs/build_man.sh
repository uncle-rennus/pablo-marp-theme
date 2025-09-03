#!/bin/bash

# Exit on error
set -e

# Clear previous build
rm -rf build/man

# Create build directory
mkdir -p build/man

# Build man pages
sphinx-build -b man source/ build/man

# Report success
echo "Man pages built successfully in build/man/"

# Install man pages to local system (optional)
# sudo mkdir -p /usr/local/share/man/man1/
# sudo cp build/man/*.1 /usr/local/share/man/man1/
# sudo mandb
