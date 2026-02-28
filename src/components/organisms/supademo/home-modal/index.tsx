'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

import Button from '@/components/molecules/button';
import SimpleModal from '../../simple-modal';
import SupademoDemoViewer, { SupademoDemoViewerProps } from '../viewer';

type Props = SupademoDemoViewerProps & {
	buttonColor?: 'white' | 'primary' | 'secondary' | 'error' | undefined;
};

const DemoHomeModal = ({
	demos,
	defaultDemoId,
	buttonColor = 'white',
}: Props) => {
	const t = useTranslations();
	const [modalOpen, setModalOpen] = useState(false);

	return (
		<>
			<Button
				label={t('page_home.section_hero.tourButton')}
				onClick={() => setModalOpen(true)}
				color={buttonColor}
			/>
			<SimpleModal
				title={t('recommendations.title')}
				open={modalOpen}
				onClose={() => {
					setModalOpen(false);
				}}
				secondaryButtonAction={() => setModalOpen(false)}
				secondaryButtonLabel={t('createPropertyTipsModal.button.close')}
				size="max-w-full"
			>
				<div className="flex flex-col gap-2 p-3 mb-0">
					<SupademoDemoViewer
						demos={demos}
						defaultDemoId={defaultDemoId}
					/>
				</div>
			</SimpleModal>
		</>
	);
};

export default DemoHomeModal;
