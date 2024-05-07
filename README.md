## UR UR UR UR UR UR URURURURURUR UR UR UR UR UR UR UR UR UR UR UR UR UR UR UR UR URURURURURURURURURUR

## Setup

- Create your own `.env` file in the root, setting the following variables:

  - `NODE_ENV`, should be one of `development` or `production`
  - `DISCORD_CLIENT_ID`, same as the application ID
  - `DISCORD_TOKEN`
  - The below keys can be found in the ORM section of the "Connect to your project" modal
  - `DATABASE_URL`, recommended to append `?pgbouncer=true` to the end for a better prisma CLI experience
  - `DIRECT_URL`, for running migrations

- Install pnpm globally via npm
```npm install -g pnpm```

- Install tsx globally
```pnpm install -g tsx```

- Install project dependancies
```pnpm install```

### Database migrations

The DB should already be set up, but incase you are using a different one to our shared supabase testbench, run:

```npx prisma db push```

If you edit the schema, apply your edit as a migration with this command (it will also push the update to the backend):

```npx prisma migrate <ENV> --name <useful_migration_comment>```

## Running the program

```tsx src/bot.ts```\
**or**\
```tsx watch src/bot.ts``` (restarts upon file changes)


