type DashboardCardBodyProps = {
	children: React.ReactNode;
	className?: string;
};

const DashboardCardBody = ({
	children,
	className = '',
}: DashboardCardBodyProps) => {
	return (
		<div className={`p-4 flex flex-col gap-3 ${className}`}>{children}</div>
	);
};

export default DashboardCardBody;
