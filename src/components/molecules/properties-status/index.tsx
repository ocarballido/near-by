import { getTranslations } from 'next-intl/server';
import BadgeCheck from '@/components/atoms/BadgeCheck';
import IconError from '@/components/atoms/icon/error';
import Typography from '@/components/atoms/typography';

type Props = {
	completedCount: number;
	incompleteCount: number;
};

const PropertiesStatus = async ({ completedCount, incompleteCount }: Props) => {
	const t = await getTranslations();

	return (
		<div className="flex flex-col justify-center gap-1 w-full p-3">
			<Typography component="h3" size="lg" className="mb-1">
				{t('propertiesStatusTitle')}
			</Typography>
			<div className="flex gap-1">
				<BadgeCheck
					checkedColor="primary"
					checked
					className="w-full"
					label={`${t('propertiesStatus.completed')}: ${completedCount}`}
				/>
				<BadgeCheck
					checkedColor="error"
					className="w-full"
					checked
					iconChecked={<IconError color="error" size={20} />}
					label={`${t('propertiesStatus.inProgress')}: ${incompleteCount}`}
				/>
			</div>
		</div>
	);
};

export default PropertiesStatus;
