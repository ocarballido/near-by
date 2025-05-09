import type { Config } from 'tailwindcss';

const config: Config = {
	content: [
		'./src/pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/components/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/app/**/*.{js,ts,jsx,tsx,mdx}',
	],
	theme: {
		extend: {
			/* give us a .perspective-500 utility */
			perspective: { '500': '500px' },

			/* keyframes that keep the disc rotated flat */
			keyframes: {
				flatPing: {
					'0%': {
						transform: 'perspective(500px) rotateX(90deg) scale(1)',
						opacity: '1',
					},
					'75%': {
						transform: 'perspective(500px) rotateX(90deg) scale(2)',
						opacity: '0',
					},
					'100%': {
						transform: 'perspective(500px) rotateX(90deg) scale(2)',
						opacity: '0',
					},
				},
			},

			/* an .animate-flat-ping class just like built-in animate-ping */
			animation: {
				'flat-ping': 'flatPing 1s cubic-bezier(0,0,0.2,1) infinite',
			},
		},
		// extend: {
		// 	colors: {
		// 		primary: {
		// 			'50': 'var(--color-primary-50)',
		// 			'100': 'var(--color-primary-100)',
		// 			'200': 'var(--color-primary-200)',
		// 			'300': 'var(--color-primary-300)',
		// 			'400': 'var(--color-primary-400)',
		// 			'500': 'var(--color-primary-500)',
		// 			'600': 'var(--color-primary-600)',
		// 			'700': 'var(--color-primary-700)',
		// 			'800': 'var(--color-primary-800)',
		// 			'900': 'var(--color-primary-900)',
		// 			DEFAULT: 'hsl(var(--primary))',
		// 			foreground: 'hsl(var(--primary-foreground))',
		// 		},
		// 		secondary: {
		// 			'50': 'var(--color-secondary-50)',
		// 			'100': 'var(--color-secondary-100)',
		// 			'200': 'var(--color-secondary-200)',
		// 			'300': 'var(--color-secondary-300)',
		// 			'400': 'var(--color-secondary-400)',
		// 			'500': 'var(--color-secondary-500)',
		// 			'600': 'var(--color-secondary-600)',
		// 			'700': 'var(--color-secondary-700)',
		// 			'800': 'var(--color-secondary-800)',
		// 			'900': 'var(--color-secondary-900)',
		// 			DEFAULT: 'hsl(var(--secondary))',
		// 			foreground: 'hsl(var(--secondary-foreground))',
		// 		},
		// 		background: 'hsl(var(--background))',
		// 		foreground: 'hsl(var(--foreground))',
		// 		card: {
		// 			DEFAULT: 'hsl(var(--card))',
		// 			foreground: 'hsl(var(--card-foreground))',
		// 		},
		// 		popover: {
		// 			DEFAULT: 'hsl(var(--popover))',
		// 			foreground: 'hsl(var(--popover-foreground))',
		// 		},
		// 		muted: {
		// 			DEFAULT: 'hsl(var(--muted))',
		// 			foreground: 'hsl(var(--muted-foreground))',
		// 		},
		// 		accent: {
		// 			DEFAULT: 'hsl(var(--accent))',
		// 			foreground: 'hsl(var(--accent-foreground))',
		// 		},
		// 		destructive: {
		// 			DEFAULT: 'hsl(var(--destructive))',
		// 			foreground: 'hsl(var(--destructive-foreground))',
		// 		},
		// 		border: 'hsl(var(--border))',
		// 		input: 'hsl(var(--input))',
		// 		ring: 'hsl(var(--ring))',
		// 		chart: {
		// 			'1': 'hsl(var(--chart-1))',
		// 			'2': 'hsl(var(--chart-2))',
		// 			'3': 'hsl(var(--chart-3))',
		// 			'4': 'hsl(var(--chart-4))',
		// 			'5': 'hsl(var(--chart-5))',
		// 		},
		// 	},
		// 	borderRadius: {
		// 		lg: 'var(--radius)',
		// 		md: 'calc(var(--radius) - 2px)',
		// 		sm: 'calc(var(--radius) - 4px)',
		// 	},
		// },
	},
	// eslint-disable-next-line @typescript-eslint/no-require-imports
	plugins: [require('tailwindcss-animate')],
};

export default config;
