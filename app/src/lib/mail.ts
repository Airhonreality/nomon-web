import { db } from "@/lib/db";
import { mensajes } from "@/lib/db/schema";
import { Resend } from "resend";
// Helper del subsistema de correo corporativo (buzón único)
import { v4 as uuidv4 } from "uuid";

const BUZON = "contacto@rednomon.com";

export function getResend(): Resend {
	const apiKey = process.env.RESEND_API_KEY;
	if (!apiKey) {
		throw new Error(
			"RESEND_API_KEY no está configurado en las variables de entorno",
		);
	}
	return new Resend(apiKey);
}

export interface NuevoMensaje {
	messageId?: string;
	direccion: "ENVIADO" | "RECIBIDO";
	de: string;
	para: string;
	asunto: string;
	cuerpo: string;
	cuerpoHtml?: string;
	aliadoRef?: string;
	adjuntos?: string[];
}

export async function insertarMensaje(data: NuevoMensaje) {
	return db
		.insert(mensajes)
		.values({
			id: uuidv4(),
			messageId: data.messageId?.trim() || uuidv4(),
			direccion: data.direccion,
			de: data.de,
			para: data.para,
			asunto: data.asunto,
			cuerpo: data.cuerpo,
			cuerpoHtml: data.cuerpoHtml,
			aliadoRef: data.aliadoRef,
			adjuntos: data.adjuntos,
			enviado: data.direccion === "ENVIADO",
		})
		.returning();
}

export { BUZON };
