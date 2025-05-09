import Image from 'next/image';

import loginRegister from '../../../../public/static/img/login-register.webp';
import logo from '../../../../public/static/img/logo-color.webp';
import PlaceTooltip from '@/components/atoms/place-tooltip';

type LayoutProps = {
	children: React.ReactNode;
};

const LoginRegisterLayout = ({ children }: LayoutProps) => {
	return (
		<div className="flex flex-col lg:flex-row w-full min-h-screen align bg-gradient-to-tr from-[#FF6B06] to-[#31C48D]">
			<div className="w-full justify-center items-center hidden md:flex relative">
				<div className="w-full hidden lg:flex items-center justify-center relative">
					<PlaceTooltip
						label="Bar"
						className="absolute -translate-[50%] left-[25%] top-[20%]"
					/>
					<PlaceTooltip
						label="Souvenirs"
						className="absolute -translate-[50%] left-[10%] top-[50%]"
					/>
					<PlaceTooltip
						label="Hospital"
						className="absolute -translate-[50%] left-[15%] top-[80%]"
					/>
					<PlaceTooltip
						label="Emergencias"
						className="absolute -translate-[50%] right-[5%] top-[20%]"
					/>
					<PlaceTooltip
						label="Embajada"
						className="absolute -translate-[50%] right-[0] top-[50%]"
					/>
					<PlaceTooltip
						label="Cafetería"
						className="absolute -translate-[50%] right-[25%] top-[80%]"
					/>
					<Image
						alt="Mountains"
						src={loginRegister}
						sizes="100vw"
						style={{
							width: '100%',
							height: 'auto',
						}}
					/>
				</div>
			</div>
			<div className="pt-4 pr-4 pb-4 pl-4 lg:pl-0 w-full grow flex">
				<div className="flex flex-col grow bg-white rounded-xl p-4 justify-center items-center">
					<div className="mb-12">
						<Image
							alt="Mountains"
							src={logo}
							width={300}
							height={96}
						/>
					</div>
					{children}
				</div>
			</div>
		</div>
	);
};

export default LoginRegisterLayout;
