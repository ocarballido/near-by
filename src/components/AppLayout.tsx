'use client';
import React, { useState } from 'react';
import clsx from 'clsx';

import { useTranslations } from 'next-intl';
import { useGlobal } from '@/lib/context/GlobalContext';
import { usePathname } from 'next/navigation';
import { useMemo } from 'react';

import { createSPASassClient } from '@/lib/supabase/client';
import { sidebarUrlMapped } from '@/utils/sidebar-map';
import { pageTitleMapped } from '@/utils/page-title-mapped';

import AppBar from './organisms/appbar';
import Button from './molecules/button';
import IconArrowLeftAlt from './atoms/icon/arrow-left-alt';
import IconArrowRightAlt from './atoms/icon/arrow-right-alt';

type ActiveView = 'CONTENT' | 'MENU';

export default function AppLayout({ children }: { children: React.ReactNode }) {
	const t = useTranslations();

	const [activeView, setActiveView] = useState<ActiveView>('CONTENT');

	const pathname = usePathname();

	const withSidebar = useMemo(() => sidebarUrlMapped(pathname), [pathname]);
	const withPapeTitle = useMemo(() => pageTitleMapped(pathname), [pathname]);

	const { user } = useGlobal();

	const handleLogout = async () => {
		try {
			const client = await createSPASassClient();
			await client.logout();
		} catch (error) {
			console.error('Error logging out:', error);
		}
	};

	const getInitials = (email: string) => {
		const parts = email.split('@')[0].split(/[._-]/);
		return parts.length > 1
			? (parts[0][0] + parts[1][0]).toUpperCase()
			: parts[0].slice(0, 2).toUpperCase();
	};

	const sidebarStyles = clsx(
		{ 'w-[calc(200%+16px)] md:w-full': withSidebar },
		{ 'translate-x-0': withSidebar && activeView === 'MENU' },
		{
			'-translate-x-[calc(50%+8px)]':
				withSidebar && activeView === 'CONTENT',
		}
	);

	return (
		<>
			<div className="p-4 flex flex-col gap-2 items-stretch w-full min-h-screen bg-gray-100 font-body overflow-hidden">
				<AppBar
					isLogged
					title={t(withPapeTitle.title)}
					userName={user ? getInitials(user.email) : '?'}
					logOut={handleLogout}
				/>
				<div
					className={`flex flex-auto gap-4 md:gap-2 min-h-full relative transition-all md:translate-x-0 ${sidebarStyles}`}
				>
					{withSidebar && (
						<div
							className={`w-full md:max-w-90 grow flex gap-2 flex-col`}
						>
							<Button
								label="Ver contenido"
								color="white"
								onClick={() => setActiveView('CONTENT')}
								iconRight={<IconArrowRightAlt />}
								className="md:hidden"
							/>
							Este es uno de los enlaces del sidebar
						</div>
					)}
					<div className="flex flex-col gap-2 w-full grow">
						<Button
							label="Ver menú"
							color="white"
							onClick={() => setActiveView('MENU')}
							iconLeft={<IconArrowLeftAlt />}
							className="md:hidden"
						/>

						<div className="flex w-full grow rounded-xl p-4">
							{children}
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
