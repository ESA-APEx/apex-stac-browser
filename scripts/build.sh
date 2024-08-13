#!/bin/sh
source ./scripts/utils.sh

### PARAMETER EVAL
# Default value for version
version=$(get_latest_version)

if [ -z "$1" ]; then
    echo "Error: The 'theme' parameter is required."
    exit 1
fi

# Assign theme parameter
theme="$1"

# Check if version parameter is provided
if [ ! -z "$2" ]; then
    version="$2"
fi

### MAIN
log "Building the STAC browser with $theme theme and base version $version"

temp_dir=$(mktemp -d)
log "Created temporary direction $temp_dir"

log "Cloning repository"
git clone --branch "$version" --depth 1 https://github.com/radiantearth/stac-browser.git "$temp_dir"

log "Copy $theme theme to repository"
cp -r themes/$theme/* $temp_dir

log "Creating new image for the STAC browser"
cd $temp_dir
docker build -t "apex-$theme-stac-browser" .

log "Cleaning up temporary direction"
rm -rf $temp_dir