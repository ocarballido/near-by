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
		if (!qrRef.current) return;

		// Crea una ventana nueva
		const printWindow = window.open('', '_blank', 'width=600,height=600');

		if (printWindow) {
			printWindow.document.write(`
        <html>
          <head>
            <title>QR Code</title>
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap" rel="stylesheet">
            <style>
              body {
                font-family: 'Inter', sans-serif;
                padding: 40px;
                margin: 0;
                text-align: center;
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
            ${qrRef.current.innerHTML}
          </body>
        </html>
      `);
			printWindow.document.close();

			// Espera a que el contenido cargue completamente antes de imprimir
			printWindow.onload = function () {
				printWindow.focus();
				printWindow.print();
				printWindow.close();
			};
		}
	};

	return (
		<div>
			{/* Contenido QR oculto */}
			<div ref={qrRef} style={{ display: 'none' }}>
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

			{/* Botón */}
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
