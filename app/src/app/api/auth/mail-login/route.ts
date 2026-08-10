// API Route para el login de NOMON Mail.
// Puerta separada de la membresía: solo correos @rednomon.com.
// Crea una sesión propia con cookie `nomon_mail`.

import { createSession, getUserByEmail, verifyPassword } from "@/lib/auth";
import { esCorreoCorporativo } from "@/lib/auth-mail";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
	try {
		const { email, password } = await req.json();

		if (!email || !password) {
			return NextResponse.json(
				{ error: "Email y contraseña son requeridos" },
				{ status: 400 },
			);
		}

		// Solo correo corporativo @rednomon.com entra al buzón.
		if (!esCorreoCorporativo(email)) {
			return NextResponse.json(
				{ error: "Acceso restringido al correo corporativo" },
				{ status: 403 },
			);
		}

		const user = await getUserByEmail(email);

		if (!user) {
			console.warn(`[mail-login] Usuario no existe: ${email}`);
			return NextResponse.json(
				{
					error: `El usuario "${email}" no existe en el sistema`,
					code: "USER_NOT_FOUND",
				},
				{ status: 404 },
			);
		}

		const isValidPassword = await verifyPassword(password, user.passwordHash);

		if (!isValidPassword) {
			console.warn(`[mail-login] Contraseña incorrecta para: ${email}`);
			return NextResponse.json(
				{
					error: `Contraseña incorrecta para el usuario "${email}"`,
					code: "WRONG_PASSWORD",
				},
				{ status: 401 },
			);
		}

		const token = await createSession(user.id);

		const response = NextResponse.json({
			success: true,
			user: {
				id: user.id,
				email: user.email,
				rol: user.rol,
			},
		});

		response.cookies.set("nomon_mail", token, {
			maxAge: 60 * 60 * 24 * 7, // 7 días
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "lax",
			path: "/",
		});

		return response;
	} catch (error) {
		console.error("Error en mail-login:", error);
		return NextResponse.json(
			{ error: "Error interno del servidor" },
			{ status: 500 },
		);
	}
}
