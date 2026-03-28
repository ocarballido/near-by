import { getTranslations, getLocale } from 'next-intl/server';
import Typography from '@/components/atoms/typography';
import ButtonLink from '@/components/molecules/button-link';
import IconArrowRightAlt from '@/components/atoms/icon/arrow-right-alt';
import { CATEGORIES_SUB_CATEGORIES } from '@/config/config-constants';
import { formatRelativeDays } from '@/utils/format-relative-days';

type Props = {
	lastEdited: { id: string; name: string; updated_at: string } | null;
};

const LastActivity = async ({ lastEdited }: Props) => {
	const t = await getTranslations();
	const locale = await getLocale();

	if (!lastEdited?.updated_at) return null;

	return (
		<div className="flex flex-col justify-center gap-1 w-full p-3">
			<Typography component="h3" size="lg" className="mb-1">
				{t('lastActivity.title')}
			</Typography>
			<ButtonLink
				label={t('lastActivity.edited', {
					property: lastEdited.name,
					time: formatRelativeDays(lastEdited.updated_at, locale),
				})}
				color="secondary"
				href={`/app/properties/${lastEdited.id}/${CATEGORIES_SUB_CATEGORIES.LODGING.id}/${CATEGORIES_SUB_CATEGORIES.LODGING.SUB_CATEGORIES.MANUAL.id}`}
				iconRight={<IconArrowRightAlt />}
			/>
		</div>
	);
};

export default LastActivity;
