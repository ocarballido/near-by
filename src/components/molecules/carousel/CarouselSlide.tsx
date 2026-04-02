type CarouselSlideProps = {
	children: React.ReactNode;
	className?: string;
};

export function CarouselSlide({
	children,
	className = '',
}: CarouselSlideProps) {
	return (
		<div
			style={{
				position: 'relative',
				height: '100%',
				minWidth: '100%',
				flex: '0 0 100%',
			}}
			className={className}
		>
			{children}
		</div>
	);
}
