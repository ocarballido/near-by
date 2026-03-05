import { redirect } from 'next/navigation';
import { getTranslations, getLocale } from 'next-intl/server';
import { createSSRClient } from '@/lib/supabase/server';
import { createServerAdminClient } from '@/lib/supabase/serverAdminClient';

import Image from 'next/image';
import ButtonLink from '../button-link';
import Button from '../button';
import IconAdd from '@/components/atoms/icon/add';
import { ShareMenu } from '../button-share';
import CreatePropertyEntry from '../property-entry';
import BadgeCheck from '@/components/atoms/BadgeCheck';
import IconError from '@/components/atoms/icon/error';
import IconOpenInNew from '@/components/atoms/icon/open-in-new';
import Typography from '@/components/atoms/typography';
import IconApartment from '@/components/atoms/icon/apartment';

import { CATEGORIES_SUB_CATEGORIES } from '@/config/config-constants';

import { formatRelativeDays } from '@/utils/format-relative-days';
import IconArrowRightAlt from '@/components/atoms/icon/arrow-right-alt';

type Props = {
	shouldForceFirstProperty: boolean;
};

type PropertyRow = {
	id: string;
	name: string;
	updated_at: string | null;
	property_data: { type: string | null }[] | null;
};

const PropertyNumber = async ({ shouldForceFirstProperty }: Props) => {
	const t = await getTranslations();
	const locale = await getLocale();

	const ssrClient = await createSSRClient();
	const {
		data: { user },
		error: authError,
	} = await ssrClient.auth.getUser();

	if (authError || !user) redirect('/auth/login');

	const supabase = await createServerAdminClient();

	// Query rápida: ¿tiene al menos 1 propiedad?
	const { data: anyProperty, error: anyPropErr } = await supabase
		.from('properties')
		.select('id')
		.eq('user_id', user.id)
		.limit(1)
		.maybeSingle();

	if (anyPropErr)
		throw new Error('Error comprobando propiedades: ' + anyPropErr.message);

	// ✅ Sólo redirigimos si viene de login/registro
	if (shouldForceFirstProperty && !anyProperty) {
		redirect('/app/properties/new?fromAuth=1');
	}

	// ✅ Query completa (la que ya tenías) para poder calcular estados, última editada, etc.
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
		.overrideTypes<PropertyRow[], { merge: false }>();

	if (error) {
		throw new Error('Error cargando propiedades: ' + error.message);
	}

	const rows = data ?? [];

	let completedCount = 0;
	let lastEdited: { id: string; name: string; updated_at: string } | null =
		null;
	let lastEditedTs = -1;

	for (const p of rows) {
		// counts
		const types = (p.property_data ?? []).map((x) =>
			(x?.type ?? '').toString().trim().toLowerCase(),
		);

		const hasLocation = types.includes('location');
		const hasInfo = types.includes('info');
		if (hasLocation && hasInfo) completedCount++;

		// last activity
		if (p.updated_at) {
			const ts = new Date(p.updated_at).getTime();
			if (ts > lastEditedTs) {
				lastEditedTs = ts;
				lastEdited = {
					id: p.id,
					name: p.name,
					updated_at: p.updated_at,
				};
			}
		}
	}

	const n = rows.length;
	const incompleteCount = n - completedCount;

	return (
		<>
			<div className="flex flex-col gap-1 items-center px-4 py-8 pb-4 rounded-xl bg-white shadow-xs w-full max-w-xs">
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

				<div className="flex items-center justify-center gap-1 w-full">
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

				<ButtonLink
					label={t('Mis propiedades')}
					href="/app/properties"
					iconLeft={<IconApartment />}
					color="secondary"
					className="w-full"
				/>
			</div>

			<div className="flex flex-col justify-center items-center gap-1 grow-0 p-1 bg-gray-200 rounded-3xl w-full max-w-xs">
				<CreatePropertyEntry
					href="/app/properties/new"
					link={
						<ButtonLink
							label={t('Nueva propiedad')}
							href="/app/properties/new"
							iconLeft={<IconAdd />}
							className="w-full flex"
						/>
					}
					action={
						<Button
							label={t('Nueva propiedad')}
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
					className="w-full"
					target="_blank"
				/>
			</div>

			{lastEdited?.updated_at ? (
				<div className="flex flex-col items-center text-center">
					<Typography component="h3" size="lg" className="mb-1">
						{t('lastActivity.title')}
					</Typography>
					<ButtonLink
						label={t('lastActivity.edited', {
							property: lastEdited.name,
							time: formatRelativeDays(
								lastEdited.updated_at,
								locale,
							),
						})}
						color="secondary"
						href={`/app/properties/${lastEdited.id}/${CATEGORIES_SUB_CATEGORIES.LODGING.id}/${CATEGORIES_SUB_CATEGORIES.LODGING.SUB_CATEGORIES.MANUAL.id}`}
						iconRight={<IconArrowRightAlt />}
					/>
				</div>
			) : null}

			<div className="flex flex-col items-center">
				<Typography component="h3" size="lg">
					{t('shareButtonTitle')}
				</Typography>
				<Typography>{t('shareButtonText')}</Typography>
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
