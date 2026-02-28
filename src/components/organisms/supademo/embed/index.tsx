'use client';

import { DEFAULT_EMBED_SRC } from '@/config/config-constants';

export type SupademoEmbedProps = {
	src?: string;
	title?: string;
	className?: string;
};

export default function SupademoEmbed({
	src = DEFAULT_EMBED_SRC,
	title = 'BNB - Full Product Tour',
	className = '',
}: SupademoEmbedProps) {
	return (
		<div
			className={`relative w-full aspect-[16/9] max-h-[80vh] ${className}`}
		>
			<iframe
				data-version="2"
				src={src}
				loading="lazy"
				title={title}
				allow="clipboard-write; fullscreen"
				allowFullScreen
				className="absolute inset-0 h-full w-full border-0 rounded-xl"
			/>
		</div>
	);
}
