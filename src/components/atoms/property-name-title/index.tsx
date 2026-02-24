import Typography from '../typography';

type PropertyNameTitleProps = {
	propertyName?: string;
	subCategoryName?: string;
};

const PropertyNameTitle = ({
	propertyName,
	subCategoryName,
}: PropertyNameTitleProps) => {
	return (
		<div className="flex gap-1">
			<Typography component="h3" size="lg">
				{propertyName ? `${propertyName}: ` : null}
				{subCategoryName}
			</Typography>
		</div>
	);
};

export default PropertyNameTitle;
