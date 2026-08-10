import Link from "next/link";
import { BicLogo } from "@/components/landing/BicLogo";
import { NomonLogo } from "@/components/landing/NomonLogo";

const NODOS = [
	{
		titulo: "Gubernamental",
		descripcion:
			"Fortalecimiento institucional y políticas públicas basadas en integridad técnica.",
		color: "#3b82f6",
	},
	{
		titulo: "Corporativo",
		descripcion:
			"Transformación de la cultura organizacional hacia la tecnología de la ética.",
		color: "#f59e0b",
	},
	{
		titulo: "Académico",
		descripcion:
			"Investigación aplicada para la construcción de modelos de futuro sostenibles.",
		color: "#10b981",
	},
	{
		titulo: "Jurídico",
		descripcion:
			"Blindaje legal y estatutario para la protección del propósito organizacional.",
		color: "#8b5cf6",
	},
];

export default function HomePage() {
	return (
		<div className="bg-white text-zinc-900">
			{/* Cabecera */}
			<section className="mx-auto max-w-6xl px-6 pt-10 pb-16">
				<div className="flex justify-end">
					<BicLogo className="h-auto w-52 text-zinc-900" />
				</div>

				{/* Grid editorial */}
				<div className="mt-20 grid items-end gap-12 md:grid-cols-[1fr_1fr]">
					<div className="flex items-end">
						<NomonLogo className="h-auto w-full max-w-md" />
					</div>
					<h2 className="font-display text-4xl italic leading-tight text-[#8f764a] md:text-5xl">
						Ideas que echan raíces,
						<br />
						acciones que transforman.
					</h2>
				</div>

				<div className="my-12 h-px w-full bg-zinc-200" />

				<p className="max-w-3xl text-justify text-xl font-extralight leading-[1.95] text-zinc-600">
					<span className="float-left mr-3 mt-1 font-display text-6xl font-semibold leading-[0.75] text-[#8f764a]">
						I
					</span>
					mpulsamos la evolución de organizaciones y comunidades a través de una
					consultoría estratégica de alto impacto fundamentada en la integridad,
					programas de formación humana que trascienden el aula para fortalecer
					un liderazgo ético consciente, y la creación artística como motor de
					cohesión social.
				</p>

				<div className="mt-12 flex flex-wrap gap-5">
					<Link
						href="/login"
						className="rounded-sm bg-[#002d62] px-8 py-3 text-xs font-bold uppercase tracking-[0.1em] text-white transition-all hover:-translate-y-0.5 hover:bg-[#003d80]"
					>
						Únete a NOMON →
					</Link>
					<Link
						href="/simposio"
						className="rounded-sm border border-zinc-300 px-8 py-3 text-xs font-bold uppercase tracking-[0.1em] text-zinc-900 transition-all hover:border-zinc-900"
					>
						Conoce más
					</Link>
				</div>
			</section>

			{/* Nodos de acción */}
			<section className="mx-auto max-w-6xl border-t border-zinc-200 px-6 pt-16 pb-24">
				<h3 className="mb-12 text-xs font-bold uppercase tracking-[0.25em] text-zinc-500 opacity-60">
					Nuestros nodos de acción
				</h3>
				<div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
					{NODOS.map((nodo) => (
						<article key={nodo.titulo} className="group flex flex-col gap-5">
							<span
								className="h-0.5 w-6 transition-all duration-300 group-hover:w-12"
								style={{ backgroundColor: nodo.color }}
							/>
							<h4 className="text-sm font-bold uppercase tracking-[0.12em] text-zinc-900">
								{nodo.titulo}
							</h4>
							<p className="text-sm leading-relaxed text-zinc-600 opacity-75">
								{nodo.descripcion}
							</p>
						</article>
					))}
				</div>
			</section>
		</div>
	);
}