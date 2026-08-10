// API Route para enviar un correo corporativo
// POST /api/correo/enviar (solo ADMIN) → Resend → guarda en DB como ENVIADO

import { requireAdmin } from "@/lib/auth-admin";
import { BUZON, getResend, insertarMensaje } from "@/lib/mail";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
	const denied = await requireAdmin(req);
	if (denied) return denied;

	let body: { para?: string; asunto?: string; cuerpo?: string };
	try {
		body = await req.json();
	} catch {
		return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
	}

	const para = body.para?.trim();
	const asunto = body.asunto?.trim();
	const cuerpo = body.cuerpo?.trim();

	if (!para || !asunto || !cuerpo) {
		return NextResponse.json(
			{ error: "Para, asunto y cuerpo son requeridos" },
			{ status: 400 },
		);
	}

	// Validar email simple
	if (!para.includes("@")) {
		return NextResponse.json({ error: "Email inválido" }, { status: 400 });
	}

	try {
		const resend = getResend();
		const { data, error } = await resend.emails.send({
			from: BUZON,
			to: [para],
			subject: asunto,
			text: cuerpo,
		});

		if (error) {
			console.error("Error de Resend:", error);
			return NextResponse.json(
				{ error: "El proveedor de correo rechazó el envío" },
				{ status: 502 },
			);
		}

		await insertarMensaje({
			messageId: data?.id,
			direccion: "ENVIADO",
			de: BUZON,
			para,
			asunto,
			cuerpo,
		});

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error("Error al enviar correo:", error);
		return NextResponse.json(
			{ error: "Error interno del servidor" },
			{ status: 500 },
		);
	}
}
