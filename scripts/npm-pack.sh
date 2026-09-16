#!/usr/bin/env bash
# Create npm package tarball for @wiretalk/react-native-chat (dry-run publish)
set -euo pipefail
cd "$(dirname "$0")/../react-native"
npm pack
echo "Created $(ls -1 wiretalk-react-native-chat-*.tgz | tail -1)"
