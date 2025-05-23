'use client';

import {
	createContext,
	useContext,
	useEffect,
	useState,
	useTransition,
} from 'react';
import { getRemainingAIUsage } from '@/app/actions/ai-usage/get-remaining-ai-usage';

type AIUsageContextType = {
	remaining: number | null;
	reloadUsage: () => Promise<void>;
	loading: boolean;
};

const AIUsageContext = createContext<AIUsageContextType>({
	remaining: null,
	reloadUsage: async () => {},
	loading: true,
});

export const AIUsageProvider = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const [remaining, setRemaining] = useState<number | null>(null);
	const [loading, setLoading] = useState(true);
	const [isPending, startTransition] = useTransition();

	const fetchUsage = async () => {
		setLoading(true);
		const result = await getRemainingAIUsage();
		setRemaining(result.remaining);
		setLoading(false);
	};

	useEffect(() => {
		startTransition(() => {
			fetchUsage();
		});
	}, []);

	return (
		<AIUsageContext.Provider
			value={{
				remaining,
				reloadUsage: fetchUsage,
				loading: loading || isPending,
			}}
		>
			{children}
		</AIUsageContext.Provider>
	);
};

export const useAIUsage = () => useContext(AIUsageContext);
