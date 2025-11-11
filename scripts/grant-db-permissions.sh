#!/bin/bash

# Script to grant PostgreSQL permissions for Prisma migrations
# Run this script as PostgreSQL superuser or with sudo

set -e

DB_NAME="currency_db"
DB_USER="ilya.polozoff"

echo "Granting permissions to user $DB_USER for database $DB_NAME..."
echo ""

# Check if running as postgres user or with sudo
if [ "$EUID" -ne 0 ] && [ "$USER" != "postgres" ]; then
    echo "⚠️  Warning: This script should be run as postgres user or with sudo"
    echo "   Attempting to run with current user..."
    echo ""
fi

# Execute SQL commands
psql -U postgres -d "$DB_NAME" <<EOF
-- Grant usage on schema public
GRANT USAGE ON SCHEMA public TO "$DB_USER";

-- Grant create privileges on schema public
GRANT CREATE ON SCHEMA public TO "$DB_USER";

-- Grant all privileges on all tables in schema public
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO "$DB_USER";

-- Grant all privileges on all sequences in schema public
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO "$DB_USER";

-- Grant all privileges on database
GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO "$DB_USER";

-- Set default privileges for future objects
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO "$DB_USER";
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO "$DB_USER";

-- Verify permissions
\du "$DB_USER"
EOF

echo ""
echo "✅ Permissions granted successfully!"
echo "   You can now run: npm run db:migrate"

