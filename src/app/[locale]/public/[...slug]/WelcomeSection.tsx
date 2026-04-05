import { getTranslations } from 'next-intl/server';

import WelcomeTabs from '@/components/templates/welcome-tabs';
import WeatherWidget from '@/components/templates/weather-widget';
import InfoShortcuts from '@/components/molecules/info-shortcuts';

import { fetchWelcomeHighlightsTabsData, fetchInfoSectionsData } from './_data';

type Props = {
	propertyId: string;
	lat: number;
	lng: number;
};

export default async function WelcomeSection({ propertyId, lat, lng }: Props) {
	const t = await getTranslations();

	const { featuredGroups, mustVisitGroups } =
		await fetchWelcomeHighlightsTabsData(propertyId);

	const infoGroups = await fetchInfoSectionsData(propertyId);

	return (
		<>
			<h1 className="font-heading text-3xl font-bold">
				{t('¡Te damos la bienvenida con los brazos abiertos!')}
			</h1>

			<p className="font-body">
				{t(
					'Nos alegra que hayas elegido nuestro alojamiento para tu estancia',
				)}
			</p>

			<InfoShortcuts groups={infoGroups} propertyId={propertyId} />

			<WeatherWidget lat={lat} lng={lng} />

			<WelcomeTabs
				lat={lat}
				lng={lng}
				featuredGroups={featuredGroups}
				mustVisitGroups={mustVisitGroups}
				labels={{
					featuredTab: t('favorites'),
					mustVisitTab: t('mustSees'),
					eventsTab: t('events'),
					featuredHeading: t('favoriteExplained'),
					mustVisitHeading: t('mustSeeExplained'),
				}}
			/>
		</>
	);
}
