'use client';

import { useLoading } from '@/lib/context/LoadingContext';

import Spinner from '@/components/atoms/spinner';

export default function PublicLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const { loading } = useLoading();

	return (
		<>
			{loading && <Spinner />}
			<div className="p-4 flex flex-col gap-2 items-stretch w-full min-h-screen bg-gray-100 font-body overflow-hidden">
				{children}
			</div>
		</>
	);
}
