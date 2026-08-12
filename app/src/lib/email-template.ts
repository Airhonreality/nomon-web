// Plantilla HTML para correos salientes de NOMON Mail (logo + firma institucional).
// Estilos inline a propósito: los clientes de correo (Outlook, Gmail) ignoran <style>.

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://rednomon.com";
const LOGO_URL = `${SITE_URL}/email/nomon-logo.png`;

export function buildCorreoHtml({
	cuerpoHtml,
}: { cuerpoHtml: string }): string {
	return `<!doctype html>
<html lang="es">
<body style="margin:0;padding:0;background-color:#f4f4f5;font-family:Arial,Helvetica,sans-serif;">
	<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f5;padding:24px 0;">
		<tr>
			<td align="center">
				<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e4e4e7;">
					<tr>
						<td style="padding:28px 32px 20px 32px;border-bottom:1px solid #f4f4f5;">
							<img src="${LOGO_URL}" alt="NOMON" width="140" style="display:block;height:auto;border:0;" />
						</td>
					</tr>
					<tr>
						<td style="padding:28px 32px;color:#18181b;font-size:14px;line-height:1.6;">
							${cuerpoHtml}
						</td>
					</tr>
					<tr>
						<td style="padding:20px 32px 28px 32px;border-top:1px solid #f4f4f5;color:#71717a;font-size:12px;line-height:1.6;">
							<p style="margin:0 0 4px 0;font-weight:bold;color:#18181b;">NOMON</p>
							<p style="margin:0 0 4px 0;">Simposio Internacional de Ética</p>
							<p style="margin:0;"><a href="${SITE_URL}" style="color:#6cb367;text-decoration:none;">${SITE_URL.replace(/^https?:\/\//, "")}</a></p>
						</td>
					</tr>
				</table>
			</td>
		</tr>
	</table>
</body>
</html>`;
}
