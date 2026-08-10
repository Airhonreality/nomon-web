"use client";

import { useEffect, useState } from "react";

interface Mensaje {
	id: string;
	direccion: "ENVIADO" | "RECIBIDO";
	de: string;
	para: string;
	asunto: string;
	cuerpo: string;
	createdAt: string;
}

// Bandeja del correo corporativo (solo ADMIN)
export default function CorreoPage() {
	const [mensajes, setMensajes] = useState<Mensaje[]>([]);
	const [seleccionadoId, setSeleccionadoId] = useState<string | null>(null);
	const [filtro, setFiltro] = useState<"todos" | "ENVIADO" | "RECIBIDO">(
		"todos",
	);
	const [error, setError] = useState<string | null>(null);
	const [componiendo, setComponiendo] = useState(false);
	const [toast, setToast] = useState<string | null>(null);

	useEffect(() => {
		fetch("/api/correo")
			.then((res) => {
				if (res.status === 401 || res.status === 403) {
					setError("No autorizado");
					window.location.href = "/login?from=/correo";
					return null;
				}
				return res.json();
			})
			.then((data) => {
				if (data) setMensajes(data);
			})
			.catch(() => setError("Error al cargar la bandeja"));
	}, []);

	const visibles = mensajes.filter(
		(m) => filtro === "todos" || m.direccion === filtro,
	);
	const seleccionado = mensajes.find((m) => m.id === seleccionadoId) || null;

	return (
		<div className="flex flex-1 flex-col bg-zinc-50 font-sans">
			<header className="border-b border-zinc-200 bg-white px-6 py-4">
				<h1 className="text-2xl font-semibold text-zinc-900">
					Correo corporativo
				</h1>
			</header>

			{toast && (
				<div className="mx-6 mt-4 rounded-lg bg-emerald-50 px-4 py-2 text-sm text-emerald-700">
					{toast}
				</div>
			)}

			<div className="flex flex-1 flex-col md:flex-row">
				{/* Lista */}
				<section className="w-full border-b border-zinc-200 bg-white md:w-1/3 md:border-b-0 md:border-r">
					<div className="flex items-center gap-1 border-b border-zinc-100 px-4 py-2 text-sm">
						{(["todos", "RECIBIDO", "ENVIADO"] as const).map((f) => (
							<button
								key={f}
								type="button"
								onClick={() => setFiltro(f)}
								className={`rounded-full px-3 py-1 transition-colors ${
									filtro === f
										? "bg-zinc-900 text-white"
										: "text-zinc-600 hover:bg-zinc-100"
								}`}
							>
								{f === "todos"
									? "Todos"
									: f === "RECIBIDO"
										? "Recibidos"
										: "Enviados"}
							</button>
						))}
						<button
							type="button"
							onClick={() => setComponiendo(true)}
							className="ml-auto rounded-full bg-emerald-600 px-3 py-1 text-white hover:bg-emerald-500"
						>
							Nuevo
						</button>
					</div>

					{error && <p className="px-4 py-4 text-sm text-red-600">{error}</p>}

					{!error && visibles.length === 0 && (
						<p className="px-4 py-6 text-sm text-zinc-500">No hay mensajes.</p>
					)}

					<ul>
						{visibles.map((m) => (
							<li key={m.id}>
								<button
									type="button"
									onClick={() => setSeleccionadoId(m.id)}
									className={`flex w-full flex-col gap-1 border-b border-zinc-100 px-4 py-3 text-left transition-colors ${
										seleccionadoId === m.id ? "bg-zinc-100" : "hover:bg-zinc-50"
									}`}
								>
									<span className="flex items-center gap-2 text-sm text-zinc-500">
										<span
											className={`rounded px-1.5 py-0.5 text-xs font-medium ${
												m.direccion === "RECIBIDO"
													? "bg-sky-50 text-sky-700"
													: "bg-emerald-50 text-emerald-700"
											}`}
										>
											{m.direccion === "RECIBIDO" ? "Recibido" : "Enviado"}
										</span>
										<span className="truncate">
											{m.direccion === "RECIBIDO" ? m.de : m.para}
										</span>
										<span className="ml-auto text-xs text-zinc-400">
											{new Date(m.createdAt).toLocaleDateString()}
										</span>
									</span>
									<span className="truncate font-medium text-zinc-900">
										{m.asunto}
									</span>
								</button>
							</li>
						))}
					</ul>
				</section>

				{/* Detalle */}
				<section className="flex-1 bg-white p-6">
					{seleccionado ? (
						<article className="flex flex-col gap-4">
							<div className="flex items-start justify-between gap-4">
								<h2 className="text-xl font-semibold text-zinc-900">
									{seleccionado.asunto}
								</h2>
								<button
									type="button"
									onClick={() => setComponiendo(true)}
									className="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm text-zinc-700 hover:bg-zinc-50"
								>
									Responder
								</button>
							</div>
							<div className="text-sm text-zinc-600">
								<p>
									<span className="font-medium">De:</span> {seleccionado.de}
								</p>
								<p>
									<span className="font-medium">Para:</span> {seleccionado.para}
								</p>
								<p className="text-zinc-400">
									{new Date(seleccionado.createdAt).toLocaleString()}
								</p>
							</div>
							<div className="whitespace-pre-wrap text-zinc-800">
								{seleccionado.cuerpo}
							</div>
						</article>
					) : (
						<p className="text-zinc-400">Selecciona un mensaje.</p>
					)}
				</section>
			</div>

			{/* Compositor */}
			{componiendo && (
				<Composer
					replyTo={seleccionado?.direccion === "RECIBIDO" ? seleccionado : null}
					onClose={() => setComponiendo(false)}
					onSent={() => {
						setComponiendo(false);
						setToast("Mensaje enviado");
						setTimeout(() => setToast(null), 3000);
						fetch("/api/correo")
							.then((res) => res.json())
							.then(setMensajes);
					}}
				/>
			)}
		</div>
	);
}

