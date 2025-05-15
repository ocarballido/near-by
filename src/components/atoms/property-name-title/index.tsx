'use client';

import { useMemo } from 'react';

interface SidebarItem {
	id: string;
	label: string;
	href: string;
}

type PropertyNameTitleProps = {
	subcategories: SidebarItem[];
	subcategoryId: string;
	propertyName: string;
};

const PropertyNameTitle = ({
	subcategories,
	subcategoryId,
	propertyName,
}: PropertyNameTitleProps) => {
	const subcategoryLabel: string | null = useMemo(() => {
		if (!subcategoryId) {
			return subcategories[0].label;
		}

		const found = subcategories.find(
			(subcat) => subcat.id === subcategoryId
		);
		return found ? found.label : null;
	}, [subcategories, subcategoryId]);

	return (
		<>
			<h3 className="font-heading font-bold text-lg md:text-2xl">
				{propertyName}: {subcategoryLabel}
			</h3>
		</>
	);
};

export default PropertyNameTitle;
