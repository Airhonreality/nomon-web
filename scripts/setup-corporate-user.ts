// Setup del usuario corporativo: elimina admin@rednomon.com y crea contacto@rednomon.com
// con la contraseña Nomon2026! (hash SHA-256, mismo formato que auth.hashPassword).
// Uso: npx tsx scripts/setup-corporate-user.ts

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

function hashPassword(password: string): string {
	return createHash("sha256").update(password).digest("hex");
}

const NEW_USER = {
	email: "contacto@rednomon.com",
	password: "Nomon2026!",
	nombreCompleto: "Buzón Corporativo NOMON",
	telefono: "+57 000 000 0000",
	areaInteres: "Gestión corporativa",
	rol: "ADMIN" as const,
};

const OLD_USER_EMAIL = "admin@rednomon.com";

async function setup() {
	console.log("→ Configurando usuario corporativo…\n");

	// 1. Eliminar admin@rednomon.com
	console.log(`[1/3] Eliminando usuario anterior: ${OLD_USER_EMAIL}`);
	const deleted = await sql`
		DELETE FROM "Usuario" WHERE email = ${OLD_USER_EMAIL}
		RETURNING id, email
	`;
	if (deleted.length > 0) {
		console.log(`  ✔ Eliminado: ${deleted[0].email} (id: ${deleted[0].id})`);
	} else {
		console.log("  • No existía en la BD, nada que eliminar.");
	}

	// 2. Limpiar sesiones del usuario eliminado (por si quedó alguna huérfana)
	const cleanedSessions = await sql`
		DELETE FROM "Sesion"
		WHERE user_id IN (SELECT id FROM "Usuario" WHERE email = ${OLD_USER_EMAIL})
		RETURNING id
	`;
	if (cleanedSessions.length > 0) {
		console.log(
			`  ✔ ${cleanedSessions.length} sesión(es) huérfana(s) eliminada(s).`,
		);
	}

	// 3. Crear contacto@rednomon.com
	console.log(`\n[2/3] Creando usuario corporativo: ${NEW_USER.email}`);
	const passwordHash = hashPassword(NEW_USER.password);

	const inserted = await sql`
		INSERT INTO "Usuario" (
			id, nombre_completo, telefono, area_interes, email, password_hash, rol, created_at, updated_at
		)
		VALUES (
			${randomUUID()}, ${NEW_USER.nombreCompleto}, ${NEW_USER.telefono},
			${NEW_USER.areaInteres}, ${NEW_USER.email}, ${passwordHash}, ${NEW_USER.rol},
			NOW(), NOW()
		)
		ON CONFLICT (email) DO UPDATE SET
			password_hash = EXCLUDED.password_hash,
			rol = EXCLUDED.rol,
			nombre_completo = EXCLUDED.nombre_completo,
			updated_at = NOW()
		RETURNING id, email, rol
	`;

	if (inserted.length > 0) {
		console.log(
			`  ✔ Creado/actualizado: ${inserted[0].email} (rol: ${inserted[0].rol})`,
		);
		console.log("  ✔ Hash SHA-256 de la contraseña generado correctamente.");
	}

	// 4. Verificar
	console.log("\n[3/3] Verificando acceso…");
	const verify = await sql`
		SELECT email, password_hash, rol FROM "Usuario" WHERE email = ${NEW_USER.email}
	`;
	if (verify.length > 0) {
		const stored = verify[0].password_hash as string;
		const computed = hashPassword(NEW_USER.password);
		const match = stored === computed;
		console.log(
			`  ${match ? "✔" : "✗"} Verificación de contraseña: ${match ? "OK" : "FALLO"}`,
		);
		console.log(`  ${match ? "✔" : "✗"} Email en BD: ${verify[0].email}`);
		console.log(`  ${match ? "✔" : "✗"} Rol: ${verify[0].rol}`);
	}

	console.log("\n────────────────────────────────────────");
	console.log(" Usuario listo para login en /mail/login");
	console.log(`   email:    ${NEW_USER.email}`);
	console.log(`   password: ${NEW_USER.password}`);
	console.log("────────────────────────────────────────\n");
}

setup().catch((err) => {
	console.error("Error ejecutando setup:", err);
	process.exit(1);
});
