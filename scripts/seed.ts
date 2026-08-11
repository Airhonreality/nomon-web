// Seed de desarrollo — carga los datos iniciales para poder ver la app.
// Uso: npx tsx scripts/seed.ts
// Requiere DATABASE_URL. Los .env viven en app/.env (nunca versionado).
// Guard: no es idempotente el hash de demo; re-ejecutar no duplica (upsert por email).

import { createHash, randomUUID } from "node:crypto";
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

// Cargar las variables de entorno que viven en app/.env
loadEnv("app/.env");
loadEnv("app/.env.local");

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
	console.error(
		"DATABASE_URL no está configurado. Asegúrate de que app/.env exista.",
	);
	process.exit(1);
}

const sql = neon(DATABASE_URL);

// Mismo formato que auth.hashPassword (SHA-256 hex). Solo para dev/demo.
function hashPassword(password: string): string {
	return createHash("sha256").update(password).digest("hex");
}

async function seed() {
	console.log("→ Aplicando seed de desarrollo…");

	// 1. Usuario ADMIN de demostración
	const ADMIN = {
		email: "admin@rednomon.com",
		password: "AdminNomon2026!",
		nombreCompleto: "Administración NOMON",
		telefono: "+57 000 000 0000",
		areaInteres: "Gestión corporativa",
		rol: "ADMIN",
	};
	await sql`
		INSERT INTO "Usuario" (id, nombre_completo, telefono, area_interes, email, password_hash, rol)
		VALUES (${randomUUID()}, ${ADMIN.nombreCompleto}, ${ADMIN.telefono}, ${ADMIN.areaInteres}, ${ADMIN.email}, ${hashPassword(ADMIN.password)}, ${ADMIN.rol})
		ON CONFLICT (email) DO NOTHING
	`;
	console.log(`  ✔ Admin demo listo: ${ADMIN.email} / ${ADMIN.password}`);

	// 2. Mensajes de ejemplo en la bandeja única
	const BUZON = "contacto@rednomon.com";
	const mensajes = [
		{
			messageId: `demo-${randomUUID()}`,
			direccion: "RECIBIDO",
			de: "aliada.corp@ejemplo.com",
			para: BUZON,
			asunto: "Alianza por la integridad empresarial",
			cuerpo:
				"Estimado equipo NOMON: nos interesa explorar un convenio de formación en ética aplicada para nuestras líneas de dirección. ¿Cuándo podríamos agendar una sesión de acercamiento?",
		},
		{
			messageId: `demo-${randomUUID()}`,
			direccion: "RECIBIDO",
			de: "profesor.unal@universidad.edu.co",
			para: BUZON,
			asunto: "Panel de sector académico — Simposio",
			cuerpo:
				"En nombre de la Dirección de Investigación, confirmamos la participación en el Simposio Internacional de Ética y quedamos atentos a la agenda de mesas técnicas.",
		},
		{
			messageId: `demo-${randomUUID()}`,
			direccion: "ENVIADO",
			de: BUZON,
			para: "aliada.corp@ejemplo.com",
			asunto: "Re: Alianza por la integridad empresarial",
			cuerpo:
				"Gracias por su interés. Con gusto agendamos el acercamiento; les compartiremos propuesta de alcance y metodología en los próximos días.",
		},
	];

	for (const m of mensajes) {
		await sql`
			INSERT INTO "Mensaje" (id, message_id, direccion, de, para, asunto, cuerpo, enviado)
			VALUES (${randomUUID()}, ${m.messageId}, ${m.direccion}, ${m.de}, ${m.para}, ${m.asunto}, ${m.cuerpo}, ${m.direccion === "ENVIADO"})
		`;
	}
	console.log(`  ✔ ${mensajes.length} mensajes demo en ${BUZON}`);

	console.log("Seed completo. Puedes entrar a /login con el admin demo.");
}

seed().catch((err) => {
	console.error("Error ejecutando seed:", err);
	process.exit(1);
});
