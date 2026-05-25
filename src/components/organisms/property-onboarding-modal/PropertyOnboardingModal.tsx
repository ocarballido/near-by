'use client';

import { useEffect, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';

import Modal from '@/components/organisms/modal';
import BadgeCheck from '@/components/atoms/BadgeCheck';
import Alert from '@/components/molecules/alert';
import Typography from '@/components/atoms/typography';

import { useLoading } from '@/lib/context/LoadingContext';
import { useGlobal } from '@/lib/context/GlobalContext';

import { CATEGORIES_SUB_CATEGORIES } from '@/config/config-constants';
import { generateAutoLocations } from '@/app/actions/locations/generate-auto-locations';
import { trackClientEvent } from '@/lib/analytics/trackClient';

import { WowStatsRow } from './WowStatsRow';
import { WowPreviewList } from './WowPreviewList';
import ButtonLink from '@/components/molecules/button-link';
import IconOpenInNew from '@/components/atoms/icon/open-in-new';
import { ShareMenu } from '@/components/molecules/button-share';
import ButtonQr from '@/components/molecules/button-qr';

type Step = 'auto-content' | 'wow';

type Option = {
	categoryId: string;
	subCategoryId: string;
	name: string;
	defaultChecked: boolean;
};

type PreviewLocation = {
	id: string;
	name: string | null;
};

type Props = {
	propertyId: string;
	propertyName: string;
	initialHasLocations: boolean;
	previewLocations: PreviewLocation[];
	totalInfo: number;
};

const PropertyOnboardingModal = ({
	propertyId,
	propertyName,
	initialHasLocations,
	previewLocations,
	totalInfo,
}: Props) => {
	const t = useTranslations();
	const router = useRouter();
	const { openLoading, closeLoading } = useLoading();
	const { user } = useGlobal();

	const storageKey = `editor:autoPlacesModalDismissed:${propertyId}`;

	const [step, setStep] = useState<Step>('auto-content');
	const [dismissed, setDismissed] = useState(false);
	const [isGenerating, setIsGenerating] = useState(false);
	const [totalLocations, setTotalLocations] = useState(0);

	const [alert, setAlert] = useState<{
		type: 'error' | 'success';
		message: string;
	} | null>(null);

	useEffect(() => {
		const val = sessionStorage.getItem(storageKey);
		if (val === '1') setDismissed(true);
	}, [storageKey]);

	const autoContentOpen = useMemo(() => {
		return !initialHasLocations && !dismissed && step === 'auto-content';
	}, [initialHasLocations, dismissed, step]);

	const wowOpen = step === 'wow';

	const OPTIONS: Option[] = useMemo(
		() => [
			{
				categoryId: CATEGORIES_SUB_CATEGORIES.HEALTH_AND_WELLNESS.id,
				subCategoryId:
					CATEGORIES_SUB_CATEGORIES.HEALTH_AND_WELLNESS.SUB_CATEGORIES
						.PHARMACIES.id,
				name: CATEGORIES_SUB_CATEGORIES.HEALTH_AND_WELLNESS
					.SUB_CATEGORIES.PHARMACIES.name,
				defaultChecked: true,
			},
			{
				categoryId: CATEGORIES_SUB_CATEGORIES.FOOD_AND_DRINK.id,
				subCategoryId:
					CATEGORIES_SUB_CATEGORIES.FOOD_AND_DRINK.SUB_CATEGORIES
						.RESTAURANTS.id,
				name: CATEGORIES_SUB_CATEGORIES.FOOD_AND_DRINK.SUB_CATEGORIES
					.RESTAURANTS.name,
				defaultChecked: true,
			},
			{
				categoryId: CATEGORIES_SUB_CATEGORIES.FOOD_AND_DRINK.id,
				subCategoryId:
					CATEGORIES_SUB_CATEGORIES.FOOD_AND_DRINK.SUB_CATEGORIES
						.CAFES.id,
				name: CATEGORIES_SUB_CATEGORIES.FOOD_AND_DRINK.SUB_CATEGORIES
					.CAFES.name,
				defaultChecked: true,
			},
			{
				categoryId: CATEGORIES_SUB_CATEGORIES.SHOPPING.id,
				subCategoryId:
					CATEGORIES_SUB_CATEGORIES.SHOPPING.SUB_CATEGORIES
						.SUPERMARKETS.id,
				name: CATEGORIES_SUB_CATEGORIES.SHOPPING.SUB_CATEGORIES
					.SUPERMARKETS.name,
				defaultChecked: true,
			},
			{
				categoryId: CATEGORIES_SUB_CATEGORIES.HEALTH_AND_WELLNESS.id,
				subCategoryId:
					CATEGORIES_SUB_CATEGORIES.HEALTH_AND_WELLNESS.SUB_CATEGORIES
						.EMERGENCY.id,
				name: CATEGORIES_SUB_CATEGORIES.HEALTH_AND_WELLNESS
					.SUB_CATEGORIES.EMERGENCY.name,
				defaultChecked: true,
			},
			{
				categoryId:
					CATEGORIES_SUB_CATEGORIES.SECURITY_AND_EMERGENCIES.id,
				subCategoryId:
					CATEGORIES_SUB_CATEGORIES.SECURITY_AND_EMERGENCIES
						.SUB_CATEGORIES.POLICE_STATIONS.id,
				name: CATEGORIES_SUB_CATEGORIES.SECURITY_AND_EMERGENCIES
					.SUB_CATEGORIES.POLICE_STATIONS.name,
				defaultChecked: false,
			},
			{
				categoryId: CATEGORIES_SUB_CATEGORIES.FOOD_AND_DRINK.id,
				subCategoryId:
					CATEGORIES_SUB_CATEGORIES.FOOD_AND_DRINK.SUB_CATEGORIES.BARS
						.id,
				name: CATEGORIES_SUB_CATEGORIES.FOOD_AND_DRINK.SUB_CATEGORIES
					.BARS.name,
				defaultChecked: false,
			},
			{
				categoryId: CATEGORIES_SUB_CATEGORIES.SERVICES.id,
				subCategoryId:
					CATEGORIES_SUB_CATEGORIES.SERVICES.SUB_CATEGORIES.PARKINGS
						.id,
				name: CATEGORIES_SUB_CATEGORIES.SERVICES.SUB_CATEGORIES.PARKINGS
					.name,
				defaultChecked: false,
			},
		],
		[],
	);

	const [selectedSubCategoryIds, setSelectedSubCategoryIds] = useState<
		string[]
	>(() =>
		OPTIONS.filter((x) => x.defaultChecked).map((x) => x.subCategoryId),
	);

	const toggle = (subCategoryId: string) => {
		setSelectedSubCategoryIds((prev) =>
			prev.includes(subCategoryId)
				? prev.filter((id) => id !== subCategoryId)
				: [...prev, subCategoryId],
		);
	};

	const canGenerate = selectedSubCategoryIds.length > 0;

	// Cerrar auto-content sin generar → mostrar wow
	const dismiss = () => {
		setDismissed(true);
		sessionStorage.setItem(storageKey, '1');
		setTotalLocations(0);
		setStep('wow');
	};

	// Cerrar wow
	const handleWowClose = () => {
		setStep('auto-content');

		if (user?.id) {
			trackClientEvent({
				event: 'wow_modal_dismissed',
				distinctId: user.id,
				props: { property_id: propertyId },
			});
		}
	};

	const handleGenerate = async () => {
		if (!canGenerate || isGenerating) return;

		setIsGenerating(true);
		setAlert(null);
		openLoading();

		const res = await generateAutoLocations(
			propertyId,
			selectedSubCategoryIds,
		);

		closeLoading();
		setIsGenerating(false);

		if (res.errors?.server?.[0]) {
			setAlert({ type: 'error', message: res.errors.server[0] });
			return;
		}

		setAlert({
			type: 'success',
			message: t('auto-modal-success-message'),
		});

		setTotalLocations(res.inserted ?? 0);

		sessionStorage.removeItem(storageKey);
		setDismissed(true);
		setStep('wow');

		router.refresh();
	};

	const publicUrl = `${process.env.NEXT_PUBLIC_APP_URL}/public/${propertyId}/welcome/highlights`;

	const shouldRender = autoContentOpen || wowOpen || alert !== null;

	if (!shouldRender) return null;

	return (
		<>
			{alert && (
				<Alert
					hideTime={3000}
					open={alert !== null}
					title={alert.type === 'error' ? t('Error') : t('Validado')}
					dismissible
					type={alert.type}
					message={alert.message}
				/>
			)}

			{/* Step 1: auto-content */}
			{autoContentOpen && (
				<Modal
					title={t('auto-modal-title')}
					open={autoContentOpen}
					onClose={() => {
						if (isGenerating) return;
						dismiss();
					}}
					secondaryButtonLabel={t(
						'auto-modal-secondary-button-label',
					)}
					primaryButtonLabel={
						isGenerating
							? t('auto-modal-primary-button-loading')
							: t('auto-modal-primary-button-label')
					}
					primaryButtonAction={handleGenerate}
					primaryButtonDisabled={!canGenerate}
					secondaryButtonAction={() => {
						if (isGenerating) return;
						dismiss();
					}}
				>
					<div className="w-full text-left">
						<p className="text-left text-sm font-normal mb-4">
							{t.rich('auto-modal-description', {
								bold: (chunks) => (
									<span className="font-bold">{chunks}</span>
								),
							})}
						</p>

						<p className="font-bold text-sm mb-1">
							{t('auto-modal-pick-types-label')}
						</p>

						<div className="flex flex-wrap gap-1">
							{OPTIONS.map((opt) => (
								<BadgeCheck
									key={opt.subCategoryId}
									label={t(opt.name)}
									checked={selectedSubCategoryIds.includes(
										opt.subCategoryId,
									)}
									onToggle={() => toggle(opt.subCategoryId)}
								/>
							))}
						</div>

						{!canGenerate && (
							<p className="text-xs text-error-600 mt-3">
								{t('auto-modal-select-at-least-one')}
							</p>
						)}
					</div>
				</Modal>
			)}

			{/* Step 2: wow */}
			{wowOpen && (
				<Modal
					open={wowOpen}
					onClose={handleWowClose}
					title={t('wow.title')}
					primaryButtonLabel={t('wow.cta.closeModal')}
					primaryButtonAction={handleWowClose}
				>
					<div className="flex flex-col gap-4 w-full text-left">
						<div className="flex flex-col items-center justify-center gap-1 py-4 text-center">
							<span className="text-5xl">🎉</span>
							<h3 className="text-[1.618rem] font-bold leading-normal font-heading text-gray-800 mb-2">
								{t('wow.contentTitle')}
							</h3>
							<Typography component="p" lineHeight="relaxed">
								{t.rich('wow.subtitle', {
									name: propertyName,
									bold: (chunks) => <strong>{chunks}</strong>,
								})}
							</Typography>
						</div>
						<WowStatsRow
							totalLocations={totalLocations}
							totalInfo={totalInfo}
						/>
						<WowPreviewList
							locations={previewLocations}
							total={totalLocations}
						/>
						<div className="flex flex-col gap-2">
							<div className="flex gap-1">
								<ButtonLink
									label={t('wow.publicWeb')}
									color="primary"
									iconLeft={<IconOpenInNew />}
									className="w-full"
									href={publicUrl}
									target="_blank"
								/>
								<ButtonQr url={publicUrl} />
							</div>
							<ShareMenu
								url={publicUrl}
								surface="property_card"
								distinctId=""
								whatsappText={t('shareWhatsappText', {
									name: propertyName,
								})}
								showCopyLink
							/>
						</div>
						{totalLocations > 0 && (
							<Typography
								component="p"
								size="sm"
								weight="medium"
								color="text-info-800/80"
								className="p-4 bg-info-100 rounded-xl"
							>
								{t('wow.ownerAction')}
							</Typography>
						)}
					</div>
				</Modal>
			)}
		</>
	);
};

export default PropertyOnboardingModal;
