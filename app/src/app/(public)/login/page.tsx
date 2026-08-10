"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";

function LoginForm() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);
	const router = useRouter();
	const searchParams = useSearchParams();
	const from = searchParams.get("from") || "/";

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setLoading(true);
		setError(null);

		try {
			const res = await fetch("/api/auth/login", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email, password }),
			});

			const data = await res.json();

			if (!res.ok) {
				setError(data.error || "No se pudo iniciar sesión");
				setLoading(false);
				return;
			}

			router.push(from);
			router.refresh();
		} catch {
			setError("Error de conexión");
			setLoading(false);
		}
	}

	return (
		<form
			onSubmit={handleSubmit}
			className="flex w-full max-w-sm flex-col gap-4 rounded-xl border border-zinc-200 bg-white p-8 shadow-sm"
		>
			<h1 className="text-2xl font-semibold text-zinc-900">Ingresar</h1>

			<label className="flex flex-col gap-1 text-sm text-zinc-600">
				Email
				<input
					type="email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					required
					className="rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 outline-none focus:border-zinc-500"
				/>
			</label>

			<label className="flex flex-col gap-1 text-sm text-zinc-600">
				Contraseña
				<input
					type="password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					required
					className="rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 outline-none focus:border-zinc-500"
				/>
			</label>

			{error && <p className="text-sm text-red-600">{error}</p>}

			<button
				type="submit"
				disabled={loading}
				className="rounded-lg bg-zinc-900 px-4 py-2 text-white transition-colors hover:bg-zinc-700 disabled:opacity-50"
			>
				{loading ? "Ingresando…" : "Ingresar"}
			</button>
		</form>
	);
}

export default function LoginPage() {
	return (
		<div className="flex flex-1 items-center justify-center bg-zinc-50 font-sans">
			<Suspense fallback={<div className="text-zinc-500">Cargando...</div>}>
				<LoginForm />
			</Suspense>
		</div>
	);
}
