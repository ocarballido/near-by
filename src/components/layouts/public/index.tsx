'use client';

import { useLoading } from '@/lib/context/LoadingContext';

import Spinner from '@/components/atoms/spinner';
import PublicPageBanner from '@/components/molecules/public-page-banner';

export default function PublicLayout({
	children,
	isLoggedIn,
}: {
	children: React.ReactNode;
	isLoggedIn: boolean;
}) {
	const { loading } = useLoading();

	return (
		<>
			{loading && <Spinner />}
			<PublicPageBanner
				authHref="/auth/magic-link"
				isLoggedIn={isLoggedIn}
			/>
			<div className="p-2 flex flex-col gap-2 items-stretch w-full min-h-screen bg-[#EFEFEF] font-body overflow-hidden">
				{children}
			</div>
		</>
	);
}
