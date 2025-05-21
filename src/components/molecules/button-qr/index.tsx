'use client';

import { useRef } from 'react';

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
	const qrRef = useRef<HTMLDivElement>(null);

	const handlePrint = () => {
		const printContents = qrRef.current?.innerHTML;
		const printWindow = window.open('', '', 'height=600,width=600');

		if (printWindow && printContents) {
			printWindow.document.write(
				'<html><head><title>Print QR</title></head><body>'
			);
			printWindow.document.write(printContents);
			printWindow.document.write('</body></html>');
			printWindow.document.close();
			printWindow.focus();
			printWindow.print();
			printWindow.close();
		}
	};

	return (
		<div>
			<div ref={qrRef} className="hidden">
				<QRCodeSVG value={url} size={256} />
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
