"use client";

import { useRouter } from "next/navigation";

// Botón de cierre de sesión de NOMON Mail.
// POST /api/auth/mail-logout invalida la sesión y limpia la cookie nomon_mail.
export function MailLogoutButton() {
	const router = useRouter();

	async function handleLogout() {
		await fetch("/api/auth/mail-logout", { method: "POST" });
		router.push("/mail/login");
		router.refresh();
	}

	return (
		<button
			type="button"
			onClick={handleLogout}
			className="text-sm text-zinc-600 transition-colors hover:text-zinc-900"
		>
			Cerrar sesión
		</button>
	);
}
