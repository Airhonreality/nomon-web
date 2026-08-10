import { existsSync, readFileSync } from "node:fs";
import { neon } from "@neondatabase/serverless";

function loadEnv(file: string) {
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
loadEnv("app/.env.local");

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
	console.error(
		"DATABASE_URL no está configurado. Asegúrate de que app/.env exista.",
	);
	process.exit(1);
}

const sql = neon(databaseUrl);

async function countRealMessages(): Promise<number> {
	const rows = await sql`
		SELECT count(*)::int AS count
		FROM "Mensaje"
		WHERE message_id NOT LIKE 'demo-%'
	`;

	return Number(rows[0]?.count ?? 0);
}

async function cleanDemoMessages() {
	const demoRows = await sql`
		SELECT count(*)::int AS count
		FROM "Mensaje"
		WHERE message_id LIKE 'demo-%'
	`;
	const demoCount = Number(demoRows[0]?.count ?? 0);
	const realBefore = await countRealMessages();

	console.log(`Mensajes demo encontrados: ${demoCount}`);

	if (process.env.CONFIRM_DELETE !== "1") {
		console.log("DELETE omitido: define CONFIRM_DELETE=1 para confirmar.");
		console.log(`Mensajes reales conservados: ${realBefore}`);
		return;
	}

	const deleted = await sql`
		DELETE FROM "Mensaje"
		WHERE message_id LIKE 'demo-%'
		RETURNING id, message_id, asunto
	`;

	console.log(`Mensajes demo eliminados: ${deleted.length}`);

	const realAfter = await countRealMessages();
	console.log(`Mensajes reales conservados: ${realAfter}`);

	if (realAfter !== realBefore) {
		throw new Error(
			`La verificación de mensajes reales falló: antes=${realBefore}, después=${realAfter}`,
		);
	}
}

cleanDemoMessages().catch((error) => {
	console.error("Error limpiando mensajes demo:", error);
	process.exit(1);
});
