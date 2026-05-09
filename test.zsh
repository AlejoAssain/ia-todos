#!/bin/zsh

set -euo pipefail

bold=$'\033[1m'
green=$'\033[32m'
reset=$'\033[0m'

success() {
  echo "${green}[ok]${reset} $1"
}

echo "${bold}Running project checks${reset}"

zsh -n ./dev-start.zsh
success "dev launcher syntax is valid"

zsh -n ./prod-start.zsh
success "production launcher syntax is valid"

docker compose config >/dev/null
success "production Docker Compose config is valid"

docker compose -f docker-compose.dev.yml config >/dev/null
success "development Docker Compose config is valid"

echo
success "all project checks passed"
