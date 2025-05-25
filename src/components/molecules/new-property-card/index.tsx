import { useTranslations } from 'next-intl';

import Image from 'next/image';
import Link from 'next/link';

const NewPropertyCard = () => {
	const t = useTranslations();

	return (
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
	);
};

export default NewPropertyCard;
