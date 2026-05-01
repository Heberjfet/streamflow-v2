#!/bin/sh
set -e

echo "Running database schema push..."
cd /app/apps/api && npx drizzle-kit push --force

echo "Starting API server..."
exec npx tsx src/app.ts
