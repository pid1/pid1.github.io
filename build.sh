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

# Transitional. /rx moved to its own Worker at rx.pid1.space, reached from the
# apex through a redirect rule. Until that rule is in place this copy is what
# answers `curl -fsSL pid1.space/rx`; remove the file and this block together.
if [ -f rx ]; then
  install -m 0644 rx dist/rx
fi

install -m 0644 _headers dist/_headers

# Identifies the deployed commit so the fallback workflow can tell whether
# Cloudflare already published this tree.
printf '%s\n' "${WORKERS_CI_COMMIT_SHA:-${GITHUB_SHA:-local}}" > dist/.build-id

echo "staged $(find dist -type f | wc -l | tr -d ' ') files into dist/"
