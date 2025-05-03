'use client';

import EmptyContentAction from '@/components/molecules/empty-content-action';

export interface PropertyInfo {
	id: string;
	category_id: string;
	title: string;
	content: string;
	created_at: string;
}

interface PropertyInfoProps {
	infos: PropertyInfo[];
}

export function PropertyInfoContent({ infos }: PropertyInfoProps) {
	if (infos.length === 0) {
		return <EmptyContentAction className="mt-12" />;
	}
	const info = infos[0];
	return info.content ? (
		<>
			<p className="mb-2 font-semibold">Información</p>
			<div>{info.content}</div>
		</>
	) : (
		<EmptyContentAction className="mt-12" />
	);
}
