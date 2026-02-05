import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { getLocale } from 'next-intl/server';
import { createSSRClient } from '@/lib/supabase/server';
import { createServerAdminClient } from '@/lib/supabase/serverAdminClient';

import Image from 'next/image';
import ButtonLink from '../button-link';
import Button from '../button';
import IconAdd from '@/components/atoms/icon/add';
import { trackEvent } from '@/lib/analytics/mixpanel';
import { ShareMenu } from '../button-share';
import CreatePropertyEntry from '../property-entry';
import BadgeCheck from '@/components/atoms/BadgeCheck';
import IconError from '@/components/atoms/icon/error';
import IconOpenInNew from '@/components/atoms/icon/open-in-new';
import Typography from '@/components/atoms/typography';
import IconApartment from '@/components/atoms/icon/apartment';

import { formatRelativeDays } from '@/utils/format-relative-days';
import IconCheck from '@/components/atoms/icon/check';

type PropertyForCounts = {
	id: string;
	name: string;
	updated_at: string | null;
	property_data: { type: string | null }[] | null;
};

const PropertyNumber = async () => {
	const t = await getTranslations();
	const locale = await getLocale();

	const ssrClient = await createSSRClient();
	const {
		data: { user },
		error: authError,
	} = await ssrClient.auth.getUser();

	if (authError || !user) redirect('/auth/login');

	const supabase = await createServerAdminClient();

	const { data, error } = await supabase
		.from('properties')
		.select(
			`
			id,
			name,
			updated_at,
			property_data ( type )
		`,
		)
		.eq('user_id', user.id)
		.overrideTypes<PropertyForCounts[], { merge: false }>();

	if (error) {
		throw new Error('Error cargando propiedades: ' + error.message);
	}

	const rows = data ?? [];

	const lastEdited = rows
		.filter((p) => p.updated_at)
		.sort(
			(a, b) =>
				new Date(b.updated_at as string).getTime() -
				new Date(a.updated_at as string).getTime(),
		)[0];

	const completedCount = rows.reduce((acc, p) => {
		const types = (p.property_data ?? []).map((x) =>
			(x?.type ?? '').toString().trim().toLowerCase(),
		);

		const hasLocation = types.includes('location');
		const hasInfo = types.includes('info');

		const isCompleted = hasLocation && hasInfo;

		return acc + (isCompleted ? 1 : 0);
	}, 0);

	const n = rows.length;
	const incompleteCount = n - completedCount;

	await trackEvent({
		event: 'onboarding_start',
		distinctId: user.id,
		props: { page: 'dashboard_home' },
	});

	return (
		<>
			<div className="flex flex-col gap-1 items-center px-4 py-8 rounded-xl bg-white shadow-xs w-full max-w-xs">
				<div className="relative">
					<Image
						alt="Add property"
						src="/static/img/star.svg"
						height={120}
						width={120}
					/>
					<div className="absolute top-[50%] w-full -translate-y-4 font-bold text-3xl text-white text-center">
						{n}
					</div>
				</div>
				<Typography component="h3" size="lg">
					{n === 1 ? t('Propiedad') : t('Propiedades')}
				</Typography>
				{n > 0 ? (
					<div className="flex items-center justify-center gap-1 w-full">
						<BadgeCheck
							checkedColor="primary"
							checked
							label={`${t('propertiesStatus.completed')}: ${completedCount}`}
						/>
						<BadgeCheck
							checkedColor="error"
							checked
							iconChecked={<IconError color="error" size={20} />}
							label={`${t('propertiesStatus.inProgress')}: ${incompleteCount}`}
						/>
					</div>
				) : null}
				{n > 0 ? (
					<ButtonLink
						label={t('Mis propiedades')}
						href="/app/properties"
						iconLeft={<IconApartment />}
						color="secondary"
						className="w-fit"
					/>
				) : null}
			</div>

			<div className="flex flex-col justify-center items-center gap-1 grow-0 p-1 bg-gray-200 rounded-3xl">
				<CreatePropertyEntry
					href="/app/properties/new"
					link={
						<ButtonLink
							label={
								n > 0
									? t('Nueva propiedad')
									: t('Añadir propiedad')
							}
							href="/app/properties/new"
							iconLeft={<IconAdd />}
							className="w-full flex"
						/>
					}
					action={
						<Button
							label={
								n > 0
									? t('Nueva propiedad')
									: t('Añadir propiedad')
							}
							iconLeft={<IconAdd />}
							className="w-full flex"
						/>
					}
				/>
				<ButtonLink
					label={t('page_home.pilotHouseAction')}
					href="https://www.bnbexplorer.com/es/public/37a03a95-cd39-4d40-a22b-7628cbb50245/welcome/highlights"
					iconRight={<IconOpenInNew />}
					color="white"
					className="w-fit"
					target="_blank"
				/>
			</div>
			{lastEdited?.updated_at ? (
				<div className="flex flex-col items-center text-center">
					<Typography component="h3" size="lg">
						{t('lastActivity.title')}
					</Typography>
					<BadgeCheck
						checked
						iconChecked={<IconCheck color="success" />}
						label={t('lastActivity.edited', {
							property: lastEdited.name,
							time: formatRelativeDays(
								lastEdited.updated_at,
								locale,
							),
						})}
					/>
				</div>
			) : null}
			<div className="flex flex-col items-center">
				<Typography component="h3" size="lg">
					{t('shareButtonTitle')}
				</Typography>
				<p className="mb-3">{t('shareButtonText')}</p>
				<ShareMenu
					url="https://bnbexplorer.com"
					surface="landing_header"
					distinctId={user.id}
				/>
			</div>
		</>
	);
};

export default PropertyNumber;
