'use client';

import { usePaywall } from '@/lib/context/PaywallContext';
import Modal from '@/components/organisms/modal';
import { useTranslations } from 'next-intl';
import Typography from '@/components/atoms/typography';
import FancyIcon from '@/components/atoms/icon/fancy-icon';
import IconNewRelease from '@/components/atoms/icon/new-releases';

export default function PaywallModal() {
	const t = useTranslations();
	const { activeModal, closePaywall, continueAfterSoftModal, planLimit } =
		usePaywall();

	if (!activeModal) return null;

	if (activeModal === 'beta') {
		return (
			<Modal
				open
				onClose={closePaywall}
				title={t('paywall.beta.title')}
				primaryButtonLabel={t('paywall.beta.primaryButton')}
				primaryButtonAction={continueAfterSoftModal}
				secondaryButtonLabel={t('Cancelar')}
				secondaryButtonAction={closePaywall}
			>
				<div className="flex flex-col gap-4 items-center">
					<FancyIcon
						icon={<IconNewRelease color="white" />}
						color="gradient"
					/>
					<Typography component="h3" size="lg">
						{t('paywall.beta.description')}
					</Typography>
					<Typography>{t('paywall.beta.message')}</Typography>
				</div>
			</Modal>
		);
	}

	if (activeModal === 'soft') {
		return (
			<Modal
				open
				onClose={closePaywall}
				title={t('paywall.soft.title')}
				primaryButtonLabel={t('paywall.soft.primaryButton')}
				primaryButtonAction={continueAfterSoftModal}
				secondaryButtonLabel={t('paywall.soft.secondaryButton')}
				secondaryButtonAction={() => {
					// TO DO: conectamos a feedback
					closePaywall();
				}}
			>
				<div className="flex flex-col gap-4 items-center">
					<FancyIcon
						icon={<IconNewRelease color="white" />}
						color="gradient"
					/>
					<Typography component="h3" size="lg">
						{t('paywall.soft.description')}
					</Typography>
					<Typography>{t('paywall.soft.message')}</Typography>
				</div>
			</Modal>
		);
	}

	// hard
	return (
		<Modal
			open
			onClose={closePaywall}
			title={t('paywall.hard.title')}
			primaryButtonLabel={t('paywall.hard.primaryButton')}
			primaryButtonAction={() => {
				// TO DO: router.push('/app/plans')
				closePaywall();
			}}
			secondaryButtonLabel={t('paywall.hard.secondaryButton')}
			secondaryButtonAction={closePaywall}
		>
			<div className="flex flex-col gap-4 items-center">
				<FancyIcon
					icon={<IconNewRelease color="white" />}
					color="gradient"
				/>
				<Typography component="h3" size="lg">
					{t('paywall.hard.description', {
						limit: planLimit === 'unlimited' ? '∞' : planLimit,
					})}
				</Typography>
				<Typography>{t('paywall.hard.message')}</Typography>
			</div>
		</Modal>
	);
}
