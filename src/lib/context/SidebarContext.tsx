'use client';

import React, {
	createContext,
	useContext,
	useState,
	ReactNode,
	useEffect,
} from 'react';
import { usePathname } from 'next/navigation';

export interface SidebarContextProps {
	isOpen: boolean;
	openSidebar: () => void;
	closeSidebar: () => void;
	toggleSidebar: () => void;
}

interface SidebarProviderProps {
	children: ReactNode;
}

const SidebarContext = createContext<SidebarContextProps | undefined>(
	undefined
);

export const SidebarProvider: React.FC<SidebarProviderProps> = ({
	children,
}) => {
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const pathname = usePathname();

	const openSidebar = (): void => setIsOpen(true);
	const closeSidebar = (): void => setIsOpen(false);
	const toggleSidebar = (): void => setIsOpen((prev) => !prev);

	useEffect(() => {
		if (isOpen) {
			closeSidebar();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [pathname]);

	useEffect(() => {
		const handleResize = () => {
			if (isOpen) closeSidebar();
		};

		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, [isOpen]);

	return (
		<SidebarContext.Provider
			value={{ isOpen, openSidebar, closeSidebar, toggleSidebar }}
		>
			{children}
		</SidebarContext.Provider>
	);
};

export const useSidebar = (): SidebarContextProps => {
	const context = useContext(SidebarContext);
	if (!context) {
		throw new Error('useSidebar must be used within a SidebarProvider');
	}
	return context;
};
