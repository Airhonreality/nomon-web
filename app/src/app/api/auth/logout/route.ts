// API Route para Logout
// Invalidar sesión (Gate E-02)

import { invalidateSession } from "@/lib/auth";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
	try {
		const token = req.cookies.get("nomon_session")?.value;

		if (!token) {
			return NextResponse.json(
				{ error: "No hay sesión activa" },
				{ status: 400 },
			);
		}

		// Invalidar sesión
		await invalidateSession(token);

		// Eliminar cookie
		const response = NextResponse.json({ success: true });
		response.cookies.delete("nomon_session");

		return response;
	} catch (error) {
		console.error("Error en logout:", error);
		return NextResponse.json(
			{ error: "Error interno del servidor" },
			{ status: 500 },
		);
	}
}
