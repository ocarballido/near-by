import Image from 'next/image';

import addProperty from '../../../../../../public/static/img/add-property-2x.webp';

import AddPropertyForm from '@/components/organisms/form/property';

export default function NewProperty() {
	return (
		<div className="p-4 font-roboto flex flex-col grow gap-4 bg-white rounded-lg overflow-hidden justify-center items-center">
			<Image
				alt="Add property"
				src={addProperty}
				height={184}
				width={248}
			/>
			<AddPropertyForm />
		</div>
	);
}
