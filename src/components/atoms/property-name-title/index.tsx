'use client';

import { useSidebarData } from '@/lib/context/EditMenuContext';

type PropertyNameTitleProps = {
	propertyName: string;
};

const PropertyNameTitle = ({ propertyName }: PropertyNameTitleProps) => {
	const { activeSubCategoryName } = useSidebarData();

	return (
		<>
			<h3 className="font-heading font-bold text-lg md:text-2xl">
				{propertyName}: {activeSubCategoryName}
			</h3>
		</>
	);
};

export default PropertyNameTitle;
