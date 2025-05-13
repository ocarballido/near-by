import { useTranslations } from 'next-intl';

import { TIPS } from '@/config/config-constants';

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
					{t('Gestione múltiples propiedades sin esfuerzo')}
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
				<div className="flex flex-wrap max-w-[1000px] p-4 rounded-2xl border-2 border-primary-100 mt-8">
					{TIPS.map((tip) => (
						<div
							key={tip.id}
							className="flex flex-col w-full md:w-full lg:w-1/2 xl:w-1/3 gap-4 p-4 items-center text-center"
						>
							<div className="flex justify-center items-center w-18 h-18 rounded-full bg-primary-100">
								<span className="flex justify-center items-center w-12 h-12 rounded-full bg-linear-270 from-primary-400 to-teal-600 font-bold text-white text-xl">
									{tip.id}
								</span>
							</div>
							<h3 className="text-lg font-bold font-heading">
								{t(tip.title)}
							</h3>
							<p className="font-body font-medium opacity-70">
								{t(tip.subtitle)}
							</p>
						</div>
					))}
				</div>
			</div>
		</AppContentTemplate>
	);
}
