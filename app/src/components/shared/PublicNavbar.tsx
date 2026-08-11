import Link from "next/link";
import { NomonLogo } from "../landing/NomonLogo";

// Navbar del sitio público. NOMON Mail queda fuera de esta navegación.
export function PublicNavbar() {
	return (
		<header className="sticky top-0 z-40 border-b border-zinc-200/70 bg-white/85 backdrop-blur">
			<nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
				<Link href="/" aria-label="NOMON — inicio" className="block h-7">
					<NomonLogo className="h-full w-auto text-zinc-900" />
				</Link>
				<ul className="flex items-center gap-8 text-sm font-medium text-zinc-700">
					<li>
						<Link
							href="/simposio"
							className="uppercase tracking-widest transition-colors hover:text-zinc-900"
						>
							Simposio
						</Link>
					</li>
				</ul>
			</nav>
		</header>
	);
}

export function PublicFooter() {
	return (
		<footer className="border-t border-zinc-200 bg-zinc-50">
			<div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-8 text-sm text-zinc-500 md:flex-row md:items-center md:justify-between">
				<p className="font-display italic">NOMON</p>
				<p>Ideas que echan raíces, acciones que transforman.</p>
			</div>
		</footer>
	);
}