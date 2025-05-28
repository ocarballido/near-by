'use client';

import { createContext, useContext, useState } from 'react';

import { CategoryWithSubCategories } from '../types';

type EditPublicMenuContextType = {
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

const EditPublicMenuContext = createContext<
	EditPublicMenuContextType | undefined
>(undefined);

export const EditPublicMenuProvider = ({
	children,
	initialData,
}: {
	children: React.ReactNode;
	initialData: CategoryWithSubCategories[];
}) => {
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

	return (
		<EditPublicMenuContext.Provider
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
		</EditPublicMenuContext.Provider>
	);
};

export const usePublicSidebarData = (): EditPublicMenuContextType => {
	const context = useContext(EditPublicMenuContext);
	if (!context)
		throw new Error(
			'usePublicSidebarData must be used within EditPublicMenuProvider'
		);
	return context;
};
