// Middleware de autenticación para Next.js App Router
// Gates: E-01 (Usuario registrado), E-02 (Sesión válida), E-03 (Rol ADMIN)
// Axiomática: Cumple con IF (Independencia) y Simplicidad (Suh)

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getCurrentUser, isAdmin } from "./lib/auth";

// Rutas públicas (no requieren autenticación)
const PUBLIC_PATHS = [
	"/",
	"/simposio",
	"/recursos",
	"/login",
	"/register",
	"/api/auth",
];

// Rutas que requieren ADMIN
const ADMIN_PATHS = ["/correo", "/admin"];

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

	// Obtener token de la cookie
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

	// Verificar rutas de ADMIN
	const isAdminPath = ADMIN_PATHS.some(
		(path) => pathname === path || pathname.startsWith(`${path}/`),
	);

	if (isAdminPath && !isAdmin(user)) {
		// Gate E-03: Rol insuficiente
		const url = new URL("/", nextUrl);
		url.searchParams.set("error", "unauthorized");
		return NextResponse.redirect(url);
	}

	// Si pasa todos los gates, continuar
	return NextResponse.next();
}

export const config = {
	matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
