#!/usr/bin/env bash
set -euo pipefail

usage() {
  cat <<EOF
Usage: $0 <service> <version> [dockerfile-path] [--push|-p]

Examples:
  $0 backend 0.5.2-alpha apps/backend/Dockerfile.prod --push
  $0 frontend 0.5.2
  $0 backend 0.5.2-alpha --push

If dockerfile-path is omitted the script will look for:
  Dockerfile.<service>.prod
and fallback to apps/<service>/Dockerfile.<service>.prod
EOF
  exit 1
}

if [[ "${1:-}" == "" || "${2:-}" == "" ]]; then
  usage
fi

service="$1"
version="$2"
dockerfile_arg="${3:-}"
# detect --push passed in any later position
push=false
for a in "${@:3}"; do
  if [[ "$a" == "--push" || "$a" == "-p" ]]; then push=true; fi
done

# resolve dockerfile
if [[ -n "$dockerfile_arg" && "$dockerfile_arg" != "--push" && "$dockerfile_arg" != "-p" ]]; then
  dockerfile_path="$dockerfile_arg"
else
  dockerfile_name="Dockerfile.${service}.prod"
  if [[ -f "$dockerfile_name" ]]; then
    dockerfile_path="$dockerfile_name"
  elif [[ -f "apps/${service}/${dockerfile_name}" ]]; then
    dockerfile_path="apps/${service}/${dockerfile_name}"
  else
    echo "Dockerfile not found: tried '${dockerfile_name}' and 'apps/${service}/${dockerfile_name}'"
    exit 2
  fi
fi

if [[ ! -f "$dockerfile_path" ]]; then
  echo "Dockerfile not found at resolved path: $dockerfile_path"
  exit 2
fi

# map service to repository suffix
case "$service" in
  frontend) svc_abbr="fe" ;;
  backend)  svc_abbr="be" ;;
  *)        svc_abbr="$service" ;;
esac

image="paradoxinversion/mda-${svc_abbr}:${version}"

# build context - prefer git root if available
context="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"

# build command
cmd=(docker buildx build --platform linux/amd64 -f "$dockerfile_path" -t "$image" "$context")
if $push; then
  cmd+=("--push")
fi

echo "Running: ${cmd[*]}"
"${cmd[@]}"