type PlaceTooltipProps = {
	className: string;
	label: string;
};

const PlaceTooltip = ({ className, label }: PlaceTooltipProps) => {
	return (
		<div className={`flex flex-col items-center ${className}`}>
			<p className="px-4 py-2 bg-white rounded-md shadow-lg">{label}</p>
			<span className="w-0 h-0 border-l-[12px] border-r-[12px] border-t-[12px] border-l-transparent border-r-transparent border-t-white"></span>
			<div className="w-5 h-5 bg-white/20 rounded-full mt-1 flex justify-center items-center animate-ping">
				<div className="w-2 h-2 bg-white rounded-full"></div>
			</div>
		</div>
	);
};

export default PlaceTooltip;
