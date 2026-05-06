#!/bin/zsh

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"

choose_ai_provider() {
  local choice

  echo "Choose AI provider:"
  echo "  1) Local Ollama"
  echo "  2) OpenAI API"
  printf "Option [1]: "
  read -r choice

  case "${choice:-1}" in
    1)
      export IA_PROVIDER="ollama"
      export OLLAMA_MODEL="${OLLAMA_MODEL:-llama3.2:1b}"
      echo "Using local Ollama with model: $OLLAMA_MODEL"
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
        echo "OPENAI_API_KEY is required for OpenAI API mode."
        exit 1
      fi

      echo "Using OpenAI API with model: $OPENAI_MODEL"
      ;;
    *)
      echo "Invalid option: $choice"
      exit 1
      ;;
  esac
}

cleanup() {
  echo
  echo "Stopping development servers..."

  jobs -pr | xargs -r kill 2>/dev/null || true
  wait 2>/dev/null || true
}

trap cleanup INT TERM EXIT

choose_ai_provider

echo "Starting backend on http://localhost:3000 ..."
(cd "$ROOT_DIR/backend" && npm run start:dev) &

echo "Starting frontend on http://localhost:5173 ..."
(cd "$ROOT_DIR/frontend" && npm run dev) &

wait