function Composer({
	replyTo,
	onClose,
	onSent,
}: {
	replyTo: Mensaje | null;
	onClose: () => void;
	onSent: () => void;
}) {
	const [para, setPara] = useState(replyTo?.de || "");
	const [asunto, setAsunto] = useState(replyTo ? `Re: ${replyTo.asunto}` : "");
	const [cuerpo, setCuerpo] = useState("");
	const [enviando, setEnviando] = useState(false);
	const [error, setError] = useState<string | null>(null);

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setEnviando(true);
		setError(null);

		const res = await fetch("/api/correo/enviar", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ para, asunto, cuerpo }),
		});

		const data = await res.json();
		if (!res.ok) {
			setError(data.error || "Error al enviar");
			setEnviando(false);
			return;
		}
		onSent();
	}

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
			<form
				onSubmit={handleSubmit}
				className="flex w-full max-w-lg flex-col gap-3 rounded-xl bg-white p-6 shadow-lg"
			>
				<h2 className="text-lg font-semibold text-zinc-900">
					{replyTo ? "Responder" : "Nuevo mensaje"}
				</h2>

				<label className="flex flex-col gap-1 text-sm text-zinc-600">
					Para
					<input
						type="email"
						value={para}
						onChange={(e) => setPara(e.target.value)}
						required
						className="rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 outline-none focus:border-zinc-500"
					/>
				</label>

				<label className="flex flex-col gap-1 text-sm text-zinc-600">
					Asunto
					<input
						type="text"
						value={asunto}
						onChange={(e) => setAsunto(e.target.value)}
						required
						className="rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 outline-none focus:border-zinc-500"
					/>
				</label>

				<label className="flex flex-col gap-1 text-sm text-zinc-600">
					Cuerpo
					<textarea
						value={cuerpo}
						onChange={(e) => setCuerpo(e.target.value)}
						required
						rows={8}
						className="rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 outline-none focus:border-zinc-500"
					/>
				</label>

				{error && <p className="text-sm text-red-600">{error}</p>}

				<div className="flex justify-end gap-2">
					<button
						type="button"
						onClick={onClose}
						className="rounded-lg border border-zinc-300 px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-50"
					>
						Cancelar
					</button>
					<button
						type="submit"
						disabled={enviando}
						className="rounded-lg bg-zinc-900 px-4 py-2 text-sm text-white transition-colors hover:bg-zinc-700 disabled:opacity-50"
					>
						{enviando ? "Enviando…" : "Enviar"}
					</button>
				</div>
			</form>
		</div>
	);
}
