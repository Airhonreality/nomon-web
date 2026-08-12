import { randomUUID } from "node:crypto";
import { requireMailAccess } from "@/lib/auth-mail";
import { R2_BUCKET, r2 } from "@/lib/r2";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
	const denied = await requireMailAccess(req);
	if (denied) return denied;

	let body: { nombre?: string; tipo?: string; tamano?: number };
	try {
		body = await req.json();
	} catch {
		return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
	}

	const { nombre, tipo, tamano } = body;

	if (!nombre || !tipo || typeof tamano !== "number") {
		return NextResponse.json(
			{ error: "Nombre, tipo y tamaño requeridos" },
			{ status: 400 },
		);
	}

	if (tamano > 5 * 1024 * 1024) {
		return NextResponse.json({ error: "Archivo excede 5 MB" }, { status: 413 });
	}

	// Conserva el nombre original (sanitizado) en la key para no perderlo:
	// mail/<año>/<uuid>__<nombre-original>
	const nombreSeguro = nombre
		.normalize("NFKD")
		.replace(/\p{Diacritic}/gu, "")
		.replace(/[^a-zA-Z0-9._-]+/g, "-")
		.slice(0, 80);
	const key = `mail/${new Date().getFullYear()}/${randomUUID()}__${nombreSeguro}`;

	const cmd = new PutObjectCommand({
		Bucket: R2_BUCKET,
		Key: key,
		ContentType: tipo,
		ContentLength: tamano,
	});

	const uploadUrl = await getSignedUrl(r2, cmd, { expiresIn: 300 }); // 5 min
	const publicUrl = `https://${process.env.R2_PUBLIC_DOMAIN}/${key}`;

	return NextResponse.json({ key, uploadUrl, publicUrl });
}
