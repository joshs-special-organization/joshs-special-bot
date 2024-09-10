# Josh's Special Bot

![Typescript Supported](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![PNPM](https://img.shields.io/badge/pnpm-%234a4a4a.svg?style=for-the-badge&logo=pnpm&logoColor=f69220)
![Run Test Suite](https://img.shields.io/github/actions/workflow/status/joshs-special-organization/joshs-special-bot/tests.yml?style=for-the-badge&logo=github&label=Tests)
![Linting](https://img.shields.io/github/actions/workflow/status/joshs-special-organization/joshs-special-bot/lint.yml?style=for-the-badge&logo=github&label=Linting)
![DiscordJS Version](https://img.shields.io/github/package-json/dependency-version/joshs-special-organization/joshs-special-bot/discord.js?style=for-the-badge&logo=discord&color=7289da)
![Jest Version](https://img.shields.io/github/package-json/dependency-version/joshs-special-organization/joshs-special-bot/dev/jest/main?style=for-the-badge&logo=jest&color=994a56)

## Setup

### Environment Secrets

- Create your own `.env` file in the root, setting the following variables:

  - `NODE_ENV`, should be one of `development` or `production`
  - `DISCORD_CLIENT_ID`, same as the application ID
  - `DISCORD_TOKEN`
  - The below keys can be found in the ORM section of the "Connect to your project" modal
  - `DATABASE_URL`, recommended to append `?pgbouncer=true` to the end for a better prisma CLI experience
  - `DIRECT_URL`, for running migrations

### Database migrations

The DB should already be set up, but incase you are using a different one to our shared supabase testbench, run:

```npx prisma db push```

If you edit the schema, apply your edit as a migration with this command (it will also push the update to the backend):

```npx prisma migrate <ENV> --name <useful_migration_comment>```

## Running the program

### Run Development Build Locally

1. Install pnpm globally via npm:\
```npm install -g pnpm```

2. Install tsx globally:\
```pnpm install -g tsx```

3. Install project dependancies:\
```pnpm install```

4. Start the bot on your local machine using:\
```pnpm run start```\
**or**\
```pnpm run start:watch``` (restarts upon file changes)

### Docker Deployment

The robot can be run within a [docker](https://www.docker.com/) container using `docker-compose`. This includes either building the `CI` pipeline container for running tests or the `deploy` container for running the robot that is the same of what is used on the server.\

1. Ensure you have [docker installed](https://www.docker.com/get-started/) and running first.

2. To run a robot, build and run it:
   1. ```docker compose build <ci/deploy>```
   2. ```docker compose run <ci/deploy>```

You will know you did everything right when your robot will be connected to discord and running! :tada:
