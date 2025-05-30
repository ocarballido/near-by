import Image from 'next/image';
import clsx from 'clsx';

type SpinnerProps = {
	position?: 'absolute' | 'fixed';
};

const Spinner = ({ position = 'absolute' }: SpinnerProps) => {
	const spinnerStyles = clsx(
		{ fixed: position === 'fixed' },
		{ 'absolute top-0 bottom-0 left-0 right-0': position === 'absolute' }
	);

	return (
		<div
			className={`flex flex-wrap z-50 items-center justify-center w-full h-full bg-gray-100/80 ${spinnerStyles}`}
		>
			<div className="relative">
				<Image
					src="/static/icons/sping.svg"
					alt="Spinner"
					height={48}
					width={48}
					className="animate-spin"
				/>
				<div className="absolute w-full h-full top-0 flex flex-wrap items-center justify-center">
					<Image
						src="/static/img/icon-gradient.webp"
						alt="Spinner"
						height={28}
						width={28}
					/>
				</div>
			</div>
		</div>
	);
};

export default Spinner;
