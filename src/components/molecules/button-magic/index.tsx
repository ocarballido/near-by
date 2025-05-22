import IconStarShine from '@/components/atoms/icon/star-shine';

type ButtonMagicProps = {
	className?: string;
	label: string;
	disabled?: boolean;
	onClick?: () => void;
};

const ButtonMagic = ({
	className,
	disabled,
	label,
	onClick,
}: ButtonMagicProps) => {
	return (
		<div className={`relative ${className}`}>
			<span className="absolute top-[-2px] left-[-2px] w-[calc(100%+4px)] h-[calc(100%+4px)] bg-gradient-to-tr from-[#FF6B06] to-[#31C48D] rounded-full opacity-60"></span>
			<button
				className="w-full pl-0.5 pr-4 py-0.5 rounded-full flex justify-start items-center ml-auto mr-auto relative bg-white  gap-2 font-medium *:bg-gradient-to-tr *:from-[#FF6B06] *:to-[#31C48D] hover:*:animate-spin disabled:opacity-30 disabled:pointer-events-none hover:cursor-pointer"
				disabled={disabled}
				onClick={onClick}
			>
				<div className="p-2 rounded-full">
					<IconStarShine color="white" size={20} />
				</div>
				{label}
			</button>
		</div>
	);
};

export default ButtonMagic;
