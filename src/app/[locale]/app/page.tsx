import AppContentTemplate from '@/components/templates/app-content';
import PropertyNumber from '@/components/molecules/property-number';

export default function DashboardContent() {
	return (
		<AppContentTemplate>
			<div className="p-4 font-roboto flex flex-col grow justify-center items-center gap-8 rounded-lg overflow-hidden">
				<PropertyNumber />
			</div>
		</AppContentTemplate>
	);
}
