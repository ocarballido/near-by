import { useTranslations } from 'next-intl';

import Link from 'next/link';
import Typography from '@/components/atoms/typography';
import Badge from '@/components/atoms/badge';
import LandingAppBar from '@/components/organisms/landing-appbar';

export default function ContenidoPage() {
	const t = useTranslations();

	return (
		<div className="roboto p-4">
			<LandingAppBar />
			<div className="max-w-[900px] mt-4 rounded-lg p-4 ml-auto mr-auto font-body">
				<Typography component="h1" size="xl" className="uppercase">
					{t('guestGuideNotices.title')}
				</Typography>

				<Badge label={t('guestGuideNotices.lastUpdate')} />

				<Typography className="mt-4 mb-3" component="h2" size="lg">
					{t('guestGuideNotices.disclaimer.title')}
				</Typography>

				<Typography className="mb-3">
					{t.rich('guestGuideNotices.disclaimer.text', {
						link: (chunks) => (
							<Link
								href="https://www.bnbexplorer.com/"
								target="_blank"
								rel="noopener noreferrer"
								className="underline text-primary-500 font-medium"
							>
								{chunks}
							</Link>
						),
					})}
				</Typography>

				<Typography className="mt-4 mb-3" component="h2" size="lg">
					{t('guestGuideNotices.userContent.title')}
				</Typography>

				<Typography className="mb-3">
					{t('guestGuideNotices.userContent.text1')}
				</Typography>

				<Typography className="mb-3">
					{t('guestGuideNotices.userContent.text2')}
				</Typography>

				<Typography className="mb-3">
					{t('guestGuideNotices.userContent.text3')}
				</Typography>
			</div>
		</div>
	);
}
