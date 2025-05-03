import { useTranslations } from 'next-intl';

import Welcome from '@/components/molecules/welcome';
import ButtonLink from '@/components/molecules/button-link';
import IconApartment from '@/components/atoms/icon/apartment';
import IconAdd from '@/components/atoms/icon/add';
import AppContentTemplate from '@/components/templates/app-content';

export default function DashboardContent() {
	const t = useTranslations();

	return (
		<AppContentTemplate>
			<div className="p-4 font-roboto flex flex-col grow justify-center items-center gap-4 bg-white rounded-lg overflow-hidden">
				<Welcome />
				<p className=" max-w-96 text-center">
					{t(
						'Ya está todo listo para tomar el control total de su cartera de propiedades en un solo lugar, fácil de usar e intuitivo'
					)}
				</p>
				<div className="flex flex-col justify-center sm:flex-row gap-2 w-full">
					<ButtonLink
						label={t('Mis propiedades')}
						href="/app/properties"
						iconLeft={<IconApartment />}
						color="secondary"
						className="w-full sm:w-auto"
					/>
					<ButtonLink
						label={t('Nueva propiedad')}
						href="/app/properties/new"
						iconLeft={<IconAdd />}
						className="w-full sm:w-auto"
					/>
				</div>
			</div>
		</AppContentTemplate>
	);
}
