'use client';

import { useRouter } from 'next/navigation';

import EmptyContentAction from '@/components/molecules/empty-content-action';

type PropertiesContentEmptyProps = {
	url: string;
};

const PropertiesContentEmpty = ({ url }: PropertiesContentEmptyProps) => {
	const router = useRouter();

	return (
		<>
			<EmptyContentAction onClick={() => router.push(url)} />
		</>
	);
};

export default PropertiesContentEmpty;
