import AppContentTemplate from '@/components/templates/app-content';
import PropertyNumber from '@/components/molecules/property-number';

type PageProps = {
	searchParams?: Promise<{ fromAuth?: string }>;
};

export default async function DashboardContent({ searchParams }: PageProps) {
	const { fromAuth } = (await searchParams) ?? {};
	const shouldForceFirstProperty = fromAuth === '1';

	console.log(fromAuth);

	return (
		<AppContentTemplate>
			<div className="p-4 font-roboto flex flex-col grow justify-center items-center gap-8 rounded-lg overflow-hidden">
				<PropertyNumber
					shouldForceFirstProperty={shouldForceFirstProperty}
				/>
			</div>
		</AppContentTemplate>
	);
}
