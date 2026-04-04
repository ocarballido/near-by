'use client';

import { createContext, useContext, useState } from 'react';
import { CategoryWithSubCategories } from '@/types/db';

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
	subCategoryCounts: Record<string, number>;
	setSubCategoryCounts: (counts: Record<string, number>) => void;
	incrementCount: (subCategoryId: string) => void;
	decrementCount: (subCategoryId: string) => void;
};

const EditMenuContext = createContext<EditMenuContextType | undefined>(
	undefined,
);

export const EditMenuProvider = ({
	children,
	initialData,
	initialCounts = {},
}: {
	children: React.ReactNode;
	initialData: CategoryWithSubCategories[];
	initialCounts?: Record<string, number>;
}) => {
	const [sidebarData, setSidebarData] = useState(initialData);
	const [activeCategoryId, setActiveCategoryId] = useState<string | null>(
		null,
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
	const [subCategoryCounts, setSubCategoryCounts] =
		useState<Record<string, number>>(initialCounts);

	const resetSidebarState = () => {
		setActiveCategoryId(null);
		setActiveSubCategoryId(null);
		setActiveSubCategoryType(null);
		setActiveSubCategoryName(null);
	};

	const incrementCount = (subCategoryId: string) => {
		setSubCategoryCounts((prev) => ({
			...prev,
			[subCategoryId]: (prev[subCategoryId] ?? 0) + 1,
		}));
	};

	const decrementCount = (subCategoryId: string) => {
		setSubCategoryCounts((prev) => ({
			...prev,
			[subCategoryId]: Math.max(0, (prev[subCategoryId] ?? 0) - 1),
		}));
	};

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
				subCategoryCounts,
				setSubCategoryCounts,
				incrementCount,
				decrementCount,
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
