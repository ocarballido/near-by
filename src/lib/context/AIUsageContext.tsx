'use client';

import { createContext, useContext, useState, useCallback } from 'react';
import { getRemainingAIUsage } from '@/app/actions/ai-usage/get-remaining-ai-usage';

type AIUsageContextType = {
	remaining: number | null;
	reloadUsage: () => Promise<void>;
	loading: boolean;
};

const AIUsageContext = createContext<AIUsageContextType>({
	remaining: null,
	reloadUsage: async () => {},
	loading: false,
});

export const AIUsageProvider = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const [remaining, setRemaining] = useState<number | null>(null);
	const [loading, setLoading] = useState(false);

	const reloadUsage = useCallback(async () => {
		setLoading(true);
		try {
			const result = await getRemainingAIUsage();
			setRemaining(result?.remaining ?? null);
		} catch (e) {
			// Important: never throw here
			console.error('[AIUsageProvider] getRemainingAIUsage failed:', e);
			setRemaining(null);
		} finally {
			setLoading(false);
		}
	}, []);

	return (
		<AIUsageContext.Provider value={{ remaining, reloadUsage, loading }}>
			{children}
		</AIUsageContext.Provider>
	);
};

export const useAIUsage = () => useContext(AIUsageContext);
