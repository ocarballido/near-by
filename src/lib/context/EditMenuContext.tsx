'use client';

import {
	createContext,
	useContext,
	useState,
	// useEffect
} from 'react';
// import { usePathname } from 'next/navigation';

import { CategoryWithSubCategories } from '../types';

type EditMenuContextType = {
	sidebarData: CategoryWithSubCategories[];
	setSidebarData: (data: CategoryWithSubCategories[]) => void;
	activeSubCategoryId: string | null;
	setActiveSubCategoryId: (id: string | null) => void;
	activeSubCategoryType: string | null;
	setActiveSubCategoryType: (type: string | null) => void;
	activeCategoryId: string | null;
	setActiveCategoryId: (type: string | null) => void;
	activeSubCategoryName: string | null;
	setActiveSubCategoryName: (name: string | null) => void;
	resetSidebarState: () => void;
};

const EditMenuContext = createContext<EditMenuContextType | undefined>(
	undefined
);

export const EditMenuProvider = ({
	children,
	initialData,
}: {
	children: React.ReactNode;
	initialData: CategoryWithSubCategories[];
}) => {
	// const pathname = usePathname();

	const [sidebarData, setSidebarData] = useState(initialData);
	const [activeCategoryId, setActiveCategoryId] = useState<string | null>(
		null
	);
	const [activeSubCategoryType, setActiveSubCategoryType] = useState<
		string | null
	>(null);
	const [activeSubCategoryId, setActiveSubCategoryId] = useState<
		string | null
	>(null);
	const [activeSubCategoryName, setActiveSubCategoryName] = useState<
		string | null
	>(null);

	const resetSidebarState = () => {
		setActiveCategoryId(null);
		setActiveSubCategoryId(null);
		setActiveSubCategoryType(null);
		setActiveSubCategoryName(null);
	};

	// useEffect(() => {
	// 	const allowedPrefixes = [
	// 		'/app/info/',
	// 		'/app/location/',
	// 		'/app/magic-finder/',
	// 	];

	// 	const shouldKeepState = allowedPrefixes.some((prefix) =>
	// 		pathname.includes(prefix)
	// 	);

	// 	if (!shouldKeepState) {
	// 		resetSidebarState();
	// 	}
	// }, [pathname]);

	return (
		<EditMenuContext.Provider
			value={{
				sidebarData,
				setSidebarData,
				activeSubCategoryId,
				setActiveSubCategoryId,
				activeCategoryId,
				setActiveCategoryId,
				activeSubCategoryType,
				setActiveSubCategoryType,
				activeSubCategoryName,
				setActiveSubCategoryName,
				resetSidebarState,
			}}
		>
			{children}
		</EditMenuContext.Provider>
	);
};

export const useSidebarData = (): EditMenuContextType => {
	const context = useContext(EditMenuContext);
	if (!context)
		throw new Error('useSidebarData must be used within EditMenuProvider');
	return context;
};
