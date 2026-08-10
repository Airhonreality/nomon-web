// Elimina el mensaje de smoke test (message_id = 'smoke-test-001') dejado por la auditoría.
// Uso: npx tsx scripts/clean-smoke-test.ts

import { neon } from "@neondatabase/serverless";
import { existsSync, readFileSync } from "node:fs";

function loadEnv(file: string) {
	if (!existsSync(file)) return;
	for (const line of readFileSync(file, "utf8").split("\n")) {
		const trimmed = line.trim();
		if (!trimmed || trimmed.startsWith("#")) continue;
		const eq = trimmed.indexOf("=");
		if (eq === -1) continue;
		const key = trimmed.slice(0, eq).trim();
		const value = trimmed.slice(eq + 1).trim().replace(/^"|"$/g, "");
		if (!process.env[key]) process.env[key] = value;
	}
}

loadEnv("app/.env");
const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
	console.error("DATABASE_URL no configurado");
	process.exit(1);
}
const sql = neon(DATABASE_URL);

async function main() {
	const r = await sql`DELETE FROM "Mensaje" WHERE message_id = 'smoke-test-001' RETURNING id`;
	console.log(`Mensajes eliminados: ${r.length}`);
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
