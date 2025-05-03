import clsx from 'clsx';

type SkeletonProps = {
	className?: string;
	height?: string;
	rounded?: boolean;
	width?: string;
};

const Skeleton = ({
	rounded = false,
	className = '',
	height = '1rem',
	width = '100%',
}: SkeletonProps) => {
	const skeletonStyles = clsx(
		{ 'rounded-md': !rounded },
		{ 'rounded-full': rounded }
	);

	return (
		<div
			className={`flex bg-black/10 animate-pulse ${skeletonStyles} ${className}`}
			style={{ height, width }}
		></div>
	);
};

export default Skeleton;
