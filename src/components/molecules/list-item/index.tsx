type ListItemProps = {
	label: string;
	icon: React.ReactNode;
};

const ListItem = ({ label, icon }: ListItemProps) => {
	return (
		<div className="flex gap-2 w-full">
			<div className="shrink-0">{icon}</div>
			<p className="font-medium  w-full">{label}</p>
		</div>
	);
};

export default ListItem;
