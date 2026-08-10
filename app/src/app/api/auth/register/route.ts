// API Route para Registro de Usuario
// Gate E-01: Crear usuario registrado
// Gate E-02: Crear sesión válida

import {
	type User,
	createSession,
	generateJWT,
	getUserByEmail,
	hashPassword,
} from "@/lib/auth";
import { db } from "@/lib/db";
import { usuarios } from "@/lib/db/schema";
import { type NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: NextRequest) {
	try {
		const { nombreCompleto, telefono, areaInteres, email, password } =
			await req.json();

		// Validaciones básicas
		if (!nombreCompleto || !telefono || !areaInteres || !email || !password) {
			return NextResponse.json(
				{ error: "Todos los campos son requeridos" },
				{ status: 400 },
			);
		}

		// Validar formato de email
		if (!email.includes("@")) {
			return NextResponse.json({ error: "Email inválido" }, { status: 400 });
		}

		// Validar longitud de contraseña
		if (password.length < 6) {
			return NextResponse.json(
				{ error: "La contraseña debe tener al menos 6 caracteres" },
				{ status: 400 },
			);
		}

		// Gate E-01: Verificar que el email no exista
		const existingUser = await getUserByEmail(email);

		if (existingUser) {
			return NextResponse.json(
				{ error: "Email ya registrado" },
				{ status: 409 },
			);
		}

		// Hash de la contraseña
		const passwordHash = await hashPassword(password);

		// Crear usuario
		const user = await db
			.insert(usuarios)
			.values({
				id: uuidv4(),
				nombreCompleto,
				telefono,
				areaInteres,
				email,
				passwordHash,
				rol: "ALIADO", // Rol por defecto
				createdAt: new Date(),
				updatedAt: new Date(),
			})
			.returning();

		const newUser = user[0];

		// Gate E-02: Crear sesión válida
		const token = await createSession(newUser.id);
		const jwt = await generateJWT(newUser as User);

		// Configurar cookie
		const response = NextResponse.json({
			success: true,
			user: {
				id: newUser.id,
				email: newUser.email,
				rol: newUser.rol,
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
		console.error("Error en registro:", error);
		return NextResponse.json(
			{ error: "Error interno del servidor" },
			{ status: 500 },
		);
	}
}
