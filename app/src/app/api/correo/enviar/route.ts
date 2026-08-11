// API Route para enviar un correo desde NOMON Mail
// POST /api/correo/enviar (solo correos @rednomon.com) → Resend → guarda en DB como ENVIADO

import { requireMailAccess } from "@/lib/auth-mail";
import { BUZON, getResend, insertarMensaje } from "@/lib/mail";
import { R2_BUCKET, r2 } from "@/lib/r2";
import { GetObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
	const denied = await requireMailAccess(req);
	if (denied) return denied;

	let body: {
		para?: string;
		asunto?: string;
		cuerpo?: string;
		adjuntos?: string[];
	};
	try {
		body = await req.json();
	} catch {
		return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
	}

	const para = body.para?.trim();
	const asunto = body.asunto?.trim();
	const cuerpo = body.cuerpo?.trim();
	const adjuntosKeys = body.adjuntos;

	if (!para || !asunto || !cuerpo) {
		return NextResponse.json(
			{ error: "Para, asunto y cuerpo son requeridos" },
			{ status: 400 },
		);
	}

	if (!para.includes("@")) {
		return NextResponse.json({ error: "Email inválido" }, { status: 400 });
	}

	const resendAttachments: Array<{ filename: string; content: Buffer }> = [];

	if (Array.isArray(adjuntosKeys) && adjuntosKeys.length > 0) {
		if (adjuntosKeys.length > 5) {
			return NextResponse.json(
				{ error: "Máximo 5 adjuntos por mensaje" },
				{ status: 400 },
			);
		}

		for (const key of adjuntosKeys) {
			if (typeof key !== "string" || !key.startsWith("mail/")) {
				return NextResponse.json(
					{ error: "Key de adjunto inválida" },
					{ status: 400 },
				);
			}
			try {
				await r2.send(new HeadObjectCommand({ Bucket: R2_BUCKET, Key: key }));
				const getObj = await r2.send(
					new GetObjectCommand({ Bucket: R2_BUCKET, Key: key }),
				);
				const bytes = await getObj.Body?.transformToByteArray();
				const filename = key.split("/").pop() ?? "adjunto";
				if (bytes) {
					resendAttachments.push({
						filename,
						content: Buffer.from(bytes),
					});
				}
			} catch (err) {
				console.error(`Error procesando adjunto ${key}:`, err);
				return NextResponse.json(
					{ error: `Adjunto ${key} no existe o no se pudo leer` },
					{ status: 400 },
				);
			}
		}
	}

	try {
		const resend = getResend();
		const { data, error } = await resend.emails.send({
			from: `Contacto Nomon <${BUZON}>`,
			to: [para],
			subject: asunto,
			text: cuerpo,
			attachments: resendAttachments.length > 0 ? resendAttachments : undefined,
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
			adjuntos: adjuntosKeys,
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
