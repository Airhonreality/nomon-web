import type { ReactNode } from "react";
import { CorreoNavbar } from "@/components/shared/CorreoNavbar";

// Layout del área privada (correo corporativo): sin navbar ni footer públicos.
export default function PrivateLayout({
	children,
}: {
	children: ReactNode;
}) {
	return (
		<div className="flex min-h-screen flex-col bg-zinc-50">
			<CorreoNavbar />
			<main className="flex-1">{children}</main>
		</div>
	);
}