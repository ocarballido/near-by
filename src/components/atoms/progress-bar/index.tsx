type ProgressBarProps = {
	progress: string;
};

const ProgressBar = ({ progress }: ProgressBarProps) => {
	return (
		<div className="h-[6px] w-full bg-secondary-200 rounded-full">
			<div
				className={`h-[6px] bg-primary-400 rounded-full`}
				style={{ width: `${progress}%` }}
			></div>
		</div>
	);
};

export default ProgressBar;
