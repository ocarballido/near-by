'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import {
	Dialog,
	DialogPanel,
	DialogTitle,
	DialogBackdrop,
} from '@headlessui/react';
import type { ArrivalGuideData } from '@/app/[locale]/public/[...slug]/_data';
import Step1Transport from './steps/Step1Transport';
import Step2Parking from './steps/Step2Parking';
import Step3Access from './steps/Step3Access';
import Step4Essentials from './steps/Step4Essentials';
import Step5Done from './steps/Step5Done';
import Button from '@/components/molecules/button';
import IconHome from '@/components/atoms/icon/home';
import ButtonIcon from '@/components/atoms/button-icon';
import IconClose from '@/components/atoms/icon/close';
import IconArrowLeftAlt from '@/components/atoms/icon/arrow-left-alt';
import IconArrowRightAlt from '@/components/atoms/icon/arrow-right-alt';
import Typography from '@/components/atoms/typography';
import IconDirections from '@/components/atoms/icon/directions';
import IconInfo from '@/components/atoms/icon/info';
import IconHelp from '@/components/atoms/icon/help';

interface Props {
	data: ArrivalGuideData;
	propertyId: string;
	address: string;
}

function getStorageKey(propertyId: string) {
	return `arrival_seen_${propertyId}`;
}

export default function ArrivalGuide({ data, propertyId, address }: Props) {
	const t = useTranslations('ArrivalGuide');
	const [open, setOpen] = useState(false);
	const [step, setStep] = useState(1);
	const [isPulsing, setIsPulsing] = useState(false);

	useEffect(() => {
		const seen = localStorage.getItem(getStorageKey(propertyId));
		if (!seen) {
			setOpen(true);
		}
	}, [propertyId]);

	function handleClose() {
		localStorage.setItem(getStorageKey(propertyId), '1');
		setOpen(false);
		setStep(1);
		setIsPulsing(true);
		setTimeout(() => setIsPulsing(false), 3500);
	}

	function handleOpen() {
		setStep(1);
		setOpen(true);
	}

	const visibleSteps = [
		1,
		data.parkings.length > 0 ? 2 : null,
		data.access_instructions ? 3 : null,
		data.wifi || data.check_in_time || data.check_out_time ? 4 : null,
		5,
	].filter((s): s is number => s !== null);

	const currentIndex = visibleSteps.indexOf(step);
	const isFirst = currentIndex === 0;
	const isLast = currentIndex === visibleSteps.length - 1;

	function goNext() {
		if (!isLast) setStep(visibleSteps[currentIndex + 1]);
	}

	function goBack() {
		if (!isFirst) setStep(visibleSteps[currentIndex - 1]);
	}

	return (
		<>
			<div className="fixed bottom-19 right-4 z-40">
				<div className={isPulsing ? 'animate-bounce' : ''}>
					{isPulsing && (
						<span className="absolute -inset-6 rounded-full bg-primary-400 animate-ping opacity-75 pointer-events-none" />
					)}
					<Button
						iconLeft={<IconHelp />}
						aria-label={t('triggerLabel')}
						onClick={handleOpen}
						label={t('triggerLabel')}
						className="py-3! px-4!"
					/>
				</div>
			</div>

			<Dialog
				open={open}
				onClose={handleClose}
				transition
				className="relative z-50 transition duration-300 ease-out data-closed:opacity-0"
			>
				<DialogBackdrop className="fixed inset-0 bg-gray-200/90" />
				<div className="fixed inset-0 w-screen overflow-y-auto p-4">
					<div className="flex min-h-full items-center justify-center p-4">
						<DialogPanel className="w-full max-w-md rounded-2xl bg-white shadow-2xl overflow-hidden">
							<DialogTitle className="font-bold text-xl p-4 border-b border-b-gray-100 flex items-center justify-between">
								<span>{t('modalTitle')}</span>
								<ButtonIcon
									aria-label={t('close')}
									onClick={handleClose}
									icon={<IconClose />}
								/>
							</DialogTitle>

							<div className="flex flex-col gap-3 p-4">
								<div className="">
									{step === 1 && (
										<Step1Transport address={address} />
									)}
									{step === 2 && (
										<Step2Parking
											parkings={data.parkings}
										/>
									)}
									{step === 3 && (
										<Step3Access
											accessInstructions={
												data.access_instructions
											}
										/>
									)}
									{step === 4 && (
										<Step4Essentials
											wifi={data.wifi}
											checkInTime={data.check_in_time}
											checkOutTime={data.check_out_time}
											emergencyNumber={
												data.emergency_number
											}
										/>
									)}
									{step === 5 && <Step5Done />}
								</div>

								<div className="flex flex-col gap-2">
									<div className="flex items-center justify-center gap-2 pt-4 px-4">
										{visibleSteps.map((s) => (
											<div
												key={s}
												className={`h-1 rounded-full transition-all duration-300 ${
													s === step
														? 'w-6 bg-primary-500'
														: 'w-2 bg-gray-200'
												}`}
											/>
										))}
									</div>

									<Typography
										className="text-center"
										color="text-gray-400"
										size="sm"
									>
										{t('step', {
											current: currentIndex + 1,
											total: visibleSteps.length,
										})}
									</Typography>
								</div>
							</div>

							<div className="flex justify-between gap-2 p-4 border-t border-t-gray-100 bg-primary-50">
								<Button
									onClick={isFirst ? handleClose : goBack}
									label={isFirst ? t('close') : t('back')}
									color="white"
									className="bg-transparent!"
									iconLeft={
										isFirst ? (
											<IconClose size={20} />
										) : (
											<IconArrowLeftAlt size={20} />
										)
									}
								/>
								{!isLast ? (
									<Button
										onClick={goNext}
										label={t('next')}
										color="primary"
										iconRight={
											<IconArrowRightAlt size={20} />
										}
									/>
								) : (
									<Button
										onClick={handleClose}
										label={t('close')}
										color="primary"
										iconRight={<IconClose size={20} />}
									/>
								)}
							</div>
						</DialogPanel>
					</div>
				</div>
			</Dialog>
		</>
	);
}
