const NOMON_EMAIL = "contacto@rednomon.com";

export function displayName(email: string): string {
	return email.toLowerCase() === NOMON_EMAIL ? "NOMON" : email;
}

export function displayEmail(email: string): string {
	return email.split("@", 1)[0].toLowerCase();
}

// Las keys de adjuntos en R2 tienen forma mail/<año>/<uuid>__<nombre-original>.
// Las subidas anteriores a este cambio no tienen el sufijo "__nombre" y caen al fallback.
export function nombreDesdeKey(key: string): string {
	const base = key.split("/").pop() ?? "archivo";
	const idx = base.indexOf("__");
	return idx === -1 ? base : base.slice(idx + 2);
}
