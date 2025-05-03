import WelcomeProfile from '@/components/molecules/welcome-profile';
import AppContentTemplate from '@/components/templates/app-content';

export default function Profile() {
	return (
		<AppContentTemplate>
			<div className="p-4 font-roboto flex flex-col grow gap-6 bg-white rounded-lg overflow-hidden justify-center items-center">
				<WelcomeProfile />
			</div>
		</AppContentTemplate>
	);
}
