import dotenv from "dotenv";

dotenv.config();

const { TOKEN, CLIENT_ID, SUPABASE_PUBLIC_KEY, SUPABASE_URL } = process.env;

if (!TOKEN || !CLIENT_ID || !SUPABASE_PUBLIC_KEY || !SUPABASE_URL) {
	throw new Error("Missing environment variables");
}

export const config = {
	TOKEN,
	CLIENT_ID,
	SUPABASE_PUBLIC_KEY,
	SUPABASE_URL
};
