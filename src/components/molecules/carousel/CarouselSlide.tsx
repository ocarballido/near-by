type CarouselSlideProps = {
	children: React.ReactNode;
	className?: string;
};

export function CarouselSlide({
	children,
	className = '',
}: CarouselSlideProps) {
	return (
		<div style={{ flex: '0 0 100%', minWidth: 0 }} className={className}>
			{children}
		</div>
	);
}
