import { useTranslations } from 'next-intl';

import Link from 'next/link';
import Typography from '@/components/atoms/typography';
import Badge from '@/components/atoms/badge';
import LandingAppBar from '@/components/organisms/landing-appbar';

export default function NoticePage() {
	const t = useTranslations();

	return (
		<div className="roboto p-4">
			<LandingAppBar />
			<div className="max-w-[900px] mt-4 rounded-lg p-4 ml-auto mr-auto font-body">
				<Typography component="h1" size="xl" className="uppercase">
					{t('legalNotice.title')}
				</Typography>

				<Badge label={t('legalNotice.lastUpdate')} />

				<Typography className="mt-4 mb-3" component="h2" size="lg">
					{t('legalNotice.identification.title')}
				</Typography>

				<Typography className="mb-3">
					{t('legalNotice.identification.intro')}
				</Typography>

				<ul className="list-disc pl-6 mb-3">
					<li>
						{t.rich('legalNotice.identification.owner', {
							link: (chunks) => (
								<Link
									href="https://www.oscarballido.com"
									target="_blank"
									rel="noopener noreferrer"
									className="underline text-primary-500 font-medium"
								>
									{chunks}
								</Link>
							),
						})}
					</li>
					{/* TODO <li>
						{t.rich('legalNotice.identification.email', {
							link: (chunks) => (
								<Link
									href="mailto:contact@bnbexplorer.com"
									target="_blank"
									rel="noopener noreferrer"
									className="underline text-primary-500 font-medium"
								>
									{chunks}
								</Link>
							),
						})}
					</li> */}
					<li>
						{t.rich('legalNotice.identification.website', {
							link: (chunks) => (
								<Link
									href="https://www.bnbexplorer.com"
									rel="noopener noreferrer"
									className="underline text-primary-500 font-medium"
								>
									{chunks}
								</Link>
							),
						})}
					</li>
				</ul>

				<Typography className="mt-4 mb-3" component="h2" size="lg">
					{t('legalNotice.users.title')}
				</Typography>

				<Typography className="mb-3">
					{t('legalNotice.users.text')}
				</Typography>

				<Typography className="mt-4 mb-3" component="h2" size="lg">
					{t('legalNotice.ip.title')}
				</Typography>

				<Typography className="mb-3">
					{t('legalNotice.ip.text')}
				</Typography>
			</div>
		</div>
	);
}
