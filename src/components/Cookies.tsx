'use client';

import { useTranslations } from 'next-intl';
import React, { useEffect, useState } from 'react';

import Button from './molecules/button';
import ButtonIcon from './atoms/button-icon';
import { setCookie, getCookie } from 'cookies-next/client';
import Link from 'next/link';
import IconClose from './atoms/icon/close';

const COOKIE_CONSENT_KEY = 'cookie-accept';
const COOKIE_EXPIRY_DAYS = 365;

const CookieConsent = () => {
	const t = useTranslations();

	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		const consent = getCookie(COOKIE_CONSENT_KEY);
		if (!consent) {
			const timer = setTimeout(() => {
				setIsVisible(true);
			}, 1000);
			return () => clearTimeout(timer);
		}
	}, []);

	const handleAccept = () => {
		setCookie(COOKIE_CONSENT_KEY, 'accepted', {
			expires: new Date(
				Date.now() + COOKIE_EXPIRY_DAYS * 24 * 60 * 60 * 1000
			),
			sameSite: 'strict',
			secure: process.env.NODE_ENV === 'production',
			path: '/',
		});
		setIsVisible(false);
	};

	const handleDecline = () => {
		setCookie(COOKIE_CONSENT_KEY, 'declined', {
			expires: new Date(
				Date.now() + COOKIE_EXPIRY_DAYS * 24 * 60 * 60 * 1000
			),
			sameSite: 'strict',
			secure: process.env.NODE_ENV === 'production',
			path: '/',
		});
		setIsVisible(false);
	};

	if (!isVisible) return null;

	return (
		<div className="font-body fixed bottom-3 left-3 right-3 bg-white rounded-md shadow-md z-50 transform transition-transform duration-500 ease-in-out">
			<div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
				<div className="flex flex-col sm:flex-row items-center justify-between gap-4">
					<div className="flex items-center gap-1 flex-shrink-0">
						<div className="space-y-1 text-sm text-gray-500 font-medium">
							<p className="">{t('Cookie banner')}</p>
							<p>
								{t.rich('Lee nuestra', {
									privacyPolicy: (chunks) => (
										<Link
											className="underline text-primary-500"
											href="/legal/privacy"
										>
											{chunks}
										</Link>
									),
									conditions: (chunks) => (
										<Link
											className="underline text-primary-500"
											href="/legal/conditions"
										>
											{chunks}
										</Link>
									),
									content: (chunks) => (
										<Link
											className="underline text-primary-500"
											href="/legal/content"
										>
											{chunks}
										</Link>
									),
								})}
							</p>
						</div>
					</div>
					<div className="flex items-center gap-1 flex-shrink-0">
						<Button
							color="secondary"
							label={t('Rechazar')}
							onClick={handleDecline}
							className="text-gray-600 hover:text-gray-700"
						/>
						<Button
							label={t('Aceptar')}
							onClick={handleAccept}
							className="bg-blue-600 text-white hover:bg-blue-700"
						/>
						<ButtonIcon
							icon={<IconClose />}
							onClick={handleDecline}
							aria-label="Close"
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

export default CookieConsent;
