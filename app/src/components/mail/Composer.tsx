"use client";

import { subirAdjuntoR2 } from "@/lib/r2-client";
import Placeholder from "@tiptap/extension-placeholder";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
	Bold,
	ChevronDown,
	Eraser,
	FileText,
	GripVertical,
	Italic,
	Link2,
	List,
	ListOrdered,
	type LucideIcon,
	Maximize2,
	Minimize2,
	Minus,
	Paperclip,
	PenLine,
	Strikethrough,
	TextQuote,
	Trash2,
	Type,
	Underline,
	X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";

type Adjunto = { key: string; nombre: string; tamano: number; tipo: string };
type Vista = "normal" | "minimizado" | "maximizado";

const BUZON = "contacto@rednomon.com";

export function Composer({
	replyTo,
	onClose,
	onSent,
}: {
	replyTo: { de: string; asunto: string } | null;
	onClose: () => void;
	onSent: () => void;
}) {
	const [para, setPara] = useState(replyTo?.de ?? "");
	const [asunto, setAsunto] = useState(replyTo ? `Re: ${replyTo.asunto}` : "");
	const [adjuntos, setAdjuntos] = useState<Adjunto[]>([]);
	const [error, setError] = useState<string | null>(null);
	const [enviando, setEnviando] = useState(false);
	const [sucio, setSucio] = useState(false);
	const [vista, setVista] = useState<Vista>("normal");
	const [mostrarFormato, setMostrarFormato] = useState(true);
	const [menuEnvio, setMenuEnvio] = useState(false);
	const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
	const dragRef = useRef<{ dx: number; dy: number } | null>(null);
	const ventanaRef = useRef<HTMLDivElement | null>(null);

	const editor = useEditor({
		extensions: [
			StarterKit,
			Placeholder.configure({
				placeholder: "Escribe el mensaje aquí…",
			}),
		],
		content: "",
		immediatelyRender: false,
		onUpdate: () => setSucio(true),
	});

	const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
		noClick: true,
		noKeyboard: true,
		accept: {
			"application/pdf": [".pdf"],
			"image/png": [".png"],
			"image/jpeg": [".jpg", ".jpeg"],
			"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
				".xlsx",
			],
		},
		maxSize: 5 * 1024 * 1024, // 5 MB
		onDrop: async (acceptedFiles) => {
			setError(null);
			if (adjuntos.length + acceptedFiles.length > 5) {
				setError("Máximo 5 adjuntos por mensaje");
				return;
			}
			for (const file of acceptedFiles) {
				try {
					const key = await subirAdjuntoR2(file);
					setAdjuntos((a) => [
						...a,
						{ key, nombre: file.name, tamano: file.size, tipo: file.type },
					]);
					setSucio(true);
				} catch (err: unknown) {
					const message =
						err instanceof Error ? err.message : "Error desconocido";
					setError(`No se pudo subir ${file.name}: ${message}`);
				}
			}
		},
		onDropRejected: () => {
			setError("Archivo inválido o excede 5 MB (PDF, PNG, JPG, XLSX)");
		},
	});

	useEffect(() => {
		function onKey(e: KeyboardEvent) {
			if (e.key === "Escape") cerrar();
		}
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	});

	useEffect(() => {
		function onMove(e: PointerEvent) {
			if (!dragRef.current) return;
			setPos({ x: e.clientX - dragRef.current.dx, y: e.clientY - dragRef.current.dy });
		}
		function onUp() {
			dragRef.current = null;
		}
		window.addEventListener("pointermove", onMove);
		window.addEventListener("pointerup", onUp);
		return () => {
			window.removeEventListener("pointermove", onMove);
			window.removeEventListener("pointerup", onUp);
		};
	}, []);

	function cerrar() {
		if (sucio && !window.confirm("Descartar el mensaje sin enviar?")) return;
		onClose();
	}

	function iniciarDrag(e: React.PointerEvent) {
		if (vista === "maximizado") return;
		const rect = ventanaRef.current?.getBoundingClientRect();
		if (!rect) return;
		dragRef.current = { dx: e.clientX - rect.left, dy: e.clientY - rect.top };
		setPos({ x: rect.left, y: rect.top });
	}

	async function handleSubmit(e?: React.FormEvent) {
		e?.preventDefault();
		setEnviando(true);
		setError(null);
		setMenuEnvio(false);
		const cuerpo = editor?.getText() ?? "";

		if (!para.trim() || !asunto.trim() || !cuerpo.trim()) {
			setError("Para, asunto y cuerpo son requeridos");
			setEnviando(false);
			return;
		}

		try {
			const res = await fetch("/api/correo/enviar", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					para,
					asunto,
					cuerpo,
					adjuntos: adjuntos.map((a) => a.key),
				}),
			});

			const data = await res.json();
			if (!res.ok) {
				setError(data.error || "Error al enviar");
				setEnviando(false);
				return;
			}
			onSent();
		} catch {
			setError("Error de red al enviar correo");
			setEnviando(false);
		}
	}

	const botonesFormato: Array<{
		id: string;
		label: string;
		icono: LucideIcon;
		activo: () => boolean;
		accion: () => void;
	}> = [
		{
			id: "bold",
			label: "Negrita",
			icono: Bold,
			activo: () => editor?.isActive("bold") ?? false,
			accion: () => editor?.chain().focus().toggleBold().run(),
		},
		{
			id: "italic",
			label: "Cursiva",
			icono: Italic,
			activo: () => editor?.isActive("italic") ?? false,
			accion: () => editor?.chain().focus().toggleItalic().run(),
		},
		{
			id: "underline",
			label: "Subrayado",
			icono: Underline,
			activo: () => editor?.isActive("underline") ?? false,
			accion: () => editor?.chain().focus().toggleUnderline().run(),
		},
		{
			id: "strike",
			label: "Tachado",
			icono: Strikethrough,
			activo: () => editor?.isActive("strike") ?? false,
			accion: () => editor?.chain().focus().toggleStrike().run(),
		},
		{
			id: "bulletList",
			label: "Lista de viñetas",
			icono: List,
			activo: () => editor?.isActive("bulletList") ?? false,
			accion: () => editor?.chain().focus().toggleBulletList().run(),
		},
		{
			id: "orderedList",
			label: "Lista numerada",
			icono: ListOrdered,
			activo: () => editor?.isActive("orderedList") ?? false,
			accion: () => editor?.chain().focus().toggleOrderedList().run(),
		},
		{
			id: "blockquote",
			label: "Cita",
			icono: TextQuote,
			activo: () => editor?.isActive("blockquote") ?? false,
			accion: () => editor?.chain().focus().toggleBlockquote().run(),
		},
		{
			id: "link",
			label: "Enlace",
			icono: Link2,
			activo: () => editor?.isActive("link") ?? false,
			accion: () => {
				const url = window.prompt("URL del enlace");
				if (url) editor?.chain().focus().setLink({ href: url }).run();
			},
		},
		{
			id: "clean",
			label: "Limpiar formato",
			icono: Eraser,
			activo: () => false,
			accion: () => editor?.chain().focus().clearNodes().unsetAllMarks().run(),
		},
	];

	if (vista === "minimizado") {
		return (
			<div className="fixed bottom-4 right-4 z-50">
				<button
					type="button"
					onClick={() => setVista("normal")}
					className="flex min-h-12 items-center gap-2 rounded-lg bg-zinc-900 px-4 py-3 text-sm font-medium text-white shadow-xl hover:bg-zinc-700"
				>
					<PenLine className="size-icon-md" aria-hidden="true" />
					{replyTo ? "Responder mensaje" : "Nuevo mensaje"}
				</button>
			</div>
		);
	}

	return (
		<div
			className="fixed inset-0 z-50 bg-black/40"
			role="presentation"
			onClick={(e) => {
				if (e.target === e.currentTarget) cerrar();
			}}
		>
			<div
				ref={ventanaRef}
				{...getRootProps()}
				style={
					pos && vista === "normal"
						? { left: pos.x, top: pos.y, position: "fixed" }
						: undefined
				}
				className={`flex flex-col overflow-hidden bg-white shadow-2xl ${
					pos && vista === "normal"
						? "w-full max-w-2xl rounded-xl"
						: vista === "maximizado"
							? "fixed inset-2 rounded-xl sm:inset-6"
							: "fixed inset-x-0 bottom-0 max-h-[92dvh] w-full rounded-t-xl sm:inset-x-auto sm:bottom-4 sm:right-4 sm:max-h-[85dvh] sm:w-full sm:max-w-2xl sm:rounded-xl"
				} ${isDragActive ? "ring-2 ring-emerald-500" : ""}`}
			>
				<input {...getInputProps()} />

				{/* 1. Barra superior de título */}
				<div
					onPointerDown={iniciarDrag}
					className="flex items-center gap-2 bg-zinc-900 px-3 py-2 text-white select-none"
				>
					<span
						className="cursor-grab px-1 text-zinc-400"
						aria-hidden="true"
						title="Arrastrar ventana"
					>
						<GripVertical className="size-icon-md" />
					</span>
					<h2 className="flex-1 truncate text-sm font-medium">
						{replyTo ? "Responder mensaje" : "Nuevo mensaje"}
					</h2>
					<button
						type="button"
						onClick={() => setVista("normal")}
						aria-label="Minimizar"
						title="Minimizar"
						className="flex h-12 w-12 items-center justify-center rounded-lg text-zinc-300 hover:bg-zinc-700 hover:text-white"
					>
						<Minus className="size-icon-lg" aria-hidden="true" />
					</button>
					<button
						type="button"
						onClick={() =>
							setVista(vista === "maximizado" ? "normal" : "maximizado")
						}
						aria-label={vista === "maximizado" ? "Restaurar" : "Maximizar"}
						title={vista === "maximizado" ? "Restaurar" : "Maximizar"}
						className="flex h-12 w-12 items-center justify-center rounded-lg text-zinc-300 hover:bg-zinc-700 hover:text-white"
					>
						{vista === "maximizado" ? (
							<Minimize2 className="size-icon-lg" aria-hidden="true" />
						) : (
							<Maximize2 className="size-icon-lg" aria-hidden="true" />
						)}
					</button>
					<button
						type="button"
						onClick={cerrar}
						aria-label="Cerrar"
						title="Cerrar"
						className="flex h-12 w-12 items-center justify-center rounded-lg text-zinc-300 hover:bg-zinc-700 hover:text-white"
					>
						<X className="size-icon-lg" aria-hidden="true" />
					</button>
				</div>

				<form
					onSubmit={handleSubmit}
					className="flex min-h-0 flex-1 flex-col"
				>
					{/* 2. Formulario de cabecera (campos seamless) */}
					<div className="border-b border-zinc-100">
						<div className="flex items-center gap-2 border-b border-zinc-100 px-4 py-2 text-sm">
							<span className="w-16 shrink-0 text-zinc-500">Desde</span>
							<span className="truncate text-zinc-900">{BUZON}</span>
						</div>
						<div className="flex items-center gap-2 border-b border-zinc-100 px-4 py-1">
							<label htmlFor="composer-para" className="w-16 shrink-0 text-sm text-zinc-500">
								Para
							</label>
							<input
								id="composer-para"
								type="email"
								value={para}
								onChange={(e) => {
									setPara(e.target.value);
									setSucio(true);
								}}
								required
								placeholder="aliado@dominio.com"
								className="min-h-12 flex-1 bg-transparent text-sm text-zinc-900 outline-none placeholder:text-zinc-400"
							/>
						</div>
						<div className="flex items-center gap-2 px-4 py-1">
							<label htmlFor="composer-asunto" className="w-16 shrink-0 text-sm text-zinc-500">
								Asunto
							</label>
							<input
								id="composer-asunto"
								type="text"
								value={asunto}
								onChange={(e) => {
									setAsunto(e.target.value);
									setSucio(true);
								}}
								required
								placeholder="Asunto de la comunicación"
								className="min-h-12 flex-1 bg-transparent text-sm font-medium text-zinc-900 outline-none placeholder:font-normal placeholder:text-zinc-400"
							/>
						</div>
					</div>

					{/* 3. Área de redacción */}
					<div
						className="mail-editor min-h-0 flex-1 overflow-y-auto px-4 py-3"
						onClick={() => editor?.commands.focus()}
						role="presentation"
					>
						<EditorContent editor={editor} className="text-sm" />
					</div>

					{adjuntos.length > 0 && (
						<div className="space-y-1 border-t border-zinc-100 px-4 py-2">
							{adjuntos.map((a) => (
								<div
									key={a.key}
									className="flex items-center justify-between gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs text-zinc-800"
								>
									<span className="flex min-w-0 items-center gap-1.5">
										<FileText
											className="size-icon-sm shrink-0 text-zinc-500"
											aria-hidden="true"
										/>
										<span className="truncate">
											{a.nombre} ({(a.tamano / 1024).toFixed(0)} KB)
										</span>
									</span>
									<button
										type="button"
										onClick={() =>
											setAdjuntos((curr) =>
												curr.filter((x) => x.key !== a.key),
											)
										}
										aria-label={`Quitar adjunto ${a.nombre}`}
										className="shrink-0 text-red-500 hover:text-red-700"
									>
										<X className="size-icon-sm" aria-hidden="true" />
									</button>
								</div>
							))}
						</div>
					)}

					{isDragActive && (
						<p className="border-t border-emerald-200 bg-emerald-50 px-4 py-2 text-center text-xs text-emerald-700">
							Suelta los archivos para adjuntarlos
						</p>
					)}

					{error && (
						<p className="px-4 pt-2 text-sm text-red-600" role="alert">
							{error}
						</p>
					)}

					{/* Barra de formato (rich text) */}
					{mostrarFormato && (
						<div className="mx-4 mt-2 flex flex-wrap items-center gap-1 rounded-full border border-zinc-200 bg-zinc-50 px-2 py-1">
						{botonesFormato.map((b) => {
							const Icono = b.icono;
							return (
								<button
									key={b.id}
									type="button"
									onClick={b.accion}
									aria-label={b.label}
									aria-pressed={b.activo()}
									title={b.label}
									className={`flex h-12 min-w-12 items-center justify-center rounded-full px-2 ${
										b.activo()
											? "bg-zinc-900 text-white"
											: "text-zinc-600 hover:bg-zinc-200"
									}`}
								>
									<Icono className="size-icon-md" aria-hidden="true" />
								</button>
							);
						})}
						</div>
					)}

					{/* 4. Barra de acciones (pie) */}
					<div className="flex items-center gap-1 px-3 py-2">
						<button
							type="button"
							onClick={cerrar}
							aria-label="Descartar borrador"
							title="Descartar borrador"
							className="flex h-12 w-12 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800"
						>
							<Trash2 className="size-icon-lg" aria-hidden="true" />
						</button>
						<button
							type="button"
							onClick={() => open()}
							aria-label="Adjuntar archivos"
							title="Adjuntar archivos (PDF, PNG, JPG, XLSX — máx 5 MB)"
							className="flex h-12 w-12 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800"
						>
							<Paperclip className="size-icon-lg" aria-hidden="true" />
						</button>
						<button
							type="button"
							onClick={() => setMostrarFormato((v) => !v)}
							aria-label={mostrarFormato ? "Ocultar formato" : "Mostrar formato"}
							aria-pressed={mostrarFormato}
							title="Barra de formato"
							className={`flex h-12 w-12 items-center justify-center rounded-lg ${
								mostrarFormato
									? "bg-zinc-100 text-zinc-900"
									: "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800"
							}`}
						>
							<Type className="size-icon-lg" aria-hidden="true" />
						</button>

						<span className="ml-auto mr-2 text-xs text-zinc-400">
							{sucio ? "Sin guardar" : ""}
						</span>

						<div className="relative flex">
							<button
								type="submit"
								disabled={enviando}
								className="flex min-h-12 items-center rounded-l-lg bg-emerald-600 px-5 text-sm font-medium text-white transition-colors hover:bg-emerald-500 disabled:opacity-50"
							>
								{enviando ? "Enviando…" : "Enviar"}
							</button>
							<button
								type="button"
								onClick={() => setMenuEnvio((v) => !v)}
								aria-label="Más opciones de envío"
								aria-expanded={menuEnvio}
								className="flex min-h-12 items-center rounded-r-lg border-l border-emerald-500 bg-emerald-600 px-2 text-white transition-colors hover:bg-emerald-500"
							>
								<ChevronDown className="size-icon-md" aria-hidden="true" />
							</button>
							{menuEnvio && (
								<div className="absolute bottom-full right-0 mb-2 w-56 rounded-lg border border-zinc-200 bg-white py-1 shadow-xl">
									<button
										type="button"
										onClick={() => handleSubmit()}
										className="block w-full px-4 py-2 text-left text-sm text-zinc-800 hover:bg-zinc-50"
									>
										Enviar ahora
									</button>
									<button
										type="button"
										disabled
										title="Próximamente"
										className="block w-full cursor-not-allowed px-4 py-2 text-left text-sm text-zinc-400"
									>
										Programar envío
									</button>
								</div>
							)}
						</div>
					</div>
				</form>
			</div>
		</div>
	);
}
