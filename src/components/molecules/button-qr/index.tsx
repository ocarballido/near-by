'use client';

import ButtonIcon from '@/components/atoms/button-icon';
import IconQrCode from '@/components/atoms/icon/qr-code';
import QrPrintContent from '@/components/molecules/qr-print-content';
import { usePrintQr } from '@/hooks/usePrintQr';

const ButtonQr = ({
	url,
	color = 'white',
}: {
	url: string;
	color?: 'primary' | 'secondary' | 'error' | 'white';
}) => {
	const { qrRef, printQr } = usePrintQr();

	return (
		<div>
			{/* Contenido QR oculto */}
			<QrPrintContent ref={qrRef} url={url} />

			{/* Botón */}
			<ButtonIcon
				color={color}
				icon={<IconQrCode />}
				onClick={printQr}
				className="bg-primary-500"
			/>
		</div>
	);
};

export default ButtonQr;
