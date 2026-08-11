"use client";

import { type Slide, slides } from "@/lib/data/simposio";
import { useEffect, useMemo, useState } from "react";

// Renderiza **negrita** simple en markdown a <strong>
function BoldText({ text }: { text: string }) {
	const parts = text.split(/\*\*(.+?)\*\*/g);
	return (
		<>
			{parts.map((part, i) =>
				i % 2 === 1 ? (
					<strong key={i}>{part}</strong>
				) : (
					<span key={i}>{part}</span>
				),
			)}
		</>
	);
}

function SlideBody({ slide }: { slide: Slide }) {
	if (slide.bullets) {
		return (
			<ul className="flex flex-col gap-6">
				{slide.bullets.map((b, i) => (
					<li
						key={i}
						className="flex gap-4 border-l-2 pl-5 text-lg leading-relaxed text-zinc-700"
						style={{ borderColor: slide.accent }}
					>
						<BoldText text={b} />
					</li>
				))}
			</ul>
		);
	}

	if (slide.nodes) {
		return (
			<ul className="grid gap-4 sm:grid-cols-2">
				{slide.nodes.map((node, i) => (
					<li
						key={i}
						className="rounded-lg border border-zinc-200 bg-white p-5 transition-shadow hover:shadow-md"
					>
						<p className="mb-1 font-semibold text-zinc-900">{node.role}</p>
						<p className="text-sm leading-relaxed text-zinc-600">{node.desc}</p>
					</li>
				))}
			</ul>
		);
	}

	if (slide.badges) {
		return (
			<ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
				{slide.badges.map((badge, i) => (
					<li
						key={i}
						className="flex flex-col items-center gap-3 rounded-xl border border-zinc-200 bg-white p-5 text-center"
					>
						{/* eslint-disable-next-line @next/next/no-img-element */}
						<img
							src={badge.image}
							alt={badge.name}
							className="h-20 w-20 rounded-full object-cover"
						/>
						<p className="font-semibold text-zinc-900">{badge.name}</p>
						<p className="text-sm text-zinc-500">{badge.role}</p>
					</li>
				))}
			</ul>
		);
	}

	if (slide.gallery) {
		return (
			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{slide.gallery.map((src, i) => (
					// eslint-disable-next-line @next/next/no-img-element
					<img
						key={i}
						src={src}
						alt={`Momentos del evento en Barranquilla ${i + 1}`}
						className="aspect-[4/3] w-full rounded-lg object-cover"
					/>
				))}
			</div>
		);
	}

	return (
		<p className="max-w-2xl text-xl leading-relaxed text-zinc-700 md:text-2xl">
			{slide.content}
		</p>
	);
}

export function SimposioDeck() {
	const [current, setCurrent] = useState(0);
	const [indexOpen, setIndexOpen] = useState(false);
	const [readMore, setReadMore] = useState<Slide | null>(null);

	const slide = slides[current];
	const isFirst = current === 0;
	const isLast = current === slides.length - 1;

	const next = useMemo(
		() => () => {
			setCurrent((prev) => (prev < slides.length - 1 ? prev + 1 : 0));
			setIndexOpen(false);
		},
		[],
	);
	const prev = useMemo(
		() => () => {
			setCurrent((p) => (p > 0 ? p - 1 : slides.length - 1));
			setIndexOpen(false);
		},
		[],
	);

	useEffect(() => {
		const onKey = (e: KeyboardEvent) => {
			if (e.key === "ArrowRight") {
				e.preventDefault();
				next();
			}
			if (e.key === "ArrowLeft") {
				e.preventDefault();
				prev();
			}
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [next, prev]);

	// Swipe táctil
	const [touchX, setTouchX] = useState<number | null>(null);
	const onTouchStart = (e: React.TouchEvent) => setTouchX(e.touches[0].clientX);
	const onTouchEnd = (e: React.TouchEvent) => {
		if (touchX === null) return;
		const delta = touchX - e.changedTouches[0].clientX;
		if (Math.abs(delta) > 60) {
			if (delta > 0) next();
			else prev();
		}
		setTouchX(null);
	};

	return (
		<div className="mx-auto max-w-6xl px-6 py-12 md:py-16">
			{/* Índice desplegable */}
			<div className="mb-12">
				<button
					type="button"
					onClick={() => setIndexOpen((v) => !v)}
					className="mb-4 text-sm font-semibold uppercase tracking-widest text-zinc-500 transition-colors hover:text-zinc-900"
				>
					Índice {indexOpen ? "▴" : "▾"}
				</button>
				{indexOpen && (
					<ul className="grid gap-1 sm:grid-cols-2 lg:grid-cols-3">
						{slides.map((s, i) => (
							<li key={s.id}>
								<button
									type="button"
									onClick={() => {
										setCurrent(i);
										setIndexOpen(false);
									}}
									className={`w-full rounded-md px-3 py-2 text-left text-sm transition-colors ${
										i === current
											? "bg-zinc-900 text-white"
											: "text-zinc-600 hover:bg-zinc-100"
									}`}
								>
									{i + 1}. {s.title}
								</button>
							</li>
						))}
					</ul>
				)}
			</div>

			{/* Slide activa — 2 columnas */}
			<div
				className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]"
				onTouchStart={onTouchStart}
				onTouchEnd={onTouchEnd}
			>
				<div>
					<p className="mb-4 text-xs font-bold tracking-[0.2em] text-zinc-400">
						{current + 1} / {slides.length}
					</p>
					<h1
						className="font-display text-4xl font-medium leading-[1.05] md:text-5xl"
						style={{ color: slide.accent }}
					>
						{slide.title}
					</h1>
					{slide.subtitle && (
						<p className="mt-4 font-display text-lg italic text-zinc-500">
							{slide.subtitle}
						</p>
					)}
				</div>

				<div className="min-h-[16rem]">
					<SlideBody slide={slide} />
					{slide.readMoreContent && (
						<button
							type="button"
							onClick={() => setReadMore(slide)}
							className="mt-8 rounded-sm border border-zinc-300 px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-zinc-800 transition-colors hover:border-zinc-900"
						>
							Leer más
						</button>
					)}
				</div>
			</div>

			{/* Navegación */}
			<div className="mt-14 flex items-center justify-between border-t border-zinc-200 pt-6">
				<button
					type="button"
					onClick={prev}
					disabled={isFirst}
					className="rounded-sm border border-zinc-300 px-5 py-2 text-sm font-semibold text-zinc-700 transition-opacity hover:bg-zinc-50 disabled:opacity-30"
				>
					← Anterior
				</button>
				<button
					type="button"
					onClick={next}
					disabled={isLast}
					className="rounded-sm bg-zinc-900 px-5 py-2 text-sm font-semibold text-white transition-opacity hover:bg-zinc-700 disabled:opacity-30"
				>
					Siguiente →
				</button>
			</div>

			{/* Modal Leer más */}
			{readMore && (
				<div
					className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
					onClick={() => setReadMore(null)}
				>
					<div
						className="max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white p-8 shadow-2xl"
						onClick={(e) => e.stopPropagation()}
					>
						<h2 className="mb-4 font-display text-2xl font-medium text-zinc-900">
							{readMore.readMoreTitle}
						</h2>
						<div className="whitespace-pre-line text-base leading-relaxed text-zinc-700">
							{readMore.readMoreContent}
						</div>
						<button
							type="button"
							onClick={() => setReadMore(null)}
							className="mt-6 rounded-sm bg-zinc-900 px-6 py-2 text-sm font-semibold text-white hover:bg-zinc-700"
						>
							Cerrar
						</button>
					</div>
				</div>
			)}
		</div>
	);
}
