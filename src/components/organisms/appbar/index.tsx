import IconOpenInNew from '@/components/atoms/icon/open-in-new';
import ButtonLink from '@/components/molecules/button-link';
import AppBarUser from '../appbar-user';
import AppbarTitle from '@/components/atoms/appbar-title';
import ButtonQr from '@/components/molecules/button-qr';

type AppBarProps = {
	className?: string;
	isLogged: boolean;
	accommodationHref?: string;
	accommodationName?: string;
};

const AppBar = ({
	className = '',
	accommodationHref = '',
	accommodationName = '',
	isLogged = false,
}: AppBarProps) => {
	return (
		<div
			className={`w-full flex items-center gap-4 rounded-lg p-4 relative bg-primary-700 transition-all ${className}`}
		>
			<AppbarTitle />
			{accommodationHref && (
				<div className="hidden md:flex gap-1">
					<ButtonLink
						className="gap-1 shrink-0"
						color="primary"
						iconRight={<IconOpenInNew />}
						label={accommodationName}
						href={accommodationHref}
						target="_blank"
					/>
					<ButtonQr
						url={`https://www.bnbexplorer.com${accommodationHref}`}
					/>
				</div>
			)}
			{isLogged && <AppBarUser />}
		</div>
	);
};

export default AppBar;
