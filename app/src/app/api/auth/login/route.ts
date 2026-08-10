// API Route para Login
// Gate E-01: Verificar usuario registrado
// Gate E-02: Crear sesión válida

import {
	createSession,
	generateJWT,
	getUserByEmail,
	verifyPassword,
} from "@/lib/auth";
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

		// Gate E-01: Verificar usuario registrado
		const user = await getUserByEmail(email);

		if (!user) {
			return NextResponse.json(
				{ error: "Usuario no encontrado" },
				{ status: 404 },
			);
		}

		// Verificar contraseña
		const isValidPassword = await verifyPassword(password, user.passwordHash);

		if (!isValidPassword) {
			return NextResponse.json(
				{ error: "Contraseña incorrecta" },
				{ status: 401 },
			);
		}

		// Gate E-02: Crear sesión válida
		const token = await createSession(user.id);
		const jwt = await generateJWT(user);

		// Configurar cookie
		const response = NextResponse.json({
			success: true,
			user: {
				id: user.id,
				email: user.email,
				rol: user.rol,
			},
		});

		response.cookies.set("nomon_session", token, {
			maxAge: 60 * 60 * 24 * 7, // 7 días
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "lax",
			path: "/",
		});

		return response;
	} catch (error) {
		console.error("Error en login:", error);
		return NextResponse.json(
			{ error: "Error interno del servidor" },
			{ status: 500 },
		);
	}
}
