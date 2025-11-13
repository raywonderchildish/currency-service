# Database Setup and Permissions

## Problem: Permission Denied for Schema Public

If you encounter the error:
```
Error: ERROR: permission denied for schema public
```

This means your PostgreSQL user doesn't have the necessary permissions to create tables and manage migrations.

## Solution

### Option 1: Run SQL Script (Recommended)

1. Connect to PostgreSQL as superuser:
```bash
sudo -u postgres psql -d currency_db
```

2. Execute the permissions script:
```sql
\i scripts/grant-db-permissions.sql
```

Or run it directly:
```bash
sudo -u postgres psql -d currency_db -f scripts/grant-db-permissions.sql
```

### Option 2: Run Shell Script

```bash
sudo ./scripts/grant-db-permissions.sh
```

### Option 3: Manual SQL Commands

Connect to PostgreSQL as superuser and run:

```sql
GRANT USAGE ON SCHEMA public TO "ilya.polozoff";
GRANT CREATE ON SCHEMA public TO "ilya.polozoff";
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO "ilya.polozoff";
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO "ilya.polozoff";
GRANT ALL PRIVILEGES ON DATABASE currency_db TO "ilya.polozoff";
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO "ilya.polozoff";
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO "ilya.polozoff";
```

## After Granting Permissions

Once permissions are granted, you can run migrations:

```bash
npm run db:migrate
```

Or create a migration without applying it:

```bash
npm run db:migrate:create -- --name migration_name
```

## Verify Permissions

To verify that permissions were granted correctly:

```bash
sudo -u postgres psql -d currency_db -c "\du ilya.polozoff"
```

## Troubleshooting

If you still encounter permission errors:

1. Make sure you're running the grant commands as the PostgreSQL superuser (postgres)
2. Verify the database and user names match your `.env` file
3. Check that the database exists: `\l` in psql
4. Verify the user exists: `\du` in psql

