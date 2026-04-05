import { getTranslations } from 'next-intl/server';
import { fetchInfoSectionsData } from './_data';
import InfoSections from '@/components/templates/info-sections';

type Props = {
	propertyId: string;
	defaultOpenId?: string;
};

export default async function LodgingSection({
	propertyId,
	defaultOpenId,
}: Props) {
	const t = await getTranslations();
	const infoGroups = await fetchInfoSectionsData(propertyId);

	return (
		<InfoSections
			groups={infoGroups}
			defaultOpenId={defaultOpenId}
			title={t('El Alojamiento')}
		/>
	);
}
