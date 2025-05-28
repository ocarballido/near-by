type PropertyNameTitleProps = {
	propertyName: string;
};

const PropertyNameTitle = ({ propertyName }: PropertyNameTitleProps) => {
	return (
		<>
			<h3 className="font-heading font-bold text-lg md:text-2xl">
				{propertyName}
			</h3>
		</>
	);
};

export default PropertyNameTitle;
