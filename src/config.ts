import dotenv from "dotenv";
import type { AppEnv } from "./types";

const APP_ENV: AppEnv = "prod";
dotenv.config({ path: `./${APP_ENV}.env` });

const { DISCORD_TOKEN, DISCORD_CLIENT_ID } = process.env;

if (!DISCORD_TOKEN || !DISCORD_CLIENT_ID) {
	throw new Error("Missing environment variables");
}

export const config = {
	DISCORD_TOKEN,
	DISCORD_CLIENT_ID
};
