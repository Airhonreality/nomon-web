const NOMON_EMAIL = "contacto@rednomon.com";

export function displayName(email: string): string {
	return email.toLowerCase() === NOMON_EMAIL ? "NOMON" : email;
}

export function displayEmail(email: string): string {
	return email.split("@", 1)[0].toLowerCase();
}
