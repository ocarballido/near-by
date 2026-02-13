import AddPropertyForm from '@/components/organisms/form/property';
import FirstPropertyBanner from '@/components/organisms/first-property-banner';

type PageProps = {
	searchParams?: Promise<{ fromAuth?: string }>;
};

export default async function NewProperty({ searchParams }: PageProps) {
	const { fromAuth } = searchParams ? await searchParams : {};

	const showFirstTimeMsg = fromAuth === '1';

	console.log(fromAuth);
	console.log(showFirstTimeMsg);

	return (
		<div className="p-4 font-roboto flex flex-col grow gap-4 rounded-lg overflow-hidden justify-center items-center relative">
			{showFirstTimeMsg && <FirstPropertyBanner />}
			<AddPropertyForm />
		</div>
	);
}
