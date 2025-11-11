-- Grant permissions to user for Prisma migrations
-- Run this script as PostgreSQL superuser (postgres)

-- Grant usage on schema public
GRANT USAGE ON SCHEMA public TO "ilya.polozoff";

-- Grant create privileges on schema public
GRANT CREATE ON SCHEMA public TO "ilya.polozoff";

-- Grant all privileges on all tables in schema public
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO "ilya.polozoff";

-- Grant all privileges on all sequences in schema public
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO "ilya.polozoff";

-- Grant all privileges on database
GRANT ALL PRIVILEGES ON DATABASE currency_db TO "ilya.polozoff";

-- Set default privileges for future objects
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO "ilya.polozoff";
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO "ilya.polozoff";

-- Make user owner of schema (optional, more permissive)
-- ALTER SCHEMA public OWNER TO "ilya.polozoff";

