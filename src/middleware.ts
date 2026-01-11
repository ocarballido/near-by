import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { type NextRequest, NextResponse } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

const handleI18nRouting = createMiddleware(routing);

function ensureAnonCookieForPublic(
	request: NextRequest,
	response: NextResponse
) {
	// Solo para la URL pública
	if (!request.nextUrl.pathname.startsWith('/public')) return response;

	const existing = request.cookies.get('be_anon_id');
	if (existing?.value) return response;

	response.cookies.set('be_anon_id', crypto.randomUUID(), {
		httpOnly: true,
		sameSite: 'lax',
		secure: process.env.NODE_ENV === 'production',
		path: '/',
		maxAge: 60 * 60 * 24 * 365, // 1 año
	});

	return response;
}

export async function middleware(request: NextRequest) {
	// 1) i18n
	let response = handleI18nRouting(request) as NextResponse;

	// 2) cookie anónima SOLO en /public
	response = ensureAnonCookieForPublic(request, response);

	// 3) sesión supabase
	return await updateSession(request, response);
}

export const config = {
	matcher: [
		'/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
	],
};
