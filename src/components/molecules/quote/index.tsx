import Image from 'next/image';

type QuoteProps = {
	title?: string;
	body: string;
	person?: string;
	image: string;
	className?: string;
	isFeatured?: boolean;
};

const Quote = ({
	title,
	body,
	person = '',
	image = '',
	className,
	isFeatured = false,
}: QuoteProps) => {
	return (
		<div
			className={`flex flex-col gap-4 p-4 rounded-lg bg-white shadow-xl ${className}`}
		>
			{isFeatured ? (
				<div className="w-[100px] h-[100px] rounded-full border-8 border-primary-200 overflow-hidden">
					<Image
						alt={person}
						src={image}
						sizes="100vw"
						width={300}
						height={300}
						style={{
							width: '100%',
							height: 'auto',
						}}
					/>
				</div>
			) : (
				<div className="w-[64px] h-[64px] rounded-full border-8 border-primary-200 overflow-hidden">
					<Image
						alt={person}
						src={image}
						width={300}
						height={300}
						sizes="100vw"
						style={{
							width: '100%',
							height: 'auto',
						}}
					/>
				</div>
			)}
			{title && <p className="font-body font-medium">{title}</p>}
			<p className="font-body opacity-70">{body}</p>
			{person && <p className="font-bold text-lg">{person}</p>}
		</div>
	);
};

export default Quote;
