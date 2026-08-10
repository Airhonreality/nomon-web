import { getCurrentUser } from "@/lib/auth";
import { type NextRequest, NextResponse } from "next/server";

// Dominio corporativo: solo correos @rednomon.com entran al buzón NOMON Mail.
export const DOMINIO_CORPORATIVO = "rednomon.com";

export function esCorreoCorporativo(email: string): boolean {
	return email.toLowerCase().endsWith(`@${DOMINIO_CORPORATIVO}`);
}

// Exige sesión `nomon_mail` + usuario con correo corporativo.
export async function requireMailAccess(
	req: NextRequest,
): Promise<NextResponse | null> {
	const token = req.cookies.get("nomon_mail")?.value;
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

	if (!esCorreoCorporativo(user.email)) {
		return NextResponse.json(
			{ error: "Acceso restringido al correo corporativo" },
			{ status: 403 },
		);
	}

	return null;
}