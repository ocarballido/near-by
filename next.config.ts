import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
	output: 'standalone',
	images: {
		domains: [
			// add your Supabase storage hostname here:
			'wwclrrykkvsbpzlpavls.supabase.co',
		],
	},
};

export default withNextIntl(nextConfig);
