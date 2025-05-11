import Image from 'next/image';

import addProperty from '../../../../../../public/static/img/add-property-2x.webp';

import AddPropertyForm from '@/components/organisms/form/property';
import AppContentTemplate from '@/components/templates/app-content';

export default function NewProperty() {
	// const t = useTranslations();

	return (
		<AppContentTemplate>
			<div className="p-4 font-roboto flex flex-col justify-center items-center grow gap-4 bg-white rounded-lg overflow-hidden">
				<Image
					alt="Add property"
					src={addProperty}
					height={184}
					width={248}
				/>
				<AddPropertyForm />
			</div>
		</AppContentTemplate>
	);
}
