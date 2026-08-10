// Cloudflare Email Worker: rednomon-email-handler
//
// Recibe cada correo entrante de Red + Routing (por ej. contacto@rednomon.com),
// parsea el MIME, y reenvía el JSON estructurado al webhook de la app en Vercel.
//
// Deploy manual en Cloudflare — ver README.md de esta carpeta.
// [SOLO_HUMANO] La variable WEBHOOK_SECRET se configura en el dashboard de Cloudflare,
// nunca aquí.

import postalMime from "postal-mime";

export default {
	async email(message, env, ctx) {
		// 1. Parsear el correo crudo (MIME) a JSON estructurado
		const parser = new postalMime();
		const parsedEmail = await parser.parse(message.raw);

		const payload = {
			messageId: message.headers.get("message-id"),
			from: message.from,
			to: message.to,
			subject: parsedEmail.subject || "(Sin asunto)",
			bodyText: parsedEmail.text || "",
			bodyHtml: parsedEmail.html || "",
			direction: "INBOUND",
		};

		// 2. Enviar el objeto procesado a la API protegida en Vercel
		await fetch(env.WEBHOOK_URL, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${env.WEBHOOK_SECRET}`,
			},
			body: JSON.stringify(payload),
		});

		// Nota: no se espera la respuesta a propósito (fire-and-forget).
		// Si quisieras reintentos, usa ctx.waitUntil() con control de errores.
	},
};
