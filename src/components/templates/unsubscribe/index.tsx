'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';

import FancyIcon from '@/components/atoms/icon/fancy-icon';
import ButtonLink from '@/components/molecules/button-link';
import IconError from '@/components/atoms/icon/error';
import IconCheckCircle from '@/components/atoms/icon/check-circle';
import IconInfo from '@/components/atoms/icon/info';

type Status = 'loading' | 'success' | 'error' | 'invalid';

const UnsubscribeTemplate = () => {
	const t = useTranslations('unsubscribe');
	const searchParams = useSearchParams();
	const token = searchParams.get('token');
	const [status, setStatus] = useState<Status>('loading');

	useEffect(() => {
		if (!token) {
			setStatus('invalid');
			return;
		}

		const unsubscribe = async () => {
			try {
				const res = await fetch('/api/unsubscribe', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ token }),
				});

				if (res.ok) {
					setStatus('success');
				} else {
					setStatus('error');
				}
			} catch {
				setStatus('error');
			}
		};

		unsubscribe();
	}, [token]);

	return (
		<div className="roboto p-4 flex justify-center items-center font-body min-h-screen">
			<section className="flex flex-col gap-4 p-8 items-center max-w-[600px] w-full ml-auto mr-auto bg-white rounded-lg shadow-sm">
				{status === 'loading' && (
					<div className="flex flex-col items-center gap-4 py-8">
						<div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
						<p className="text-gray-600">{t('loading')}</p>
					</div>
				)}

				{status === 'success' && (
					<div className="flex flex-col items-center gap-4 text-center">
						<FancyIcon
							color="gradient"
							icon={<IconCheckCircle color="white" />}
						/>
						<h1 className="text-2xl font-bold font-heading text-gray-800">
							{t('successTitle')}
						</h1>
						<p className="text-gray-600">{t('successBody')}</p>
						<ButtonLink label={t('backHome')} href="/" />
					</div>
				)}

				{status === 'error' && (
					<div className="flex flex-col items-center gap-4 text-center">
						<FancyIcon
							color="gradient"
							icon={<IconError color="white" />}
						/>
						<h1 className="text-2xl font-bold font-heading text-gray-800">
							{t('errorTitle')}
						</h1>
						<p className="text-gray-600">{t('errorBody')}</p>
						<ButtonLink label={t('backHome')} href="/" />
					</div>
				)}

				{status === 'invalid' && (
					<div className="flex flex-col items-center gap-4 text-center">
						<FancyIcon
							color="gradient"
							icon={<IconInfo color="white" />}
						/>
						<h1 className="text-2xl font-bold font-heading text-gray-800">
							{t('invalidTitle')}
						</h1>
						<p className="text-gray-600">{t('invalidBody')}</p>
						<ButtonLink label={t('backHome')} href="/" />
					</div>
				)}
			</section>
		</div>
	);
};

export default UnsubscribeTemplate;
