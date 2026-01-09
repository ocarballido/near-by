'use client';

import { useTranslations } from 'next-intl';
import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import Modal from '@/components/organisms/modal';
import BadgeCheck from '@/components/atoms/BadgeCheck';
import Alert from '@/components/molecules/alert';

import { useLoading } from '@/lib/context/LoadingContext';

import { CATEGORIES_SUB_CATEGORIES } from '@/config/config-constants';
import { generateAutoLocations } from '@/app/actions/locations/generate-auto-locations';

type Props = {
	propertyId: string;
	initialHasLocations: boolean;
};

type Option = {
	categoryId: string;
	subCategoryId: string;
	name: string;
	defaultChecked: boolean;
};

const ModalAutoContent = ({ propertyId, initialHasLocations }: Props) => {
	const t = useTranslations();
	const router = useRouter();
	const { openLoading, closeLoading } = useLoading();

	const storageKey = `editor:autoPlacesModalDismissed:${propertyId}`;

	const [dismissed, setDismissed] = useState(false);
	const [isGenerating, setIsGenerating] = useState(false);

	const [alert, setAlert] = useState<{
		type: 'error' | 'success';
		message: string;
	} | null>(null);

	useEffect(() => {
		const val = sessionStorage.getItem(storageKey);
		if (val === '1') setDismissed(true);
	}, [storageKey]);

	// ✅ Cerrar modal guardando estado en sessionStorage (solo si usuario cancela/cierra)
	const dismiss = () => {
		setDismissed(true);
		sessionStorage.setItem(storageKey, '1');
	};

	// ✅ Cerrar modal SOLO para esta sesión (sin escribir sessionStorage)
	//    Útil para success: queremos limpiar el storage, no re-escribirlo.
	const closeForSessionOnly = () => {
		setDismissed(true);
	};

	const open = useMemo(() => {
		return !initialHasLocations && !dismissed;
	}, [initialHasLocations, dismissed]);

	const OPTIONS: Option[] = useMemo(() => {
		const o: Option[] = [
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
		];

		return o;
	}, []);

	// ✅ Selección inicial: solo las defaultChecked
	const [selectedSubCategoryIds, setSelectedSubCategoryIds] = useState<
		string[]
	>(() =>
		OPTIONS.filter((x) => x.defaultChecked).map((x) => x.subCategoryId)
	);

	// seguridad por hidratación/render order
	useEffect(() => {
		setSelectedSubCategoryIds((prev) => {
			if (prev.length) return prev;
			return OPTIONS.filter((x) => x.defaultChecked).map(
				(x) => x.subCategoryId
			);
		});
	}, [OPTIONS]);

	const toggle = (subCategoryId: string) => {
		setSelectedSubCategoryIds((prev) =>
			prev.includes(subCategoryId)
				? prev.filter((id) => id !== subCategoryId)
				: [...prev, subCategoryId]
		);
	};

	const canGenerate = selectedSubCategoryIds.length > 0;

	const handleGenerate = async () => {
		if (!canGenerate || isGenerating) return;

		setIsGenerating(true);
		setAlert(null);
		openLoading();

		const res = await generateAutoLocations(
			propertyId,
			selectedSubCategoryIds
		);

		closeLoading();
		setIsGenerating(false);

		const errMsg = res.errors?.server?.[0];
		if (errMsg) {
			setAlert({ type: 'error', message: errMsg });
			return;
		}

		setAlert({
			type: 'success',
			message: t('auto-modal-success-message'),
		});

		// ✅ IMPORTANTE: limpiar sessionStorage SOLO en success
		sessionStorage.removeItem(storageKey);

		// ✅ cerrar modal sin re-escribir el storage
		closeForSessionOnly();

		// refresca para que el layout server recalcule hasLocations
		router.refresh();
	};

	// ✅ No desmontar el componente si hay alert, para que se vea el success
	const shouldRender = open || alert !== null;
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

			{open && (
				<Modal
					title={t('auto-modal-title')}
					open={open}
					onClose={() => {
						if (isGenerating) return;
						dismiss();
					}}
					secondaryButtonLabel={t(
						'auto-modal-secondary-button-label'
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
									label={opt.name}
									checked={selectedSubCategoryIds.includes(
										opt.subCategoryId
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
		</>
	);
};

export default ModalAutoContent;
