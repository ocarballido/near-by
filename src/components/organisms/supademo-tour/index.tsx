import React from 'react';

const SUPADEMO_SRC =
	'https://app.supademo.com/showcase/embed/cmm52w6xp000gyk0ipaibjzah?embed_v=2&utm_source=embed';

export default function SupademoShowcaseEmbed() {
	return (
		<div className="relative w-full aspect-[16/9] max-h-[80vh]">
			<iframe
				data-version="2"
				src={SUPADEMO_SRC}
				loading="lazy"
				title="BNB - Full Product Tour"
				allow="clipboard-write; fullscreen"
				allowFullScreen
				className="absolute inset-0 h-full w-full border-0 rounded-xl"
			/>
		</div>
	);
}
