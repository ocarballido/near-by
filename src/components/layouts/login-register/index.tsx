import Image from 'next/image';

type LayoutProps = {
	children: React.ReactNode;
};

const LoginRegisterLayout = ({ children }: LayoutProps) => {
	return (
		<div className="p-4 flex flex-col lg:flex-row w-full min-h-screen align bg-linear-270 from-primary-400 to-teal-600">
			<div className="w-full p-4 justify-center items-center hidden md:flex">
				<Image
					width={300}
					height={300}
					src="/static/img/illustrations/isometric-house.png"
					alt="House"
				/>
			</div>
			<div className="flex w-full grow bg-white rounded-xl p-4 justify-center items-center">
				{children}
			</div>
		</div>
	);
};

export default LoginRegisterLayout;
