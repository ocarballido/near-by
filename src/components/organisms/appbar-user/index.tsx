import LanguageSelector from '@/components/molecules/language-selector';
import UserMenu from '@/components/molecules/user-menu';

type AppBarUserProps = {
	className?: string;
};

const AppBarUser = ({ className = '' }: AppBarUserProps) => {
	return (
		<div className={`flex gap-1 ml-auto ${className}`}>
			<LanguageSelector />
			<UserMenu />
		</div>
	);
};

export default AppBarUser;
