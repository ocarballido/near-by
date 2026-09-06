type CarouselSlideProps = {
    children: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
};

export function CarouselSlide({
    children,
    className = "",
    style,
}: CarouselSlideProps) {
    return (
        <div
            style={{
                position: "relative",
                height: "100%",
                minWidth: "100%",
                flex: "0 0 100%",
                ...style,
            }}
            className={className}
        >
            {children}
        </div>
    );
}
