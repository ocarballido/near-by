import { useTranslations } from 'next-intl';
import SubscriptionCard from '@/components/molecules/subscription-card';
import AppContentTemplate from '@/components/templates/app-content';

export default function Subscription() {
	const t = useTranslations();

	return (
		<AppContentTemplate>
			<div className="p-4 font-roboto flex flex-col grow gap-4 bg-white rounded-lg overflow-hidden justify-center items-center">
				<div className="w-full max-w-[600px] text-center mb-4">
					<h1 className="font-heading font-bold text-xl mb-2 text-primary-500">
						{t('¡Estás disfrutando de la suscripción PLATINUM!')}
					</h1>
					<p className="font-medium">{t('Acceso completo')}</p>
				</div>
				<div className="w-full flex flex-wrap justify-center gap-2">
					<SubscriptionCard
						active={false}
						type="FREE"
						className="max-w-[360px] w-full"
						price="0€"
					/>
					<SubscriptionCard
						active={false}
						type="PREMIUM"
						className="max-w-[360px] w-full"
						price={`9.99€/${t('Mes')}`}
					/>
					<SubscriptionCard
						active
						type="PLATINUM"
						className="max-w-[360px] w-full"
						price={`99.99€/${t('Para siempre')}`}
					/>
				</div>
				<p className="text-xs mt-4 max-w-[400px] text-center">
					{t(
						'Nuestra lista de funciones está en constante evolución'
					)}
				</p>
			</div>
		</AppContentTemplate>
	);
}
