import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Playfair_Display } from "next/font/google";
import type { ReactNode } from "react";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
	variable: "--font-sans",
	subsets: ["latin"],
});

const playfair = Playfair_Display({
	variable: "--font-display",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: {
		default: "NOMON — Ideas que echan raíces, acciones que transforman",
		template: "%s | NOMON",
	},
	description:
		"NOMON impulsa la evolución de organizaciones y comunidades a través de consultoría estratégica, formación humana y creación artística.",
};

export default function RootLayout({
	children,
}: {
	children: ReactNode;
}) {
	return (
		<html lang="es" className={`${plusJakarta.variable} ${playfair.variable}`}>
			<body className="min-h-full antialiased">{children}</body>
		</html>
	);
}