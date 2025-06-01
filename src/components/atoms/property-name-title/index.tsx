type PropertyNameTitleProps = {
	propertyName: string;
	subCategoryName?: string;
};

const PropertyNameTitle = ({
	propertyName,
	subCategoryName,
}: PropertyNameTitleProps) => {
	return (
		<>
			<h3 className="font-heading font-bold text-lg md:text-2xl">
				{propertyName}:{' '}
				<span className="font-normal">{subCategoryName}</span>
			</h3>
		</>
	);
};

export default PropertyNameTitle;
