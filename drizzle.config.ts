import { defineConfig } from "drizzle-kit";
import { config } from "dotenv";

config({ path: "./.env.local" });

export default defineConfig({
	dialect: "postgresql",
	schema: "./lib/database/schema.ts",
	out: "./migrations",
	dbCredentials: {
		host: process.env.DB_HOST!,
		port: parseInt(process.env.DB_PORT!),
		user: process.env.DB_USER!,
		password: process.env.DB_PASSWORD!,
		database: process.env.DB_NAME!,
		ssl: process.env.DB_SSL === "true",
	},
});
