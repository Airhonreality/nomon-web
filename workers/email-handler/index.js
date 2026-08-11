// Cloudflare Email Worker: rednomon-email-handler
//
// Recibe cada correo entrante de Cloudflare Email Routing (por ej. contacto@rednomon.com),
// parsea el MIME, sube adjuntos a R2, y reenvía el JSON estructurado al webhook de la app en Vercel.
//
// Deploy manual en Cloudflare — ver README.md de esta carpeta.
// [SOLO_HUMANO] Las variables WEBHOOK_SECRET, WEBHOOK_URL y R2_PUBLIC_URL se configuran en
// el dashboard de Cloudflare (o vía `wrangler secret bulk`), nunca aquí.

import postalMime from "postal-mime";

export default {
	async email(message, env, ctx) {
		console.log(`[entrada] from=${message.from} to=${message.to}`);

		// --- Validación de entorno ---
		const webhookUrl = (env.WEBHOOK_URL || "").trim();
		const webhookSecret = (env.WEBHOOK_SECRET || "").trim();
		const baseUrl = (env.R2_PUBLIC_URL || "").trim().replace(/\/+$/, "");

		console.log(`[config] WEBHOOK_URL presente: ${webhookUrl.length > 0 ? "sí" : "NO"}`);
		console.log(`[config] WEBHOOK_SECRET presente: ${webhookSecret.length > 0 ? "sí" : "NO"}`);
		console.log(`[config] R2_PUBLIC_URL presente: ${baseUrl.length > 0 ? "sí" : "no"}`);

		if (!webhookUrl) {
			console.error("[config] WEBHOOK_URL falta o está vacía — abortando");
			return;
		}
		if (!webhookSecret) {
			console.error("[config] WEBHOOK_SECRET falta o está vacío — abortando");
			return;
		}

		let urlObj;
		try {
			urlObj = new URL(webhookUrl);
		} catch (err) {
			console.error(`[config] WEBHOOK_URL no es una URL válida: "${webhookUrl}" — ${err.message}`);
			return;
		}

		// --- 1. Parsear el correo crudo (MIME) a JSON estructurado ---
		let parsed;
		try {
			const parser = new postalMime();
			parsed = await parser.parse(message.raw);
		} catch (err) {
			console.error(`[parse] fallo postal-mime: ${err.name}: ${err.message}`);
			return;
		}

		// --- 2. Subir adjuntos a R2 si existen ---
		const attachments = [];
		if (parsed.attachments && parsed.attachments.length > 0) {
			console.log(`[adjunto] ${parsed.attachments.length} adjunto(s) detectados`);
			for (const att of parsed.attachments) {
				try {
					const fileName = `${Date.now()}-${att.filename || "adjunto"}`;
					await env.EMAIL_BUCKET.put(fileName, att.content, {
						httpMetadata: { contentType: att.mimeType },
					});
					attachments.push({
						filename: att.filename,
						mimeType: att.mimeType,
						url: baseUrl ? `${baseUrl}/${fileName}` : fileName,
					});
					console.log(`[adjunto] subido: ${fileName}`);
				} catch (err) {
					console.error(`[adjunto] fallo al subir "${att.filename}": ${err.name}: ${err.message}`);
				}
			}
		} else {
			console.log("[adjunto] sin adjuntos");
		}

		// --- 3. Construir el payload ---
		const payload = {
			messageId: message.headers.get("message-id") || null,
			from: message.from,
			to: message.to,
			subject: parsed.subject || "(Sin asunto)",
			bodyText: parsed.text || "",
			bodyHtml: parsed.html || "",
			direction: "INBOUND",
			attachments,
		};

		// --- 4. Enviar el objeto a la API protegida en Vercel ---
		console.log(`[webhook] POST ${urlObj.origin}${urlObj.pathname}`);
		try {
			const resp = await fetch(urlObj.toString(), {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${webhookSecret}`,
				},
				body: JSON.stringify(payload),
			});
			const respBody = await resp.text().catch(() => "");
			console.log(`[webhook] respuesta ${resp.status}: ${respBody.slice(0, 300)}`);
		} catch (err) {
			console.error(`[webhook] fallo en fetch: ${err.name}: ${err.message}`);
		}
	},
};