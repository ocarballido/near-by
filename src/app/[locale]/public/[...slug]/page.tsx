type PageProps = {
	params: Promise<{ slug: string[] }>; // params es un Promise
};

export default async function Property({ params }: PageProps) {
	// const t = useTranslations();

	const { slug } = await params;
	const [propertySlug] = slug;

	return (
		<>
			<p>Página pública</p>
			{propertySlug}
		</>
	);
}
