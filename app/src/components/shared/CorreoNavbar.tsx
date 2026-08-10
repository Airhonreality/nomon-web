import Link from "next/link";

// Navbar del área privada del correo corporativo (solo ADMIN).
// Layout independiente de la shell pública.
export function CorreoNavbar() {
	return (
		<header className="border-b border-zinc-200 bg-white">
			<nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
				<Link
					href="/correo"
					className="text-sm font-semibold uppercase tracking-widest text-zinc-900"
				>
					Correo corporativo
				</Link>
				<Link
					href="/"
					className="text-sm text-zinc-600 transition-colors hover:text-zinc-900"
				>
					← Volver al sitio
				</Link>
			</nav>
		</header>
	);
}