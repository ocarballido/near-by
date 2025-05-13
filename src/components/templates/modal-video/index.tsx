'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

import { default as _ReactPlayer } from 'react-player';
import { ReactPlayerProps } from 'react-player/types/lib';
const ReactPlayer = _ReactPlayer as unknown as React.FC<ReactPlayerProps>;
import { Dialog, DialogPanel, DialogBackdrop } from '@headlessui/react';

import ButtonIcon from '@/components/atoms/button-icon';
import Button from '@/components/molecules/button';
import IconCancel from '@/components/atoms/icon/cancel';
import IconPlayArrow from '@/components/atoms/icon/play-arrow';

const ModalVideo = () => {
	const t = useTranslations();

	const [isOpen, setIsOpen] = useState(false);

	return (
		<>
			<Button
				className="w-full mt-2"
				label={t('Ver vídeotutorial')}
				onClick={() => setIsOpen(true)}
				iconLeft={<IconPlayArrow />}
				color="white"
			/>
			<Dialog
				open={isOpen}
				onClose={() => setIsOpen(false)}
				className="relative z-50"
			>
				<DialogBackdrop className="fixed inset-0 bg-gray-200/90" />

				<div className="fixed inset-0 flex w-screen items-center justify-center p-4">
					<DialogPanel className="space-y-4 rounded-2xl bg-white shadow-2xl relative overflow-hidden w-full max-w-[1000px]">
						<div className="relative w-full pb-[56.25%] m-0">
							<ReactPlayer
								className="absolute top-0 left-0"
								url="https://www.youtube.com/watch?v=LXb3EKWsInQ"
								width="100%"
								height="100%"
							/>
						</div>
						<div className="absolute right-2 top-2">
							<ButtonIcon
								onClick={() => setIsOpen(false)}
								icon={<IconCancel />}
								color="primary"
								className="bg-white shadow-lg"
							/>
						</div>
					</DialogPanel>
				</div>
			</Dialog>
		</>
	);
};

export default ModalVideo;
