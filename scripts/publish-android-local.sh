#!/usr/bin/env bash
# Publish Wiretalk Android SDK to Maven Local
set -euo pipefail
cd "$(dirname "$0")/../android"
./gradlew :wiretalk-android:publishReleasePublicationToMavenLocal
echo "Published tech.wiretalk:wiretalk-android to ~/.m2/repository"
