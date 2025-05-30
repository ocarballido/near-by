import { NextResponse } from 'next/server';

export async function POST(req: Request) {
	try {
		const { token, action } = await req.json(); // 👈 asegúrate de enviar `action` desde el frontend
		const secret = process.env.RECAPTCHA_SECRET_KEY;

		if (!token || !secret || !action) {
			return NextResponse.json(
				{ success: false, message: 'Missing token, action, or secret' },
				{ status: 400 }
			);
		}

		const params = new URLSearchParams();
		params.append('secret', secret);
		params.append('response', token);

		const res = await fetch(
			'https://www.google.com/recaptcha/api/siteverify',
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
				},
				body: params.toString(),
			}
		);

		const data = await res.json();

		console.log('🧪 reCAPTCHA response:', data); // Puedes quitarlo luego

		const success =
			data.success === true &&
			data.action === action && // 👈 debe coincidir con lo enviado desde el frontend
			typeof data.score === 'number' &&
			data.score >= 0.5;

		return NextResponse.json({ success });
	} catch (error) {
		console.error('Error verifying reCAPTCHA:', error);
		return NextResponse.json({ success: false }, { status: 500 });
	}
}
