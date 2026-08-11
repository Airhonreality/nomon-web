import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

// Configuración del cliente Neon (usar DATABASE_URL de entorno)
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
	throw new Error(
		"DATABASE_URL no está configurado en las variables de entorno",
	);
}

const sql = neon(connectionString);

export const db = drizzle(sql, { schema });

export * from "./schema";
