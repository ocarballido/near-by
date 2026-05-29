type DashboardCardProps = {
	children: React.ReactNode;
	className?: string;
};

const DashboardCard = ({ children, className = '' }: DashboardCardProps) => {
	return (
		<div
			className={`flex flex-col justify-center gap-1 w-full max-w-3xl bg-white rounded-xl shadow-xs ${className}`}
		>
			{children}
		</div>
	);
};

export default DashboardCard;
