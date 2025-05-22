'use client';

import {
	useCallback,
	createContext,
	useContext,
	useEffect,
	useState,
} from 'react';
import { createSPASassClient } from '@/lib/supabase/client';
import { useGlobal } from './GlobalContext';

import { DAILY_AI_USAGE_LIMMIT } from '@/config/config-constants';

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
	const { user, loading: userLoading } = useGlobal();
	const [remaining, setRemaining] = useState<number | null>(null);
	const [loading, setLoading] = useState(true);

	const fetchUsage = useCallback(async () => {
		if (!user) return;

		setLoading(true);
		const supabase = await createSPASassClient();
		const client = supabase.getSupabaseClient();

		const today = new Date().toISOString().split('T')[0];

		const { data, error } = await client
			.from('ai_usage')
			.select('count')
			.eq('user_id', user.id)
			.eq('date', today)
			.single();

		if (error || !data) {
			setRemaining(DAILY_AI_USAGE_LIMMIT);
		} else {
			setRemaining(Math.max(0, DAILY_AI_USAGE_LIMMIT - data.count));
		}

		setLoading(false);
	}, [user]);

	useEffect(() => {
		if (!userLoading && user) {
			fetchUsage();
		}
	}, [userLoading, user, fetchUsage]);

	return (
		<AIUsageContext.Provider
			value={{ remaining, reloadUsage: fetchUsage, loading }}
		>
			{children}
		</AIUsageContext.Provider>
	);
};

export const useAIUsage = () => {
	return useContext(AIUsageContext);
};
