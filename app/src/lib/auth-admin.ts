import { getCurrentUser, isAdmin } from "@/lib/auth";
// Helpers de autorización para API routes
import { type NextRequest, NextResponse } from "next/server";

export async function requireAdmin(
	req: NextRequest,
): Promise<NextResponse | null> {
	const token = req.cookies.get("nomon_session")?.value;
	if (!token) {
		return NextResponse.json(
			{ error: "No hay sesión activa" },
			{ status: 401 },
		);
	}

	const user = await getCurrentUser(token);
	if (!user) {
		return NextResponse.json(
			{ error: "Sesión inválida o expirada" },
			{ status: 401 },
		);
	}

	if (!isAdmin(user)) {
		return NextResponse.json(
			{ error: "Permisos insuficientes (requiere rol ADMIN)" },
			{ status: 403 },
		);
	}

	return null;
}
