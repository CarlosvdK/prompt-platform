#!/usr/bin/env bash
set -euo pipefail

# =============================================================================
# Softset - Database Reset
# =============================================================================
# Drops and recreates the database, runs migrations, and seeds data.
# WARNING: This destroys all data in the local database.
# =============================================================================

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

info() { echo -e "${GREEN}[INFO]${NC} $1"; }
warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }

warn "This will destroy all data in the local database."
read -p "Are you sure? (y/N) " -n 1 -r
echo

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo "Aborted."
  exit 0
fi

# ---------------------------------------------------------------------------
# Drop and recreate database
# ---------------------------------------------------------------------------
info "Dropping and recreating the database..."
docker compose exec -T postgres psql -U prompt_user -d postgres -c "DROP DATABASE IF EXISTS prompt_platform;" > /dev/null 2>&1
docker compose exec -T postgres psql -U prompt_user -d postgres -c "CREATE DATABASE prompt_platform;" > /dev/null 2>&1
info "Database recreated."

# ---------------------------------------------------------------------------
# Run migrations
# ---------------------------------------------------------------------------
info "Running migrations..."
pnpm db:migrate

# ---------------------------------------------------------------------------
# Seed data
# ---------------------------------------------------------------------------
info "Seeding database..."
pnpm db:seed

echo ""
echo -e "${GREEN}Database reset complete.${NC}"
echo ""
