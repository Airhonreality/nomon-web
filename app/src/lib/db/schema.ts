import {
	boolean,
	integer,
	pgEnum,
	pgTable,
	primaryKey,
	text,
	timestamp,
} from "drizzle-orm/pg-core";

// Enums

export const rolEnum = pgEnum("rol", ["ALIADO", "ADMIN"]);

export const estrategiaAccesoEnum = pgEnum("estrategia_acceso", [
	"PUBLICO",
	"SOLO_REGISTRADOS",
	"LISTA_BLANCA",
]);

export const direccionMensajeEnum = pgEnum("direccion_mensaje", [
	"ENVIADO",
	"RECIBIDO",
]);

// Tablas

export const usuarios = pgTable("Usuario", {
	id: text("id").primaryKey(),
	nombreCompleto: text("nombre_completo").notNull(),
	telefono: text("telefono").notNull(),
	areaInteres: text("area_interes").notNull(),
	email: text("email").notNull().unique(),
	passwordHash: text("password_hash").notNull(),
	rol: rolEnum("rol").default("ALIADO"),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const sesiones = pgTable("Sesion", {
	id: text("id").primaryKey(),
	userId: text("user_id")
		.notNull()
		.references(() => usuarios.id, { onDelete: "cascade" }),
	token: text("token").notNull().unique(),
	expiresAt: timestamp("expires_at").notNull(),
	createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const recursos = pgTable("Recurso", {
	id: text("id").primaryKey(),
	slug: text("slug").notNull().unique(),
	titulo: text("titulo").notNull(),
	contenido: text("contenido").notNull(),
	pdfUrl: text("pdf_url"),
	estrategiaAcceso: estrategiaAccesoEnum("estrategia_acceso")
		.default("PUBLICO")
		.notNull(),
	listaBlancaRef: text("lista_blanca_ref"),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const recursosMetadata = pgTable("RecursoMetadata", {
	id: text("id").primaryKey(),
	recursoId: text("recurso_id")
		.notNull()
		.references(() => recursos.id, { onDelete: "cascade" }),
	autor: text("autor"),
	editorial: text("editorial"),
	anio: text("anio"),
	idioma: text("idioma").default("es"),
});

export const recursosAcceso = pgTable(
	"RecursoAcceso",
	{
		recursoId: text("recurso_id")
			.notNull()
			.references(() => recursos.id, { onDelete: "cascade" }),
		email: text("email").notNull(),
		createdAt: timestamp("created_at").defaultNow().notNull(),
	},
	(table) => {
		return {
			pk: primaryKey({ columns: [table.recursoId, table.email] }),
		};
	},
);

export const recursosRelacionados = pgTable(
	"RecursoRelacionado",
	{
		recursoId: text("recurso_id")
			.notNull()
			.references(() => recursos.id, { onDelete: "cascade" }),
		relacionadoId: text("relacionado_id")
			.notNull()
			.references(() => recursos.id, { onDelete: "cascade" }),
		createdAt: timestamp("created_at").defaultNow().notNull(),
	},
	(table) => {
		return {
			pk: primaryKey({ columns: [table.recursoId, table.relacionadoId] }),
		};
	},
);

export const mensajes = pgTable("Mensaje", {
	id: text("id").primaryKey(),
	messageId: text("message_id").unique(),
	direccion: direccionMensajeEnum("direccion").notNull(),
	de: text("de").notNull(),
	para: text("para").notNull(),
	asunto: text("asunto").notNull(),
	cuerpo: text("cuerpo").notNull(),
	cuerpoHtml: text("cuerpo_html"),
	aliadoRef: text("aliado_ref"),
	adjuntos: text("adjuntos").array(),
	enviado: boolean("enviado").default(false),
	createdAt: timestamp("created_at").defaultNow().notNull(),
});
