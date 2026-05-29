type DashboardDataProps = {
	label: React.ReactNode;
	action: React.ReactNode;
};

const DashboardData = ({ label, action }: DashboardDataProps) => {
	return (
		<div className="flex flex-wrap gap-2 items-center w-full">
			<div className="shrink-0">{label}</div>
			<div
				className="flex-1 h-1 opacity-40 min-w-8"
				style={{
					backgroundImage:
						'radial-gradient(circle, currentColor 1.5px, transparent 1.5px)',
					backgroundSize: '8px 4px',
					backgroundRepeat: 'repeat-x',
					backgroundPosition: 'center',
				}}
			/>
			<div className="shrink-0">{action}</div>
		</div>
	);
};

export default DashboardData;
