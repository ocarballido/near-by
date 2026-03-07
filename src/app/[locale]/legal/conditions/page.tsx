import { useTranslations } from 'next-intl';

import Link from 'next/link';
import Typography from '@/components/atoms/typography';
import Badge from '@/components/atoms/badge';
import LandingAppBar from '@/components/organisms/landing-appbar';

export default function CondicionesPage() {
	const t = useTranslations();

	return (
		<div className="roboto p-4">
			<LandingAppBar />
			<div className="max-w-[900px] mt-4 rounded-lg p-4 ml-auto mr-auto font-body">
				<Typography component="h1" size="xl" className="uppercase">
					{t('terms.title')}
				</Typography>

				<Badge label={t('terms.lastUpdate')} />

				<Typography className="mt-4 mb-3" component="h2" size="lg">
					{t('terms.object.title')}
				</Typography>

				<Typography className="mb-3">
					{t('terms.object.text')}
				</Typography>

				<Typography className="mt-4 mb-3" component="h2" size="lg">
					{t('terms.account.title')}
				</Typography>

				<Typography className="mb-3">
					{t('terms.account.intro')}
				</Typography>

				<ul className="list-disc pl-6 mb-3">
					<li>{t('terms.account.password')}</li>
					<li>{t('terms.account.info')}</li>
					<li>{t('terms.account.images')}</li>
				</ul>

				<Typography className="mt-4 mb-3" component="h2" size="lg">
					{t('terms.liability.title')}
				</Typography>

				<Typography className="mb-3">
					{t('terms.liability.intro')}
				</Typography>

				<ul className="list-disc pl-6 mb-3">
					<li>{t('terms.liability.content')}</li>
					<li>{t('terms.liability.availability')}</li>
					<li>{t('terms.liability.guest')}</li>
				</ul>

				<Typography className="mt-4 mb-3" component="h2" size="lg">
					{t('terms.conduct.title')}
				</Typography>

				<Typography className="mb-3">
					{t('terms.conduct.text')}
				</Typography>

				<Typography className="mt-4 mb-3" component="h2" size="lg">
					{t('terms.changes.title')}
				</Typography>

				<Typography className="mb-3">
					{t('terms.changes.text')}
				</Typography>

				<Typography className="mt-4 mb-3" component="h2" size="lg">
					{t('terms.law.title')}
				</Typography>

				<Typography className="mb-3">{t('terms.law.text')}</Typography>
			</div>
		</div>
	);
}
