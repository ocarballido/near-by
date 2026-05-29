type DashboardCardHeadingProps = {
	children: React.ReactNode;
};

const DashboardCardHeading = ({ children }: DashboardCardHeadingProps) => {
	return (
		<div className="p-4 flex gap-2 items-center border-b border-gray-100">
			{children}
		</div>
	);
};

export default DashboardCardHeading;
