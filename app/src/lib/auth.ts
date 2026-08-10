// Implementación manual de autenticación con Iron Session + JWT
// Axiomática: Cumple con IF (Independencia), IM (Información Mínima), y Simplicidad (Suh)
// Gates: E-01 (Usuario registrado), E-02 (Sesión válida), E-03 (Rol ADMIN)

import { eq } from "drizzle-orm";
import { ironSession } from "iron-session";
import { SignJWT, jwtVerify } from "jose";
import { v4 as uuidv4 } from "uuid";
import { db } from "./db";
import { sesiones, usuarios } from "./db/schema";

// ============================================
// Configuración
// ============================================

const SESSION_SECRET =
	process.env.SESSION_SECRET || "session-secret-placeholder";
const JWT_SECRET = new TextEncoder().encode(SESSION_SECRET);
const COOKIE_NAME = "nomon_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 días en segundos

// ============================================
// Tipos
// ============================================

export interface User {
	id: string;
	nombreCompleto: string;
	telefono: string;
	areaInteres: string;
	email: string;
	rol: "ALIADO" | "ADMIN";
	passwordHash: string;
	createdAt: Date;
	updatedAt: Date;
}

export interface SessionUser {
	id: string;
	email: string;
	rol: "ALIADO" | "ADMIN";
}

export interface SessionData {
	user?: SessionUser;
	token?: string;
}

// ============================================
// Funciones de Autenticación (Gates E-01, E-02)
// ============================================

// Gate E-01: Verificar si el usuario está registrado
export async function getUserByEmail(email: string): Promise<User | null> {
	const user = await db.query.usuarios.findFirst({
		where: eq(usuarios.email, email),
	});
	return user as User | null;
}

// Gate E-02: Verificar si la sesión es válida
export async function getSessionByToken(token: string): Promise<boolean> {
	const session = await db.query.sesiones.findFirst({
		where: eq(sesiones.token, token),
	});

	if (!session) return false;

	// Verificar si la sesión ha expirado
	if (session.expiresAt < new Date()) {
		await db.delete(sesiones).where(eq(sesiones.token, token));
		return false;
	}

	return true;
}

// Crear sesión (para login/registro)
export async function createSession(userId: string): Promise<string> {
	const token = uuidv4();
	const expiresAt = new Date(Date.now() + SESSION_MAX_AGE * 1000);

	await db.insert(sesiones).values({
		id: uuidv4(),
		userId,
		token,
		expiresAt,
		createdAt: new Date(),
	});

	return token;
}

// Invalidar sesión (para logout)
export async function invalidateSession(token: string): Promise<void> {
	await db.delete(sesiones).where(eq(sesiones.token, token));
}

// ============================================
// Funciones de JWT
// ============================================

// Generar JWT para el usuario
export async function generateJWT(user: User): Promise<string> {
	const token = await new SignJWT({
		id: user.id,
		email: user.email,
		rol: user.rol,
	})
		.setProtectedHeader({ alg: "HS256" })
		.setIssuedAt()
		.setExpirationTime("7d")
		.sign(JWT_SECRET);

	return token;
}

// Verificar JWT
export async function verifyJWT(token: string): Promise<SessionUser | null> {
	try {
		const { payload } = await jwtVerify(token, JWT_SECRET);
		return {
			id: payload.id as string,
			email: payload.email as string,
			rol: payload.rol as "ALIADO" | "ADMIN",
		};
	} catch {
		return null;
	}
}

// ============================================
// Middleware de Iron Session
// ============================================

// Opciones de Iron Session
export const sessionOptions = {
	cookieName: COOKIE_NAME,
	password: SESSION_SECRET,
	cookieOptions: {
		maxAge: SESSION_MAX_AGE,
		secure: process.env.NODE_ENV === "production",
		httpOnly: true,
		sameSite: "lax" as const,
		path: "/",
	},
};

// Tipos para Iron Session
declare module "iron-session" {
	interface IronSessionData extends SessionData {}
}

// ============================================
// Funciones de Verificación (Gates)
// ============================================

// Gate E-01 + E-02 + E-03: Obtener usuario actual de la sesión (resuelto desde BD)
export async function getCurrentUser(
	token: string,
): Promise<SessionUser | null> {
	const isValid = await getSessionByToken(token);
	if (!isValid) return null;

	// Resolver el usuario desde la fila de Sesion (token de BD, no JWT)
	const session = await db.query.sesiones.findFirst({
		where: eq(sesiones.token, token),
	});
	if (!session) return null;

	const user = await db.query.usuarios.findFirst({
		where: eq(usuarios.id, session.userId),
	});

	if (!user) return null;

	return {
		id: user.id,
		email: user.email,
		rol: user.rol ?? "ALIADO",
	};
}

// Gate E-03: Verificar si el usuario es ADMIN
export function isAdmin(user: SessionUser | null): boolean {
	return user?.rol === "ADMIN";
}

// ============================================
// Funciones de Contraseña (Simplificado para desarrollo)
// NOTA: En producción, usar bcrypt o scrypt
// ============================================

// Hash de contraseña (simplificado)
// En producción: usar bcrypt.hash(password, 10)
export async function hashPassword(password: string): Promise<string> {
	// Para desarrollo: usar hash simple (NO SEGURO)
	// Esto es solo para pruebas, en producción usar bcrypt
	const hashBuffer = await crypto.subtle.digest(
		"SHA-256",
		new TextEncoder().encode(password),
	);
	const hashArray = Array.from(new Uint8Array(hashBuffer));
	const hashHex = hashArray
		.map((b) => b.toString(16).padStart(2, "0"))
		.join("");
	return hashHex;
}

// Verificar contraseña (simplificado)
export async function verifyPassword(
	inputPassword: string,
	storedHash: string,
): Promise<boolean> {
	// En producción: usar bcrypt.compare(inputPassword, storedHash)
	// Para desarrollo: comparar hashes SHA-256
	const inputHash = await hashPassword(inputPassword);
	return inputHash === storedHash;
}
