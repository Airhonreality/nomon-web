// Middleware de autenticación para Next.js App Router
// Gates: E-01 (Usuario registrado), E-02 (Sesión válida), E-03 (Acceso a NOMON Mail)
// Axiomática: Cumple con IF (Independencia) y Simplicidad (Suh)
//
// Dos dominios de sesión separados:
//  - `nomon_session` → membresía (aliados/usuario) en rutas privadas del sitio.
//  - `nomon_mail`    → NOMON Mail (/mail/**), solo correos @rednomon.com.

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getCurrentUser } from "./lib/auth";
import { esCorreoCorporativo } from "./lib/auth-mail";

// Rutas públicas (no requieren autenticación)
const PUBLIC_PATHS = [
	"/",
	"/simposio",
	"/recursos",
	"/login",
	"/register",
	"/mail/login",
	"/api/auth",
];

// Rutas que requieren sesión de NOMON Mail (cookie `nomon_mail` + dominio @rednomon.com)
const MAIL_PATHS = ["/mail"];

export default async function middleware(req: NextRequest) {
	const { nextUrl } = req;
	const pathname = nextUrl.pathname;

	// Verificar si es ruta pública
	const isPublicPath = PUBLIC_PATHS.some(
		(path) => pathname === path || pathname.startsWith(`${path}/`),
	);

	if (isPublicPath) {
		return NextResponse.next();
	}

	// Rutas de NOMON Mail: exigen sesión `nomon_mail` + correo corporativo
	const isMailPath = MAIL_PATHS.some(
		(path) => pathname === path || pathname.startsWith(`${path}/`),
	);

	if (isMailPath) {
		const mailToken = req.cookies.get("nomon_mail")?.value;

		if (!mailToken) {
			const url = new URL("/mail/login", nextUrl);
			url.searchParams.set("from", pathname);
			return NextResponse.redirect(url);
		}

		const mailUser = await getCurrentUser(mailToken);

		if (!mailUser || !esCorreoCorporativo(mailUser.email)) {
			const url = new URL("/mail/login", nextUrl);
			url.searchParams.set("from", pathname);
			url.searchParams.set("error", "session_expired");
			return NextResponse.redirect(url);
		}

		return NextResponse.next();
	}

	// Resto del sitio privado de membresía: requiere `nomon_session`
	const token = req.cookies.get("nomon_session")?.value;

	if (!token) {
		// Gate E-01/E-02: No hay sesión válida
		const url = new URL("/login", nextUrl);
		url.searchParams.set("from", pathname);
		return NextResponse.redirect(url);
	}

	// Verificar usuario actual
	const user = await getCurrentUser(token);

	if (!user) {
		// Gate E-01/E-02: Sesión inválida o expirada
		const url = new URL("/login", nextUrl);
		url.searchParams.set("from", pathname);
		url.searchParams.set("error", "session_expired");
		return NextResponse.redirect(url);
	}

	// Si pasa todos los gates, continuar
	return NextResponse.next();
}

export const config = {
	matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
