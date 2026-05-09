#!/bin/zsh

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
APP_STARTED="false"
APP_NAME="ia-todos-prod"

bold=$'\033[1m'
dim=$'\033[2m'
green=$'\033[32m'
red=$'\033[31m'
yellow=$'\033[33m'
reset=$'\033[0m'

section() {
  echo
  echo "${bold}$1${reset}"
}

info() {
  echo "${dim}$1${reset}"
}

success() {
  echo "${green}[ok]${reset} $1"
}

warn() {
  echo "${yellow}[!]${reset} $1"
}

fail() {
  echo "${red}[error]${reset} $1"
  exit 1
}

prompt_default() {
  local prompt="$1"
  local default="$2"

  printf "%s [%s]: " "$prompt" "$default"
}

render_header() {
  printf '\033[2J\033[H'
  echo "${green}${bold}"
  echo "=================================================="
  echo "  $APP_NAME"
  echo "=================================================="
  echo "${reset}${dim}Production Docker launcher${reset}"
}

host_ollama_probe_url() {
  local base_url="${OLLAMA_BASE_URL:-http://localhost:11434}"

  base_url="${base_url%/}"
  base_url="${base_url/host.docker.internal/localhost}"

  echo "$base_url"
}

choose_ai_provider() {
  local choice

  section "AI provider"
  echo "  1) Local Ollama"
  echo "  2) OpenAI API"
  prompt_default "Option" "1"
  read -r choice

  case "${choice:-1}" in
    1)
      export IA_PROVIDER="ollama"
      export OLLAMA_MODEL="${OLLAMA_MODEL:-llama3.2:1b}"
      export OLLAMA_BASE_URL="${OLLAMA_BASE_URL:-http://host.docker.internal:11434}"
      success "Using local Ollama with model: $OLLAMA_MODEL"
      ;;
    2)
      export IA_PROVIDER="openai"
      export OPENAI_MODEL="${OPENAI_MODEL:-gpt-5}"

      if [[ -z "${OPENAI_API_KEY:-}" ]]; then
        printf "OpenAI API key: "
        read -rs OPENAI_API_KEY
        echo
        export OPENAI_API_KEY
      fi

      if [[ -z "${OPENAI_API_KEY:-}" ]]; then
        fail "OPENAI_API_KEY is required for OpenAI API mode."
      fi

      success "Using OpenAI API with model: $OPENAI_MODEL"
      ;;
    *)
      fail "Invalid option: $choice"
      ;;
  esac
}

ensure_docker_is_running() {
  if ! docker compose version >/dev/null 2>&1; then
    fail "Docker Compose is not available. Install Docker Desktop or Docker Compose and try again."
  fi

  if ! docker info >/dev/null 2>&1; then
    fail "Docker is not running. Start Docker Desktop or the Docker daemon and try again."
  fi

  success "Docker is available."
}

ensure_ollama_is_running() {
  local probe_url

  probe_url="$(host_ollama_probe_url)"

  info "Checking local Ollama service at $probe_url ..."

  if ! curl -fsS --max-time 3 "$probe_url/api/tags" >/dev/null 2>&1; then
    fail "Ollama is not reachable. Start the local Ollama service first with 'ollama serve' or the Ollama desktop app, then make sure the model exists with 'ollama pull ${OLLAMA_MODEL:-llama3.2:1b}'."
  fi

  success "Ollama is running locally."
}

start_prod() {
  ensure_docker_is_running

  if [[ "${IA_PROVIDER:-}" == "ollama" ]]; then
    ensure_ollama_is_running
  fi

  section "Starting production app"
  echo "Frontend: http://localhost:${FRONTEND_PORT:-8080}"
  echo "Backend:  proxied through /api"

  APP_STARTED="true"
  docker compose -f "$ROOT_DIR/docker-compose.yml" up --build
}

cleanup() {
  if [[ "$APP_STARTED" != "true" ]]; then
    return
  fi

  echo
  warn "Stopping production app..."
  docker compose -f "$ROOT_DIR/docker-compose.yml" down 2>/dev/null || true
}

trap cleanup INT TERM EXIT

render_header
choose_ai_provider
start_prod
