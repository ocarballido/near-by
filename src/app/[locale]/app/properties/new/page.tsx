import AddPropertyForm from '@/components/organisms/form/property';

export default function NewProperty() {
	return (
		<div className="p-4 font-roboto flex flex-col grow gap-4 rounded-lg overflow-hidden justify-center items-center relative">
			<AddPropertyForm />
		</div>
	);
}
