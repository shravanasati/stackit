# Firebase to PostgreSQL Migration Guide

This guide will help you migrate your StackIt application from Firebase to PostgreSQL using Drizzle ORM.

## Prerequisites

1. PostgreSQL database server installed and running
2. Node.js environment with all dependencies installed
3. Access to your existing Firebase project (for data migration)

## Step 1: Database Setup

1. Create a PostgreSQL database:

```sql
CREATE DATABASE stackit;
CREATE USER stackit_user WITH ENCRYPTED PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE stackit TO stackit_user;
```

2. Copy `.env.example` to `.env` and update the database configuration:

```env
DATABASE_URL=postgresql://stackit_user:your_password@localhost:5432/stackit
DB_HOST=localhost
DB_PORT=5432
DB_USER=stackit_user
DB_PASSWORD=your_password
DB_NAME=stackit
DB_SSL=false
```

## Step 2: Generate and Run Migrations

1. Generate the initial migration:

```bash
pnpm run db:generate
```

2. Apply the migration to create tables:

```bash
pnpm run db:push
```

Alternatively, you can use:

```bash
pnpm run db:migrate
```

## Database Schema Overview

The PostgreSQL schema includes the following tables:

- **posts** - Blog posts with tags, votes, and moderation status
- **comments** - Threaded comments with GIF support
- **otp** - One-time passwords for authentication
- **tokens** - User session tokens
- **notifications** - User notifications
- **reports** - Content reports and moderation
- **security_logs** - Admin and moderation activity logs

## Development Tools

- **Drizzle Studio**: Visual database browser
  ```bash
  pnpm run db:studio
  ```

## Key Changes from Firebase

1. **Timestamps**: Now using native PostgreSQL `timestamp` instead of Firestore `Timestamp`
2. **IDs**: Using VARCHAR primary keys instead of Firestore document IDs
3. **JSON Fields**: Tags and GIF data stored as JSON columns
4. **Relationships**: Proper foreign key relationships between tables
5. **Transactions**: Database transactions for atomic operations
6. **Enums**: PostgreSQL enums for better type safety

## Performance Considerations

- Add indexes for frequently queried columns
- Consider adding pagination cursors for large datasets
- Use connection pooling in production
- Set up proper backup strategies

## Troubleshooting

1. **Connection Issues**: Verify PostgreSQL is running and credentials are correct
2. **Migration Errors**: Check that all environment variables are set
3. **Type Errors**: Ensure all imports are updated to use new schema types
4. **Performance**: Add appropriate indexes for your query patterns
