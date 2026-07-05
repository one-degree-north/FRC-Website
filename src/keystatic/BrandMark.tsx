/** Sidebar brand in /keystatic — links back to the public site home page. */
export function BrandMark(_props: { colorScheme: 'light' | 'dark' }) {
	return (
		<a
			href="/"
			aria-label="Back to site home"
			style={{
				display: 'flex',
				alignItems: 'center',
				gap: '0.625rem',
				color: 'inherit',
				textDecoration: 'none',
				minWidth: 0,
				flex: 1,
			}}
		>
			<svg
				width={24}
				height={24}
				viewBox="0 0 32 32"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
				aria-hidden
			>
				<path d="M18 8L14 24L12 32L30 14L18 8Z" fill="currentColor" />
				<path d="M2 18L20 0L18 8L2 18Z" fill="currentColor" />
				<path
					d="M18 8L2 18L14 24L18 8Z"
					fill="url(#odn-brand-mark-gradient)"
				/>
				<defs>
					<linearGradient
						id="odn-brand-mark-gradient"
						x1="2"
						y1="18"
						x2="20"
						y2="14"
						gradientUnits="userSpaceOnUse"
					>
						<stop stopColor="currentColor" stopOpacity="0.2" />
						<stop offset="1" stopColor="currentColor" stopOpacity="0.5" />
					</linearGradient>
				</defs>
			</svg>
			<span
				style={{
					fontWeight: 500,
					overflow: 'hidden',
					textOverflow: 'ellipsis',
					whiteSpace: 'nowrap',
				}}
			>
				One Degree North
			</span>
		</a>
	);
}
