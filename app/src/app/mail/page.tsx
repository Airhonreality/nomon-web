"use client";

import { Composer } from "@/components/mail/Composer";
import { MessageDetail } from "@/components/mail/MessageDetail";
import { displayName } from "@/lib/mail-display";
import { MailOpen, Paperclip, SquarePen, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

interface Mensaje {
	id: string;
	direccion: "ENVIADO" | "RECIBIDO";
	de: string;
	para: string;
	asunto: string;
	cuerpo: string;
	adjuntos?: string[] | null;
	createdAt: string;
}

export default function MailPage() {
	const [mensajes, setMensajes] = useState<Mensaje[]>([]);
	const [seleccionadoId, setSeleccionadoId] = useState<string | null>(null);
	const [filtro, setFiltro] = useState<"todos" | "ENVIADO" | "RECIBIDO">(
		"todos",
	);
	const [error, setError] = useState<string | null>(null);
	const [componiendo, setComponiendo] = useState(false);
	const [toast, setToast] = useState<string | null>(null);
	const [seleccionadas, setSeleccionadas] = useState<Set<string>>(new Set());
	const [eliminando, setEliminando] = useState(false);

	useEffect(() => {
		fetch("/api/correo")
			.then((res) => {
				if (res.status === 401 || res.status === 403) {
					setError("No autorizado");
					window.location.href = "/mail/login?from=/mail";
					return null;
				}
				return res.json();
			})
			.then((data) => {
				if (data && Array.isArray(data)) setMensajes(data);
			})
			.catch(() => setError("Error al cargar la bandeja"));
	}, []);

	const visibles = mensajes.filter(
		(m) => filtro === "todos" || m.direccion === filtro,
	);
	const seleccionado = mensajes.find((m) => m.id === seleccionadoId) || null;
	const todasSeleccionadas =
		visibles.length > 0 && visibles.every((m) => seleccionadas.has(m.id));

	function toggleSeleccion(id: string) {
		setSeleccionadas((prev) => {
			const next = new Set(prev);
			if (next.has(id)) next.delete(id);
			else next.add(id);
			return next;
		});
	}

	function toggleTodas() {
		setSeleccionadas((prev) => {
			const next = new Set(prev);
			if (todasSeleccionadas) {
				visibles.forEach((m) => next.delete(m.id));
			} else {
				visibles.forEach((m) => next.add(m.id));
			}
			return next;
		});
	}

	async function eliminarSeleccionadas() {
		const ids = Array.from(seleccionadas);
		if (ids.length === 0) return;
		setEliminando(true);
		try {
			const res = await fetch("/api/correo", {
				method: "DELETE",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ ids }),
			});
			if (!res.ok) {
				const data = await res.json().catch(() => ({}));
				setError(data.error || "Error al eliminar mensajes");
				return;
			}
			setMensajes((prev) => prev.filter((m) => !seleccionadas.has(m.id)));
			if (seleccionadoId && seleccionadas.has(seleccionadoId)) {
				setSeleccionadoId(null);
			}
			setSeleccionadas(new Set());
			setToast(
				ids.length === 1
					? "Mensaje eliminado"
					: `${ids.length} mensajes eliminados`,
			);
			setTimeout(() => setToast(null), 4000);
		} catch {
			setError("Error al eliminar mensajes");
		} finally {
			setEliminando(false);
		}
	}

	return (
		<div className="flex flex-1 flex-col bg-zinc-50 font-sans min-h-screen">
			<header className="flex items-center justify-between border-b border-zinc-200 bg-white px-8 py-4 shadow-xs">
				<h1 className="text-xl font-bold tracking-tight text-zinc-900">
					NOMON <span className="text-emerald-700 font-normal">Mail</span>
				</h1>
				<button
					type="button"
					onClick={() => setComponiendo(true)}
					className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-emerald-500 transition-colors"
				>
					<SquarePen className="size-icon-md" aria-hidden="true" />
					Nuevo mensaje
				</button>
			</header>

			{toast && (
				<div className="mx-8 mt-4 rounded-lg bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm text-emerald-800">
					{toast}
				</div>
			)}

			<div className="flex flex-1 flex-col lg:flex-row overflow-hidden">
				{/* Columna de filtros y lista de mensajes */}
				<section className="w-full lg:w-96 border-b lg:border-b-0 lg:border-r border-zinc-200 bg-white flex flex-col">
					<div className="flex items-center gap-1.5 border-b border-zinc-100 p-3 text-sm">
						{(["todos", "RECIBIDO", "ENVIADO"] as const).map((f) => (
							<button
								key={f}
								type="button"
								onClick={() => setFiltro(f)}
								className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
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
					</div>

					<div className="flex items-center justify-between gap-2 border-b border-zinc-100 p-3">
						<label className="flex cursor-pointer items-center gap-2 text-xs text-zinc-600">
							<input
								type="checkbox"
								checked={todasSeleccionadas}
								onChange={toggleTodas}
								className="size-3.5 accent-zinc-900"
							/>
							Seleccionar todo
						</label>
						<button
							type="button"
							onClick={eliminarSeleccionadas}
							disabled={seleccionadas.size === 0 || eliminando}
							className="flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm transition-colors hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-40"
						>
							<Trash2 className="size-icon-sm" aria-hidden="true" />
							{eliminando
								? "Eliminando…"
								: `Eliminar${
										seleccionadas.size > 0 ? ` (${seleccionadas.size})` : ""
									}`}
						</button>
					</div>

					{error && <p className="p-4 text-sm text-red-600">{error}</p>}

					{!error && visibles.length === 0 && (
						<p className="p-8 text-sm text-zinc-500 text-center">
							No hay mensajes en esta bandeja.
						</p>
					)}

					<ul className="overflow-y-auto divide-y divide-zinc-100 flex-1">
						{visibles.map((m) => {
							const hasAdj = m.adjuntos && m.adjuntos.length > 0;
							return (
								<li key={m.id} className="flex items-start">
									<div className="flex items-center justify-center pl-4 pt-4">
										<input
											type="checkbox"
											checked={seleccionadas.has(m.id)}
											onChange={() => toggleSeleccion(m.id)}
											aria-label={`Seleccionar: ${m.asunto}`}
											className="size-3.5 accent-zinc-900"
										/>
									</div>
									<button
										type="button"
										onClick={() => setSeleccionadoId(m.id)}
										className={`flex w-full flex-col gap-1.5 p-4 text-left transition-colors ${
											seleccionadoId === m.id
												? "bg-emerald-50/60 border-l-4 border-emerald-600"
												: "hover:bg-zinc-50"
										}`}
									>
										<div className="flex items-center gap-2 text-xs text-zinc-500 w-full">
											<span
												className={`rounded px-1.5 py-0.5 font-medium ${
													m.direccion === "RECIBIDO"
														? "bg-sky-50 text-sky-700"
														: "bg-emerald-50 text-emerald-700"
												}`}
											>
												{m.direccion === "RECIBIDO" ? "Recibido" : "Enviado"}
											</span>
											{hasAdj && (
												<Paperclip
													className="size-icon-sm shrink-0"
													role="img"
													aria-label="Tiene adjuntos"
												/>
											)}
											<span className="truncate font-medium text-zinc-700">
												{m.direccion === "RECIBIDO"
													? displayName(m.de)
													: displayName(m.para)}
											</span>
											<span className="ml-auto text-[10px] text-zinc-400 whitespace-nowrap">
												{new Date(m.createdAt).toLocaleDateString()}
											</span>
										</div>
										<span className="truncate text-sm font-semibold text-zinc-900">
											{m.asunto}
										</span>
										<span className="truncate text-xs text-zinc-500">
											{m.cuerpo.replace(/<[^>]*>?/gm, "")}
										</span>
									</button>
								</li>
							);
						})}
					</ul>
				</section>

				{/* Columna de detalle del mensaje */}
				<section className="flex-1 bg-zinc-50/50 p-6 overflow-y-auto">
					{seleccionado ? (
						<MessageDetail
							mensaje={seleccionado}
							onReply={() => setComponiendo(true)}
						/>
					) : (
						<div className="flex h-full items-center justify-center p-12 text-center text-zinc-400">
							<div>
								<MailOpen
									className="size-icon-hero mx-auto mb-3 text-zinc-300"
									aria-hidden="true"
								/>
								<p className="text-sm">
									Selecciona un mensaje de la lista para leer el contenido.
								</p>
							</div>
						</div>
					)}
				</section>
			</div>

			{/* Modal Compositor */}
			{componiendo && (
				<Composer
					replyTo={seleccionado?.direccion === "RECIBIDO" ? seleccionado : null}
					onClose={() => setComponiendo(false)}
					onSent={() => {
						setComponiendo(false);
						setToast("Correo enviado exitosamente");
						setTimeout(() => setToast(null), 4000);
						fetch("/api/correo")
							.then((res) => res.json())
							.then((data) => {
								if (data && Array.isArray(data)) setMensajes(data);
							});
					}}
				/>
			)}
		</div>
	);
}
