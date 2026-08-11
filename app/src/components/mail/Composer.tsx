"use client";

import { subirAdjuntoR2 } from "@/lib/r2-client";
import Link from "@tiptap/extension-link";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useState } from "react";
import { useDropzone } from "react-dropzone";

type Adjunto = { key: string; nombre: string; tamano: number; tipo: string };

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

	const editor = useEditor({
		extensions: [StarterKit, Link.configure({ openOnClick: false })],
		content: "",
		immediatelyRender: false,
	});

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
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

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		setEnviando(true);
		setError(null);
		const cuerpo = editor?.getText() ?? "";

		if (!para.trim() || !asunto.trim() || !cuerpo.trim()) {
			setError("Todos los campos son requeridos");
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

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
			<form
				onSubmit={handleSubmit}
				className="flex w-full max-w-2xl flex-col gap-4 rounded-xl bg-white p-6 shadow-xl"
			>
				<div className="flex items-center justify-between border-b pb-3">
					<h2 className="text-lg font-semibold text-zinc-900">
						{replyTo ? "Responder mensaje" : "Nuevo mensaje"}
					</h2>
					<button
						type="button"
						onClick={onClose}
						className="text-zinc-400 hover:text-zinc-700"
					>
						✕
					</button>
				</div>

				<label className="flex flex-col gap-1 text-sm text-zinc-600">
					Para
					<input
						type="email"
						value={para}
						onChange={(e) => setPara(e.target.value)}
						required
						placeholder="aliado@dominio.com"
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
						placeholder="Asunto de la comunicación"
						className="rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 outline-none focus:border-zinc-500"
					/>
				</label>

				<div className="flex flex-col gap-1 text-sm text-zinc-600">
					<span>Cuerpo (Markdown soportado)</span>
					<div className="min-h-[160px] rounded-lg border border-zinc-300 p-3 focus-within:border-zinc-500 bg-white">
						<EditorContent
							editor={editor}
							className="prose prose-sm max-w-none focus:outline-none min-h-[140px]"
						/>
					</div>
				</div>

				<div
					{...getRootProps()}
					className={`cursor-pointer rounded-lg border-2 border-dashed p-4 text-center text-sm transition-colors ${
						isDragActive
							? "border-emerald-500 bg-emerald-50 text-emerald-700"
							: "border-zinc-300 bg-zinc-50 text-zinc-600 hover:bg-zinc-100"
					}`}
				>
					<input {...getInputProps()} />
					{adjuntos.length === 0 ? (
						<p>
							📎 Arrastra archivos aquí o haz click para adjuntar (máx 5 MB)
						</p>
					) : (
						<div className="space-y-2 text-left">
							<p className="font-medium text-xs text-zinc-500">
								Adjuntos ({adjuntos.length}/5):
							</p>
							{adjuntos.map((a) => (
								<div
									key={a.key}
									className="flex items-center justify-between rounded bg-white p-2 border border-zinc-200 text-xs text-zinc-800"
								>
									<span className="truncate">
										📄 {a.nombre} ({(a.tamano / 1024).toFixed(0)} KB)
									</span>
									<button
										type="button"
										onClick={(e) => {
											e.stopPropagation();
											setAdjuntos((curr) =>
												curr.filter((x) => x.key !== a.key),
											);
										}}
										className="text-red-500 hover:text-red-700 font-bold px-1"
									>
										✕
									</button>
								</div>
							))}
						</div>
					)}
				</div>

				{error && <p className="text-sm text-red-600">{error}</p>}

				<div className="flex justify-end gap-2 pt-2 border-t">
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
						{enviando ? "Enviando…" : "Enviar correo"}
					</button>
				</div>
			</form>
		</div>
	);
}
