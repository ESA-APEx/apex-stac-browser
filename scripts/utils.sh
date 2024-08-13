#!/bin/sh

log() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1"
}

get_latest_version() {
    latest_version=$(curl --silent "https://api.github.com/repos/radiantearth/stac-browser/tags" |
                         grep '"name":' |
                         sed -E 's/.*"([^"]+)".*/\1/' |
                         head -n 1)
    if [ -z "$latest_version" ]; then
        echo "Error: Unable to fetch the latest version from GitHub."
        exit 1
    fi
    echo "$latest_version"
}