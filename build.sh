#!/usr/bin/env bash
# Assemble the deployable site.
#
# The repository root is not the document root: it also holds the Worker
# config, this script, the workflow directory and the README, none of which
# should be served. So the site is copied into dist/ explicitly -- adding a
# page means adding it here.

set -euo pipefail

PAGES=(index.html about.html contact.html projects.html)
ASSETS=(style.css theme.js)

rm -rf dist
mkdir -p dist

for f in "${PAGES[@]}" "${ASSETS[@]}"; do
  [ -f "$f" ] || { echo "missing $f" >&2; exit 1; }
  install -m 0644 "$f" "dist/$f"
done

cp -R fonts dist/fonts

install -m 0644 _headers dist/_headers

# Identifies the deployed commit so the fallback workflow can tell whether
# Cloudflare already published this tree.
#
# Read it from the checkout rather than the environment. Workers Builds sets
# WORKERS_CI_COMMIT_SHA to the *branch name* for a manually started build, and
# the fallback compares this value against github.sha -- so trusting the
# variable would leave a deployed site permanently looking stale and make the
# fallback redeploy on every push, which is precisely what it exists to avoid.
sha=$(git rev-parse HEAD 2>/dev/null || echo "${WORKERS_CI_COMMIT_SHA:-${GITHUB_SHA:-local}}")
printf '%s\n' "$sha" > dist/.build-id

echo "staged $(find dist -type f | wc -l | tr -d ' ') files into dist/"
