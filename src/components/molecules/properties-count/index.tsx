import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import Typography from '@/components/atoms/typography';
import ButtonLink from '@/components/molecules/button-link';
import IconApartment from '@/components/atoms/icon/apartment';
import CreatePropertyEntry from '@/components/molecules/property-entry';
import Button from '@/components/molecules/button';
import IconAdd from '@/components/atoms/icon/add';
import IconOpenInNew from '@/components/atoms/icon/open-in-new';

type Props = {
	totalCount: number;
};

const PropertiesCount = async ({ totalCount }: Props) => {
	const t = await getTranslations();

	return (
		<div className="flex flex-col gap-1 items-center px-4 py-8 pb-4 rounded-md bg-gradient-to-tr from-[#ffa263] to-[#6cffc9] w-full relative">
			<div className="relative max-w-4xl">
				<Image
					alt="Add property"
					src="/static/img/star-gradient.svg"
					height={120}
					width={120}
				/>
				<div className="absolute top-[50%] w-full -translate-y-4 font-bold text-3xl text-primary-400 text-center">
					<Typography component="h3" size="lg" color="text-white">
						{totalCount}
					</Typography>
				</div>
			</div>
			<Typography component="h3" size="lg" className="mb-4">
				{totalCount === 1 ? t('Propiedad') : t('Propiedades')}
			</Typography>

			<div className="flex flex-col xl:flex-row gap-1 w-full max-w-4xl">
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
					className="max-w-md mx-auto"
				/>
				<ButtonLink
					label={t('Mis propiedades')}
					href="/app/properties"
					iconLeft={<IconApartment />}
					color="white"
					className="w-full max-w-md mx-auto"
				/>
				<ButtonLink
					label={t('page_home.pilotHouseAction')}
					href="https://www.bnbexplorer.com/es/public/37a03a95-cd39-4d40-a22b-7628cbb50245/welcome/highlights"
					iconRight={<IconOpenInNew />}
					color="white"
					className="w-full max-w-md mx-auto"
					target="_blank"
				/>
			</div>
		</div>
	);
};

export default PropertiesCount;
