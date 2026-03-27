'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

import Modal from '@/components/organisms/modal';
import Button from '@/components/molecules/button';
import ButtonLink from '@/components/molecules/button-link';
import IconShare from '@/components/atoms/icon/share';
import IconOpenInNew from '@/components/atoms/icon/open-in-new';
import { ShareMenu } from '../button-share';

type Props = {
	propertyId: string;
	name: string;
	distinctId: string;
};

export default function ShareButton({ propertyId, name, distinctId }: Props) {
	const t = useTranslations();

	const [open, setOpen] = useState(false);

	const publicUrl = `${process.env.NEXT_PUBLIC_APP_URL}/public/${propertyId}/welcome/highlights`;

	return (
		<>
			<Button
				className="w-fit"
				iconLeft={<IconShare />}
				label={t('shareProperty')}
				color="white"
				onClick={() => setOpen(true)}
			/>

			<Modal
				open={open}
				onClose={() => setOpen(false)}
				title={name}
				secondaryButtonLabel={t('Cancelar')}
				secondaryButtonAction={() => setOpen(false)}
			>
				<div className="flex flex-col gap-4 w-full">
					{/* Compartir */}
					<ShareMenu
						url={publicUrl}
						surface="property_card"
						distinctId={distinctId}
						whatsappText={t('shareWhatsappText', { name })}
						showCopyLink
					/>

					{/* Ver guía */}
					<ButtonLink
						href={publicUrl}
						target="_blank"
						label={t('viewPropertyGuide')}
						iconLeft={<IconOpenInNew />}
						color="secondary"
						className="w-full"
					/>
				</div>
			</Modal>
		</>
	);
}
