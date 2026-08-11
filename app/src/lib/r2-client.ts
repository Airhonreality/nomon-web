export async function subirAdjuntoR2(file: File): Promise<string> {
	const meta = await fetch("/api/correo/upload", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			nombre: file.name,
			tipo: file.type,
			tamano: file.size,
		}),
	}).then(async (r) => {
		if (!r.ok) {
			const errData = await r.json().catch(() => ({}));
			throw new Error(errData.error || "No se pudo obtener URL de subida");
		}
		return r.json() as Promise<{ key: string; uploadUrl: string }>;
	});

	const put = await fetch(meta.uploadUrl, {
		method: "PUT",
		headers: { "Content-Type": file.type },
		body: file,
	});

	if (!put.ok) {
		throw new Error(`Upload falló (${put.status})`);
	}

	return meta.key;
}
