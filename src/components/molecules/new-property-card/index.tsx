import { useTranslations } from 'next-intl';

import Image from 'next/image';
import Link from 'next/link';
import CreatePropertyEntry from '../property-entry';

const NewPropertyCard = () => {
	const t = useTranslations();

	return (
		<CreatePropertyEntry
			href="/app/properties/new"
			link={
				<Link
					className="flex flex-col gap-2 bg-primary-100 rounded-xl justify-center items-center hover:bg-primary-400 transition-all pb-6"
					href="/app/properties/new"
				>
					<Image
						alt="Add property"
						src="/static/img/add-property.webp"
						height={184}
						width={248}
					/>
					<p className="font-heading font-bold">
						{t('Nueva Propiedad').toUpperCase()}
					</p>
				</Link>
			}
			action={
				<div className="flex flex-col gap-2 h-full bg-primary-100 rounded-xl justify-center items-center hover:bg-primary-400 transition-all pb-6 hover:cursor-pointer">
					<Image
						alt="Add property"
						src="/static/img/add-property.webp"
						height={184}
						width={248}
					/>
					<p className="font-heading font-bold">
						{t('Nueva Propiedad').toUpperCase()}
					</p>
				</div>
			}
		/>
	);
};

export default NewPropertyCard;
