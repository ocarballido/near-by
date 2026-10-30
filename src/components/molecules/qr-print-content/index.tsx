import type { Ref } from 'react';
import { useTranslations } from 'next-intl';
import { QRCodeSVG } from 'qrcode.react';

type QrPrintContentProps = {
	url: string;
	ref?: Ref<HTMLDivElement>;
};

// Contenido que imprime usePrintQr; oculto en pantalla
const QrPrintContent = ({ url, ref }: QrPrintContentProps) => {
	const t = useTranslations();

	return (
		<div ref={ref} style={{ display: 'none' }}>
			<QRCodeSVG value={url} size={200} />
			<h1>{t('¡Te damos la bienvenida con los brazos abiertos!')}</h1>
			<p>
				{t(
					'Nos alegra que hayas elegido nuestro alojamiento para tu estancia'
				)}
			</p>
			<p>
				{t(
					'Nuestro espacio está preparado para que descanses, te relajes y vivas una experiencia cómoda y sin complicaciones'
				)}
			</p>
		</div>
	);
};

export default QrPrintContent;
