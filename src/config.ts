import dotenv from "dotenv";

dotenv.config();

const { DISCORD_TOKEN, DISCORD_CLIENT_ID, SUPABASE_URL, SUPABASE_PUBLIC_KEY } = process.env;

if (!DISCORD_TOKEN || !DISCORD_CLIENT_ID || !SUPABASE_URL || !SUPABASE_PUBLIC_KEY) {
	throw new Error("Missing environment variables");
}

export const config = {
	DISCORD_TOKEN,
	DISCORD_CLIENT_ID,
	SUPABASE_URL,
	SUPABASE_PUBLIC_KEY
};