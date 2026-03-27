'use client';

import React, { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import {
	FacebookShareButton,
	WhatsappShareButton,
	FacebookIcon,
	WhatsappIcon,
} from 'react-share';

import { trackEvent } from '@/lib/analytics/mixpanel';

import Button from '@/components/molecules/button';

type ShareChannel = 'facebook' | 'whatsapp' | 'copy_link';

type ShareMenuProps = {
	/** URL absoluta a compartir */
	url: string;

	/** dónde se mostró el share (para análisis) */
	surface: string; // e.g. "landing_header", "property_public_page", "dashboard_home"

	/** distinctId para Mixpanel (owner user.id o tenant anon id) */
	distinctId: string;

	/** texto opcional para WhatsApp */
	whatsappText?: string;

	/** tamaño iconos */
	iconSize?: number;

	/** mostrar copiar enlace */
	showCopyLink?: boolean;

	/** props extra */
	props?: Record<string, unknown>;
};

export function ShareMenu({
	url,
	surface,
	distinctId,
	whatsappText = 'Échale un ojo a esto:',
	iconSize = 40,
	showCopyLink = true,
	props,
}: ShareMenuProps) {
	const t = useTranslations();

	const shareUrl = useMemo(() => url.trim(), [url]);
	const [copyState, setCopyState] = useState<'idle' | 'copied'>('idle');

	const trackShare = async (
		channel: ShareChannel,
		extra?: Record<string, unknown>,
	) => {
		// server action: no bloqueamos UX si falla
		try {
			await trackEvent({
				event: 'share_clicked',
				distinctId,
				props: {
					channel,
					surface,
					url: shareUrl,
					...props,
					...extra,
				},
			});
		} catch {
			// nunca romper el flujo
		}
	};

	const onCopyLink = async () => {
		try {
			await navigator.clipboard.writeText(shareUrl);
			setCopyState('copied');
			void trackShare('copy_link');
			window.setTimeout(() => setCopyState('idle'), 1200);
		} catch {
			// fallback antiguo
			try {
				const ta = document.createElement('textarea');
				ta.value = shareUrl;
				ta.style.position = 'fixed';
				ta.style.opacity = '0';
				document.body.appendChild(ta);
				ta.focus();
				ta.select();
				document.execCommand('copy');
				document.body.removeChild(ta);

				setCopyState('copied');
				void trackShare('copy_link');
				window.setTimeout(() => setCopyState('idle'), 1200);
			} catch {
				void trackShare('copy_link', { copy_failed: true });
			}
		}
	};

	return (
		<div className="flex items-center gap-1 p-1 bg-gray-200 rounded-full">
			<FacebookShareButton
				url={shareUrl}
				// react-share llama a onClick antes del popup
				onClick={() => {
					void trackShare('facebook');
					return true;
				}}
			>
				<FacebookIcon size={iconSize} round />
			</FacebookShareButton>

			<WhatsappShareButton
				url={shareUrl}
				title={`${whatsappText}\n\n`}
				separator=""
				onClick={() => {
					void trackShare('whatsapp');
					return true;
				}}
			>
				<WhatsappIcon size={iconSize} round />
			</WhatsappShareButton>

			{showCopyLink && (
				<Button
					type="button"
					color="white"
					onClick={onCopyLink}
					className="w-full"
					label={
						copyState === 'copied'
							? t('shareButtonCopiedURL')
							: t('shareButtonCopyURL')
					}
				/>
			)}
		</div>
	);
}
