import { getTranslations } from 'next-intl/server';
import Typography from '@/components/atoms/typography';
import { ShareMenu } from '@/components/molecules/button-share';

type Props = {
	userId: string;
};

const ShareSection = async ({ userId }: Props) => {
	const t = await getTranslations();

	return (
		<div className="flex flex-col w-full p-3">
			<Typography component="h3" size="lg" className="mb-3">
				{t('shareButtonTitle')}
			</Typography>
			<Typography className="mb-2">{t('shareButtonText')}</Typography>
			<div className="w-fit">
				<ShareMenu
					url="https://bnbexplorer.com"
					surface="landing_header"
					distinctId={userId}
				/>
			</div>
		</div>
	);
};

export default ShareSection;
