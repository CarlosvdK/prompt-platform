#!/usr/bin/env bash
set -euo pipefail

# =============================================================================
# Prompt Platform - Development Setup
# =============================================================================
# This script sets up a fresh development environment. Run it once after
# cloning the repository.
# =============================================================================

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

info() { echo -e "${GREEN}[INFO]${NC} $1"; }
warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
error() { echo -e "${RED}[ERROR]${NC} $1"; exit 1; }

# ---------------------------------------------------------------------------
# Check prerequisites
# ---------------------------------------------------------------------------
info "Checking prerequisites..."

if ! command -v pnpm &> /dev/null; then
  error "pnpm is not installed. Install it with: npm install -g pnpm"
fi
info "pnpm $(pnpm --version) found."

if ! command -v docker &> /dev/null; then
  error "Docker is not installed. Install Docker Desktop from https://docker.com"
fi
info "Docker found."

if ! docker info &> /dev/null 2>&1; then
  error "Docker daemon is not running. Start Docker Desktop and try again."
fi
info "Docker daemon is running."

# ---------------------------------------------------------------------------
# Environment file
# ---------------------------------------------------------------------------
if [ ! -f .env.local ]; then
  info "Copying .env.example to .env.local..."
  cp .env.example .env.local
  warn "Review .env.local and update values as needed."
else
  info ".env.local already exists, skipping copy."
fi

# ---------------------------------------------------------------------------
# Start services
# ---------------------------------------------------------------------------
info "Starting PostgreSQL via Docker Compose..."
docker compose up -d

info "Waiting for PostgreSQL to be ready..."
until docker compose exec -T postgres pg_isready -U prompt_user -d prompt_platform > /dev/null 2>&1; do
  sleep 1
done
info "PostgreSQL is ready."

# ---------------------------------------------------------------------------
# Install dependencies
# ---------------------------------------------------------------------------
info "Installing dependencies..."
pnpm install

# ---------------------------------------------------------------------------
# Database setup
# ---------------------------------------------------------------------------
info "Running database migrations..."
pnpm db:migrate

info "Seeding database..."
pnpm db:seed

# ---------------------------------------------------------------------------
# Done
# ---------------------------------------------------------------------------
echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  Setup complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo "  Start the dev server with:"
echo ""
echo "    pnpm dev"
echo ""
echo "  Then open http://localhost:3000"
echo ""
