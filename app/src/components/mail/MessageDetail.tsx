"use client";

import { nombreDesdeKey } from "@/lib/mail-display";
import { FileText, Reply } from "lucide-react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import remarkGfm from "remark-gfm";

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

const sanitizeSchema = {
	...defaultSchema,
	tagNames: [
		"p",
		"br",
		"hr",
		"a",
		"strong",
		"em",
		"code",
		"pre",
		"ul",
		"ol",
		"li",
		"blockquote",
		"h1",
		"h2",
		"h3",
		"h4",
		"img",
		"table",
		"thead",
		"tbody",
		"tr",
		"th",
		"td",
	],
	attributes: {
		...defaultSchema.attributes,
		a: [["href"], ["title"], ["target"], ["rel"]],
		img: [["src"], ["alt"], ["title"]],
		code: [["className"]],
	},
	protocols: {
		...defaultSchema.protocols,
		href: ["http", "https", "mailto"],
		src: ["http", "https"],
	},
};

export function MessageDetail({
	mensaje,
	onReply,
}: {
	mensaje: Mensaje;
	onReply: () => void;
}) {
	const publicDomain =
		process.env.NEXT_PUBLIC_R2_PUBLIC_DOMAIN || "assets.rednomon.com";

	return (
		<article className="flex flex-col gap-6 p-6 bg-white rounded-xl border border-zinc-200 shadow-sm">
			<header className="flex flex-col gap-3 border-b border-zinc-100 pb-4">
				<div className="flex items-start justify-between gap-4">
					<h2 className="text-xl font-semibold text-zinc-900">
						{mensaje.asunto}
					</h2>
					<button
						type="button"
						onClick={onReply}
						className="flex items-center gap-2 rounded-lg bg-zinc-900 px-4 py-2 text-sm text-white hover:bg-zinc-700 transition-colors"
					>
						<Reply className="size-icon-md" aria-hidden="true" />
						Responder
					</button>
				</div>
				<div className="text-sm text-zinc-600 flex flex-col gap-1">
					<p>
						<span className="font-medium text-zinc-700">De:</span> {mensaje.de}
					</p>
					<p>
						<span className="font-medium text-zinc-700">Para:</span>{" "}
						{mensaje.para}
					</p>
					<p className="text-xs text-zinc-400">
						{new Date(mensaje.createdAt).toLocaleString()}
					</p>
				</div>
			</header>

			<div className="prose prose-zinc max-w-none text-zinc-800 text-sm leading-relaxed">
				<ReactMarkdown
					remarkPlugins={[remarkGfm]}
					rehypePlugins={[[rehypeSanitize, sanitizeSchema], rehypeHighlight]}
				>
					{mensaje.cuerpo}
				</ReactMarkdown>
			</div>

			{mensaje.adjuntos && mensaje.adjuntos.length > 0 && (
				<section className="border-t border-zinc-100 pt-4 mt-2">
					<h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-3">
						Adjuntos ({mensaje.adjuntos.length})
					</h3>
					<ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
						{mensaje.adjuntos.map((key) => {
							const filename = nombreDesdeKey(key);
							const fileUrl = `https://${publicDomain}/${key}`;
							return (
								<li key={key}>
									<a
										href={fileUrl}
										target="_blank"
										rel="noopener noreferrer"
										className="flex items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 p-3 text-xs text-zinc-800 hover:bg-zinc-100 transition-colors"
									>
										<FileText
											className="size-icon-lg shrink-0 text-zinc-500"
											aria-hidden="true"
										/>
										<span className="truncate font-medium">{filename}</span>
										<span className="ml-auto text-emerald-600 underline">
											Descargar
										</span>
									</a>
								</li>
							);
						})}
					</ul>
				</section>
			)}
		</article>
	);
}
