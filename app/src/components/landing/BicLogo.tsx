interface BicLogoProps {
	className?: string;
}

// Logo oficial "Sociedad BIC" (Beneficio e Interés Compartido) — SVG de marca
// reconstruido del LandingPage.jsx original (viewBox 0 0 240 85).
// Molinete de 5 aspas + tipografía de la marca.
export function BicLogo({ className }: BicLogoProps) {
	return (
		<svg
			viewBox="0 0 240 85"
			className={className ?? "h-auto w-56"}
			role="img"
			aria-label="Sociedad BIC — Empresa con propósito"
		>
			<defs>
				<linearGradient id="bic-orange" x1="0" y1="0" x2="1" y2="1">
					<stop offset="0%" stopColor="#f37024" />
					<stop offset="100%" stopColor="#e15c10" />
				</linearGradient>
				<linearGradient id="bic-yellow" x1="0" y1="0" x2="1" y2="1">
					<stop offset="0%" stopColor="#ffcc00" />
					<stop offset="100%" stopColor="#f5b800" />
				</linearGradient>
				<linearGradient id="bic-blue" x1="0" y1="0" x2="1" y2="1">
					<stop offset="0%" stopColor="#009fe3" />
					<stop offset="100%" stopColor="#0083cc" />
				</linearGradient>
				<linearGradient id="bic-purple" x1="0" y1="0" x2="1" y2="1">
					<stop offset="0%" stopColor="#96157f" />
					<stop offset="100%" stopColor="#7a0965" />
				</linearGradient>
				<linearGradient id="bic-green" x1="0" y1="0" x2="1" y2="1">
					<stop offset="0%" stopColor="#3da849" />
					<stop offset="100%" stopColor="#2c8d37" />
				</linearGradient>
			</defs>

			<g transform="translate(38, 42)">
				<path d="M 0,0 C -6,-15 -21,-12 -23,3 C -24.5,15 -12,23 0,11 C -4,7 -5,1 -2.5,-3 C -0.8,-6 0.2,-4 0,0" fill="url(#bic-orange)" />
				<g transform="rotate(72)">
					<path d="M 0,0 C -6,-15 -21,-12 -23,3 C -24.5,15 -12,23 0,11 C -4,7 -5,1 -2.5,-3 C -0.8,-6 0.2,-4 0,0" fill="url(#bic-yellow)" />
				</g>
				<g transform="rotate(144)">
					<path d="M 0,0 C -6,-15 -21,-12 -23,3 C -24.5,15 -12,23 0,11 C -4,7 -5,1 -2.5,-3 C -0.8,-6 0.2,-4 0,0" fill="url(#bic-blue)" />
				</g>
				<g transform="rotate(216)">
					<path d="M 0,0 C -6,-15 -21,-12 -23,3 C -24.5,15 -12,23 0,11 C -4,7 -5,1 -2.5,-3 C -0.8,-6 0.2,-4 0,0" fill="url(#bic-purple)" />
				</g>
				<g transform="rotate(288)">
					<path d="M 0,0 C -6,-15 -21,-12 -23,3 C -24.5,15 -12,23 0,11 C -4,7 -5,1 -2.5,-3 C -0.8,-6 0.2,-4 0,0" fill="url(#bic-green)" />
				</g>
				<circle cx="0" cy="0" r="3.5" fill="#ffffff" />
			</g>

			<text x="82" y="27" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif" fontSize="11" fontWeight="300" fill="#5a5b5e" letterSpacing="0.32em">SOCIEDAD</text>
			<text x="80" y="61" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif" fontSize="38" fontWeight="800" fill="#002d62" letterSpacing="-0.02em">BIC</text>
			<text x="82" y="75" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif" fontSize="9.5" fontWeight="400" fill="#5a5b5e" letterSpacing="0.04em">Empresa con propósito</text>
		</svg>
	);
}