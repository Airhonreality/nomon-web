// Webhook de recepción de correo entrante
// Cloudflare Email Routing → Worker → POST a esta ruta con Bearer WEBHOOK_SECRET

import { db } from "@/lib/db";
import { mensajes } from "@/lib/db/schema";
import { insertarMensaje } from "@/lib/mail";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
	// Validar el token secreto del Worker (fuera de sesión de usuario)
	const secret = process.env.WEBHOOK_SECRET;
	if (!secret) {
		return NextResponse.json(
			{ error: "WEBHOOK_SECRET no configurado" },
			{ status: 500 },
		);
	}

	const authHeader = req.headers.get("authorization");
	if (authHeader !== `Bearer ${secret}`) {
		return NextResponse.json({ error: "No autorizado" }, { status: 401 });
	}

	let data: {
		messageId?: string;
		from?: string;
		to?: string;
		subject?: string;
		bodyText?: string;
		bodyHtml?: string;
	};

	try {
		data = await req.json();
	} catch {
		return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
	}

	if (!data.from || !data.to) {
		return NextResponse.json(
			{ error: "from y to son requeridos" },
			{ status: 400 },
		);
	}

	// Dedup por messageId: si ya existe un mensaje con ese id, no insertar de nuevo
	if (data.messageId) {
		const existing = await db.query.mensajes.findFirst({
			where: eq(mensajes.messageId, data.messageId),
		});

		if (existing) {
			return NextResponse.json({ success: true, deduplicado: true });
		}
	}

	await insertarMensaje({
		messageId: data.messageId,
		direccion: "RECIBIDO",
		de: data.from,
		para: data.to,
		asunto: data.subject || "(Sin asunto)",
		cuerpo: data.bodyText || "",
		cuerpoHtml: data.bodyHtml,
	});

	return NextResponse.json({ success: true });
}
