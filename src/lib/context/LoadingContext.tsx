'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface LoadingContextProps {
	loading: boolean;
	openLoading: () => void;
	closeLoading: () => void;
	toggleLoading: () => void;
}

interface LoadingProviderProps {
	children: ReactNode;
}

const LoadingContext = createContext<LoadingContextProps | undefined>(
	undefined
);

export const LoadingProvider: React.FC<LoadingProviderProps> = ({
	children,
}) => {
	const [loading, setLoading] = useState<boolean>(false);

	const openLoading = (): void => setLoading(true);
	const closeLoading = (): void => setLoading(false);
	const toggleLoading = (): void => setLoading((prev) => !prev);

	return (
		<LoadingContext.Provider
			value={{ loading, openLoading, closeLoading, toggleLoading }}
		>
			{children}
		</LoadingContext.Provider>
	);
};

export const useLoading = (): LoadingContextProps => {
	const context = useContext(LoadingContext);
	if (!context) {
		throw new Error('useLoading must be used within a LoadingProvider');
	}
	return context;
};
