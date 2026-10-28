import { useRef } from 'react';

// Imprime en una ventana nueva el contenido del bloque oculto enlazado a qrRef
export function usePrintQr() {
	const qrRef = useRef<HTMLDivElement>(null);

	const printQr = () => {
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

	return { qrRef, printQr };
}
