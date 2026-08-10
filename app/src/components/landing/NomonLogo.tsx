interface NomonLogoProps {
	className?: string;
}

// Wordmark NOMON — SVG oficial reconstruido del LandingPage.jsx original
// (viewBox 0 -20 500 145, stroke currentColor)
export function NomonLogo({ className }: NomonLogoProps) {
	return (
		<svg
			viewBox="0 -20 500 145"
			className={className ?? "h-8 w-auto"}
			role="img"
			aria-label="NOMON"
		>
			<path
				d="M 20,110 L 20,30 L 80,110 L 80,30"
				stroke="currentColor"
				strokeWidth="11.5"
				strokeLinecap="round"
				strokeLinejoin="round"
				fill="none"
			/>
			<circle
				cx="145"
				cy="70"
				r="34.5"
				stroke="currentColor"
				strokeWidth="11.5"
				fill="none"
			/>
			<path
				d="M 210,110 L 210,30 L 250,110 L 290,30 L 290,110"
				stroke="currentColor"
				strokeWidth="11.5"
				strokeLinecap="round"
				strokeLinejoin="round"
				fill="none"
			/>
			<circle
				cx="355"
				cy="70"
				r="34.5"
				stroke="currentColor"
				strokeWidth="11.5"
				fill="none"
			/>
			<path
				d="M 420,110 L 420,30 L 480,110 L 480,30"
				stroke="currentColor"
				strokeWidth="11.5"
				strokeLinecap="round"
				strokeLinejoin="round"
				fill="none"
			/>
			<path
				d="M 356,36 C 358,32 357,27 356,22"
				stroke="#6cb367"
				strokeWidth="4.5"
				strokeLinecap="round"
				fill="none"
			/>
			<path
				d="M 355,22 C 343,15 345,0 377,-11 C 369,-4 362,6 355,22 Z"
				fill="#6cb367"
			/>
			<path
				d="M 357,22 C 364,8 371,-2 379,-9 C 381,3 373,16 357,22 Z"
				fill="#6cb367"
			/>
		</svg>
	);
}