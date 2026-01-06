import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { createSSRClient } from '@/lib/supabase/server';

import Image from 'next/image';
import ButtonLink from '../button-link';
import IconApartment from '@/components/atoms/icon/apartment';
import IconAdd from '@/components/atoms/icon/add';

const PropertyNumber = async () => {
	const t = await getTranslations();

	const supabase = await createSSRClient();
	const {
		data: { user },
		error: authError,
	} = await supabase.auth.getUser();

	if (authError || !user) {
		redirect('/auth/login');
	}

	const { count, error } = await supabase
		.from('properties')
		.select('id', { count: 'exact', head: true })
		.eq('user_id', user.id);

	if (error) {
		throw new Error('Error contando propiedades: ' + error.message);
	}

	const n = count ?? 0;

	return (
		<>
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
			<div className="w-full text-lg uppercase text-center font-bold inline mx-auto -mt-2 text-primary-500 font-heading">
				{n === 1 ? t('Propiedad') : t('Propiedades')}
			</div>
			<div className="flex flex-col justify-center sm:flex-row gap-2 w-full">
				{n > 0 ? (
					<ButtonLink
						label={t('Mis propiedades')}
						href="/app/properties"
						iconLeft={<IconApartment />}
						color="secondary"
						className="w-full sm:w-auto"
					/>
				) : null}
				<ButtonLink
					label={n > 0 ? t('Nueva propiedad') : t('Añadir propiedad')}
					href="/app/properties/new"
					iconLeft={<IconAdd />}
					className="w-full sm:w-auto"
				/>
			</div>
		</>
	);
};

export default PropertyNumber;
