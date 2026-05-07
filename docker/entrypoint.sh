#!/bin/sh
set -e

echo "Running database schema push..."
cd /app/apps/api && echo "n" | npx drizzle-kit push --force

echo "Starting API server..."
exec npx tsx src/app.ts
