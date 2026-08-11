// API Route de la bandeja de NOMON Mail
// GET: listar mensajes (solo correos @rednomon.com) — ordenados por fecha descendente

import { requireMailAccess } from "@/lib/auth-mail";
import { db } from "@/lib/db";
import { mensajes } from "@/lib/db/schema";
import { desc } from "drizzle-orm";
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
