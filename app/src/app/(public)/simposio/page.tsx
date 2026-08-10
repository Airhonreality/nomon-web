import type { Metadata } from "next";
import { SimposioDeck } from "@/components/simposio/SimposioDeck";

export const metadata: Metadata = {
	title: "Simposio Internacional de Ética",
	description:
		"Protocolos de Integridad para la Supervivencia multi especie y la Sustentabilidad Sistémica.",
};

export default function SimposioPage() {
	return (
		<div className="bg-white text-zinc-900">
			<SimposioDeck />
		</div>
	);
}