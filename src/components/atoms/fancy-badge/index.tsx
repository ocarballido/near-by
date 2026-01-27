import IconNewRelease from '../icon/new-releases';

type FancyBadgeProps = {
	firstText: string;
	secondText?: string;
};

const FancyBadge = ({
	firstText,
	secondText = 'Ready-to-go',
}: FancyBadgeProps) => {
	return (
		<div className="flex w-fit px-2 py-2 rounded-lg bg-white gap-2 shadow-sm items-center">
			<IconNewRelease color="warning" />
			<span className="font-heading text-warning-500 uppercase font-bold text-xs">
				{firstText}
			</span>
			<span className="font-heading text-warning-500 bg-warning-100 py-1 px-3 rounded-sm uppercase text-xs font-bold">
				{secondText}
			</span>
		</div>
	);
};

export default FancyBadge;
