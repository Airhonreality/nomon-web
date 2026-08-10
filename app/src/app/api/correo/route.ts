// API Route de la bandeja de correo
// GET: listar mensajes (solo ADMIN) — ordenados por fecha descendente

import { requireAdmin } from "@/lib/auth-admin";
import { db } from "@/lib/db";
import { mensajes } from "@/lib/db/schema";
import { desc } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
	const denied = await requireAdmin(req);
	if (denied) return denied;

	const lista = await db
		.select()
		.from(mensajes)
		.orderBy(desc(mensajes.createdAt));

	return NextResponse.json(lista);
}
