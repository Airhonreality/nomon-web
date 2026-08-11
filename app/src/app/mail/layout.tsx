import { MailNavbar } from "@/components/shared/MailNavbar";
import type { ReactNode } from "react";

// Layout de NOMON Mail (correo corporativo).
// Puerta separada de la membresía: no usa navbar ni footer públicos.
export default function MailLayout({
	children,
}: {
	children: ReactNode;
}) {
	return (
		<div className="flex min-h-screen flex-col bg-zinc-50">
			<MailNavbar />
			<main className="flex-1">{children}</main>
		</div>
	);
}
