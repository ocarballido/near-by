import { useTranslations } from 'next-intl';

import Link from 'next/link';
import LandingAppBar from '@/components/organisms/landing-appbar';
import Typography from '@/components/atoms/typography';
import Badge from '@/components/atoms/badge';

export default function PrivacidadPage() {
	const t = useTranslations();

	return (
		<div className="roboto p-4">
			<LandingAppBar />
			<div className="max-w-[900px] mt-4 rounded-lg p-4 ml-auto mr-auto font-body">
				<Typography component="h1" size="xl" className="uppercase">
					{t('privacyPolicy.title')}
				</Typography>

				<Badge label={t('privacyPolicy.lastUpdate')} />

				<Typography className="mt-4">
					{t.rich('privacyPolicy.intro', {
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
				</Typography>

				<Typography className="mt-4 mb-3" component="h2" size="lg">
					{t('privacyPolicy.sections.controller.title')}
				</Typography>

				<ul className="list-disc pl-6 mb-3">
					<li>{t('privacyPolicy.sections.controller.identity')}</li>
					<li>{t('privacyPolicy.sections.controller.email')}</li>
					<li>{t('privacyPolicy.sections.controller.activity')}</li>
				</ul>

				<Typography className="mt-4 mb-3" component="h2" size="lg">
					{t('privacyPolicy.sections.dataCollection.title')}
				</Typography>

				<Typography className="mb-3">
					{t('privacyPolicy.sections.dataCollection.intro')}
				</Typography>

				<Typography className="mt-4 mb-3" component="h3" size="base">
					{t('privacyPolicy.sections.dataCollection.hosts.title')}
				</Typography>

				<ul className="list-disc pl-6 mb-3">
					<li>
						{t('privacyPolicy.sections.dataCollection.hosts.data')}
					</li>
					<li>
						{t(
							'privacyPolicy.sections.dataCollection.hosts.purpose',
						)}
					</li>
					<li>
						{t(
							'privacyPolicy.sections.dataCollection.hosts.communications',
						)}
					</li>
				</ul>

				<Typography className="mt-4 mb-3" component="h3" size="base">
					{t('privacyPolicy.sections.dataCollection.guests.title')}
				</Typography>

				<ul className="list-disc pl-6 mb-3">
					<li>
						{t('privacyPolicy.sections.dataCollection.guests.data')}
					</li>
				</ul>

				<Typography className="mt-4 mb-3" component="h3" size="base">
					{t('privacyPolicy.sections.dataCollection.content.title')}
				</Typography>

				<ul className="list-disc pl-6 mb-3">
					<li>
						{t(
							'privacyPolicy.sections.dataCollection.content.text',
						)}
					</li>
				</ul>

				<Typography className="mt-4 mb-3" component="h2" size="lg">
					{t('privacyPolicy.sections.legalBasis.title')}
				</Typography>

				<Typography className="mb-3">
					{t('privacyPolicy.sections.legalBasis.intro')}
				</Typography>

				<ul className="list-disc pl-6 mb-3">
					<li>{t('privacyPolicy.sections.legalBasis.consent')}</li>
					<li>{t('privacyPolicy.sections.legalBasis.service')}</li>
				</ul>

				<Typography className="mt-4 mb-3" component="h2" size="lg">
					{t('privacyPolicy.sections.recipients.title')}
				</Typography>

				<Typography className="mb-3">
					{t('privacyPolicy.sections.recipients.intro')}
				</Typography>

				<ul className="list-disc pl-6 mb-3">
					<li>
						{t.rich('privacyPolicy.sections.recipients.ga', {
							link: (chunks) => (
								<Link
									href="https://policies.google.com/privacy"
									target="_blank"
									rel="noopener noreferrer"
									className="underline text-primary-500 font-medium"
								>
									{chunks}
								</Link>
							),
						})}
					</li>
					<li>
						{t.rich('privacyPolicy.sections.recipients.mixpanel', {
							link: (chunks) => (
								<Link
									href="https://mixpanel.com/legal/privacy-policy"
									target="_blank"
									rel="noopener noreferrer"
									className="underline text-primary-500 font-medium"
								>
									{chunks}
								</Link>
							),
						})}
					</li>
					<li>
						{t.rich('privacyPolicy.sections.recipients.hosting', {
							link: (chunks) => (
								<Link
									href="https://vercel.com/legal/privacy-policy"
									target="_blank"
									rel="noopener noreferrer"
									className="underline text-primary-500 font-medium"
								>
									{chunks}
								</Link>
							),
						})}
					</li>
					<li>
						{t('privacyPolicy.sections.recipients.authorities')}
					</li>
				</ul>

				<Typography className="mt-4 mb-3" component="h2" size="lg">
					{t('privacyPolicy.sections.retention.title')}
				</Typography>

				<Typography className="mb-3">
					{t('privacyPolicy.sections.retention.text')}
				</Typography>

				<Typography className="mt-4 mb-3" component="h2" size="lg">
					{t('privacyPolicy.sections.rights.title')}
				</Typography>

				<Typography className="mb-3">
					{t('privacyPolicy.sections.rights.intro')}
				</Typography>

				<ul className="list-disc pl-6 mb-3">
					<li>{t('privacyPolicy.sections.rights.access')}</li>
					<li>{t('privacyPolicy.sections.rights.limitation')}</li>
					<li>{t('privacyPolicy.sections.rights.portability')}</li>
					<li>{t('privacyPolicy.sections.rights.contact')}</li>
				</ul>

				<Typography className="mt-4 mb-3" component="h2" size="lg">
					{t('privacyPolicy.sections.hostResponsibility.title')}
				</Typography>

				<Typography className="mb-3">
					{t('privacyPolicy.sections.hostResponsibility.text')}
				</Typography>

				<Typography className="mt-4 mb-3" component="h2" size="lg">
					{t('privacyPolicy.sections.security.title')}
				</Typography>

				<Typography className="mb-3">
					{t('privacyPolicy.sections.security.text')}
				</Typography>

				<Typography className="mt-4 mb-3" component="h2" size="lg">
					{t('privacyPolicy.sections.changes.title')}
				</Typography>

				<Typography className="mb-3">
					{t('privacyPolicy.sections.changes.text')}
				</Typography>
			</div>
		</div>
	);
}
