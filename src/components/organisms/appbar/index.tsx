import IconOpenInNew from '@/components/atoms/icon/open-in-new';
import ButtonLink from '@/components/molecules/button-link';
import AppBarUser from '../appbar-user';
import AppbarTitle from '@/components/atoms/appbar-title';

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
				<ButtonLink
					className="hidden gap-1 md:flex shrink-0"
					color="primary"
					iconRight={<IconOpenInNew />}
					label={accommodationName}
					href={accommodationHref}
					target="_blank"
				/>
			)}
			{isLogged && <AppBarUser />}
		</div>
	);
};

export default AppBar;
