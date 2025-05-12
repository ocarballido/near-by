import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
	output: 'standalone',
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'wwclrrykkvsbpzlpavls.supabase.co',
				port: '',
				pathname: '/**',
			},
		],
	},
	async redirects() {
		return [
			{
				source: '/auth/login',
				destination: '/auth/magic-link',
				permanent: true,
			},
			{
				source: '/auth/register',
				destination: '/auth/magic-link',
				permanent: true,
			},
		];
	},
};

export default withNextIntl(nextConfig);
