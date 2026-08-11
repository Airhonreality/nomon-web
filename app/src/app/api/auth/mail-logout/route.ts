// API Route para el cierre de sesión de NOMON Mail.
// Invalida la sesión `nomon_mail` y limpia la cookie.

import { invalidateSession } from "@/lib/auth";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
	try {
		const token = req.cookies.get("nomon_mail")?.value;

		if (token) {
			await invalidateSession(token);
		}

		const response = NextResponse.json({ success: true });
		response.cookies.delete("nomon_mail");

		return response;
	} catch (error) {
		console.error("Error en mail-logout:", error);
		return NextResponse.json(
			{ error: "Error interno del servidor" },
			{ status: 500 },
		);
	}
}
