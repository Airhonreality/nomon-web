import type { ReactNode } from "react";
import { PublicFooter, PublicNavbar } from "@/components/shared/PublicNavbar";

export default function PublicLayout({
	children,
}: {
	children: ReactNode;
}) {
	return (
		<div className="flex min-h-screen flex-col">
			<PublicNavbar />
			<main className="flex-1">{children}</main>
			<PublicFooter />
		</div>
	);
}