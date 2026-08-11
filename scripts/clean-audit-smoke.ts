import { existsSync, readFileSync } from "node:fs";
import { neon } from "@neondatabase/serverless";

function loadEnv(file) {
	if (!existsSync(file)) return;
	for (const line of readFileSync(file, "utf8").split("\n")) {
		const trimmed = line.trim();
		if (!trimmed || trimmed.startsWith("#")) continue;
		const eq = trimmed.indexOf("=");
		if (eq === -1) continue;
		const key = trimmed.slice(0, eq).trim();
		const value = trimmed
			.slice(eq + 1)
			.trim()
			.replace(/^"|"$/g, "");
		if (!process.env[key]) process.env[key] = value;
	}
}

loadEnv("app/.env");
const sql = neon(process.env.DATABASE_URL);

// Borrar todos los smoke tests recientes
const r1 =
	await sql`DELETE FROM "Mensaje" WHERE message_id LIKE 'smoke-%' RETURNING message_id`;
const r2 =
	await sql`DELETE FROM "Mensaje" WHERE de = 'audit@rednomon.com' RETURNING message_id`;
const r3 =
	await sql`DELETE FROM "Sesion" WHERE user_id NOT IN (SELECT id FROM "Usuario") RETURNING id`;

console.log(`Smoke tests borrados: ${r1.length + r2.length}`);
console.log(`Sesiones huerfanas borradas: ${r3.length}`);

const total = await sql`SELECT COUNT(*)::int AS n FROM "Mensaje"`;
console.log(`Mensajes restantes: ${total[0].n}`);
