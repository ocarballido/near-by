import { LODGING_CATEGORY_ID } from '@/config/config-constants';
import AddPlaceForm from '@/components/organisms/form/place';

type PageProps = {
	params: Promise<{ modalSlug: string[] }>; // params es un Promise
};

export default async function ModalPage({ params }: PageProps) {
	const { modalSlug } = await params;
	const [, propertyId, categoryId] = modalSlug;

	const isLodging = categoryId === LODGING_CATEGORY_ID;

	return (
		<>
			{isLodging ? (
				<p>Formulario para Property Info</p>
			) : (
				<AddPlaceForm propertyId={propertyId} categoryId={categoryId} />
			)}
		</>
	);
}
