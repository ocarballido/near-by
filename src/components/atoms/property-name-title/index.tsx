import { useTranslations } from 'next-intl';

import Typography from '../typography';

type PropertyNameTitleProps = {
	propertyName?: string;
	subCategoryName?: string;
};

const PropertyNameTitle = ({
	propertyName,
	subCategoryName,
}: PropertyNameTitleProps) => {
	const t = useTranslations();

	return (
		<div className="flex gap-1">
			<Typography component="h3" size="lg">
				{propertyName ? `${propertyName}: ` : null}
				{subCategoryName && t(subCategoryName)}
			</Typography>
		</div>
	);
};

export default PropertyNameTitle;
