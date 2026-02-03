import { useTranslations } from 'next-intl';
import SubscriptionCard from '@/components/molecules/subscription-card';
import AppContentTemplate from '@/components/templates/app-content';
import Typography from '@/components/atoms/typography';

export default function Subscription() {
	const t = useTranslations();

	return (
		<AppContentTemplate>
			<div className="p-4 font-roboto flex flex-col grow gap-4 rounded-lg overflow-hidden justify-center items-center">
				<div className="w-full max-w-[600px] text-center mb-4">
					<Typography component="h1" size="lg">
						{t(
							'Aunque tienes una suscripción FREE, estás disfrutando de los beneficios de la suscripción PREMIUM',
						)}
					</Typography>
					<Typography>{t('Acceso completo')}</Typography>
				</div>
				<div className="w-full flex flex-wrap justify-center gap-2">
					<SubscriptionCard
						active
						type="FREE"
						className="max-w-[360px] w-full"
						price="0€"
					/>
					{/* <SubscriptionCard
						active={false}
						type="PREMIUM"
						className="max-w-[360px] w-full"
						price={`0.00€/${t('Mes')}`}
						// price={`9.99€/${t('Mes')}`}
					/> */}
				</div>
				<p className="text-xs mt-4 max-w-[400px] text-center">
					{t(
						'Nuestra lista de funciones está en constante evolución',
					)}
				</p>
			</div>
		</AppContentTemplate>
	);
}
