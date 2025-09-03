#!/bin/bash

# Exit on error
set -e

# Clear previous build
rm -rf build/html

# Create build directory
mkdir -p build/html

# Build HTML documentation
sphinx-build -b html source/ build/html

# Report success
echo "Documentation built successfully in build/html/"
