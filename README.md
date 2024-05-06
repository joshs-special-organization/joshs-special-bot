## Setup

- Create your own `.env` file in the root, setting the following variables:

  - `DISCORD_CLIENT_ID`
  - `DISCORD_TOKEN`
  - The below keys can be found in the ORM section of the "Connect to your project" modal
  - `DATABASE_URL` (recommended to append `?pgbouncer=true` to the end for a better prisma CLI experience)
  - `DIRECT_URL`

- Install pnpm globally via npm
```npm install -g pnpm```

- Install tsx globally
```pnpm install -g tsx```

- Install project dependancies
```pnpm install```


## Running the program
```tsx src/bot.ts```\
**or**\
```tsx watch src/bot.ts``` (restarts upon file changes)
