import Link from "next/link";
import { MailLogoutButton } from "./MailLogoutButton";

// Navbar de NOMON Mail (correo corporativo, solo correos @rednomon.com).
// Ruta fuera de la shell pública.
export function MailNavbar() {
	return (
		<header className="border-b border-zinc-200 bg-white">
			<nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
				<Link
					href="/mail"
					className="text-sm font-semibold uppercase tracking-widest text-zinc-900"
				>
					NOMON Mail
				</Link>
				<div className="flex items-center gap-4">
					<MailLogoutButton />
					<Link
						href="/"
						className="text-sm text-zinc-600 transition-colors hover:text-zinc-900"
					>
						← Volver al sitio
					</Link>
				</div>
			</nav>
		</header>
	);
}
