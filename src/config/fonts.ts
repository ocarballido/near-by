import { Roboto, Roboto_Mono, Outfit } from 'next/font/google';

export const ROBOTO = Roboto({
	weight: ['300', '400', '500', '700'],
	subsets: ['latin'],
	display: 'swap',
});
export const ROBOTO_MONO = Roboto_Mono({ subsets: ['latin'] });
export const OUTFIT = Outfit({ subsets: ['latin'] });
