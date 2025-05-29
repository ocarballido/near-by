'use client';

import { useRef } from 'react';
import { useTranslations } from 'next-intl';

import { QRCodeSVG } from 'qrcode.react';

import ButtonIcon from '@/components/atoms/button-icon';
import IconQrCode from '@/components/atoms/icon/qr-code';

const ButtonQr = ({
	url,
	color = 'white',
}: {
	url: string;
	color?: 'primary' | 'secondary' | 'error' | 'white';
}) => {
	const t = useTranslations();

	const qrRef = useRef<HTMLDivElement>(null);

	const handlePrint = () => {
		const printContents = qrRef.current?.innerHTML;
		const printWindow = window.open('', '', 'height=600,width=600');

		if (printWindow && printContents) {
			printWindow.document.write(`
				<html>
					<head>
						<title>Print QR</title>
						<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap" rel="stylesheet">
						<style>
							body {
								font-family: 'Inter', sans-serif;
								padding: 40px;
								margin: 0;
							}
							h1 {
								font-size: 24pt;
								font-weight: bold;
								margin-top: 32px;
							}
							p {
								font-size: 14pt;
								margin: 10px 0;
							}
							svg {
								display: block;
								margin: 0 auto;
							}
						</style>
					</head>
					<body>
						${printContents}
					</body>
				</html>
			`);
			printWindow.document.close();
			printWindow.focus();
			printWindow.print();
			printWindow.close();
		}
	};

	return (
		<div>
			<div ref={qrRef} className="hidden">
				<QRCodeSVG value={url} size={200} />
				<h1 className="font-heading text-3xl font-bold">
					{t('¡Te damos la bienvenida con los brazos abiertos!')}
				</h1>
				<p className="font-body">
					{t(
						'Nos alegra que hayas elegido nuestro alojamiento para tu estancia'
					)}
				</p>
				<p className="font-body">
					{t(
						'Nuestro espacio está preparado para que descanses, te relajes y vivas una experiencia cómoda y sin complicaciones'
					)}
				</p>
			</div>
			<ButtonIcon
				color={color}
				icon={<IconQrCode />}
				onClick={handlePrint}
				className="bg-primary-500"
			/>
		</div>
	);
};

export default ButtonQr;
