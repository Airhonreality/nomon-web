// API Route de la bandeja de NOMON Mail
// GET: listar mensajes (solo correos @rednomon.com) — ordenados por fecha descendente
// DELETE: borrar mensajes por id

import { requireMailAccess } from "@/lib/auth-mail";
import { db } from "@/lib/db";
import { mensajes } from "@/lib/db/schema";
import { desc, inArray } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
	const denied = await requireMailAccess(req);
	if (denied) return denied;

	const lista = await db
		.select()
		.from(mensajes)
		.orderBy(desc(mensajes.createdAt));

	return NextResponse.json(lista);
}

export async function DELETE(req: NextRequest) {
	const denied = await requireMailAccess(req);
	if (denied) return denied;

	let body: { ids?: unknown };
	try {
		body = await req.json();
	} catch {
		return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
	}

	const ids = Array.isArray(body.ids) ? body.ids : null;
	if (!ids || ids.length === 0) {
		return NextResponse.json(
			{ error: "Se requiere al menos un id de mensaje" },
			{ status: 400 },
		);
	}

	if (ids.some((id) => typeof id !== "string" || id.trim() === "")) {
		return NextResponse.json({ error: "Ids inválidos" }, { status: 400 });
	}

	await db.delete(mensajes).where(inArray(mensajes.id, ids as string[]));

	return NextResponse.json({ success: true, eliminados: ids.length });
}
