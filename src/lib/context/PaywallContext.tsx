'use client';

import React, {
	createContext,
	useCallback,
	useContext,
	useMemo,
	useState,
} from 'react';
import { useRouter } from 'next/navigation';
import type { PaywallPhase } from '@/lib/paywall/getPaywallPhase';
import type {
	Plan,
	PaywallBehavior,
} from '@/lib/paywall/resolvePaywallBehavior';
import {
	getPlanLimit,
	resolvePaywallBehavior,
} from '@/lib/paywall/resolvePaywallBehavior';
import { createSPASassClient } from '@/lib/supabase/client';

type ActiveModal = null | 'beta' | 'soft' | 'hard';

type PaywallContextType = {
	phase: PaywallPhase;
	plan: Plan;
	propertyCount: number;
	paywallBehavior: PaywallBehavior;

	planLimit: number | 'unlimited';

	activeModal: ActiveModal;
	closePaywall: () => void;

	requestCreateProperty: (href: string) => void;
	continueAfterSoftModal: () => void;

	incrementPropertyCount: () => void;
	refreshPropertyCount: () => Promise<void>;

	decrementPropertyCount: () => void;
};

const PaywallContext = createContext<PaywallContextType | null>(null);

export function PaywallProvider({
	children,
	value,
}: {
	children: React.ReactNode;
	value: {
		phase: PaywallPhase;
		plan: Plan;
		propertyCount: number;
		paywallBehavior: PaywallBehavior;
	};
}) {
	const router = useRouter();

	const [activeModal, setActiveModal] = useState<ActiveModal>(null);
	const [pendingHref, setPendingHref] = useState<string | null>(null);

	const [propertyCount, setPropertyCount] = useState<number>(
		value.propertyCount,
	);

	const planLimit = useMemo(() => getPlanLimit(value.plan), [value.plan]);

	const paywallBehavior = useMemo<PaywallBehavior>(() => {
		return resolvePaywallBehavior({
			phase: value.phase,
			plan: value.plan,
			propertyCount,
		});
	}, [value.phase, value.plan, propertyCount]);

	const closePaywall = useCallback(() => {
		setActiveModal(null);
		setPendingHref(null);
	}, []);

	const continueAfterSoftModal = useCallback(() => {
		if (!pendingHref) return;

		const href = pendingHref;
		closePaywall();
		router.push(href);
	}, [pendingHref, closePaywall, router]);

	const incrementPropertyCount = useCallback(() => {
		setPropertyCount((prev) => prev + 1);
	}, []);

	const decrementPropertyCount = useCallback(() => {
		setPropertyCount((prev) => Math.max(0, prev - 1));
	}, []);

	const refreshPropertyCount = useCallback(async () => {
		try {
			const supabase = await createSPASassClient();
			const client = supabase.getSupabaseClient();

			const {
				data: { user },
			} = await client.auth.getUser();

			if (!user) return;

			const { count, error } = await client
				.from('properties')
				.select('*', { count: 'exact', head: true })
				.eq('user_id', user.id);

			if (error) {
				console.error('Error refreshing propertyCount:', error);
				return;
			}

			setPropertyCount(count ?? 0);
		} catch (e) {
			console.error('Error refreshing propertyCount:', e);
		}
	}, []);

	const requestCreateProperty = useCallback(
		(href: string) => {
			if (paywallBehavior === 'allow_without_modal') {
				router.push(href);
				return;
			}

			if (paywallBehavior === 'allow_with_modal') {
				setPendingHref(href);
				setActiveModal(
					value.phase === 'soft_paywall' ? 'soft' : 'beta',
				);
				return;
			}

			setActiveModal('hard');
		},
		[paywallBehavior, value.phase, router],
	);

	const ctx = useMemo<PaywallContextType>(
		() => ({
			phase: value.phase,
			plan: value.plan,

			propertyCount,
			paywallBehavior,

			planLimit,
			activeModal,
			closePaywall,
			requestCreateProperty,
			continueAfterSoftModal,

			incrementPropertyCount,
			refreshPropertyCount,

			decrementPropertyCount,
		}),
		[
			value.phase,
			value.plan,
			propertyCount,
			paywallBehavior,
			planLimit,
			activeModal,
			closePaywall,
			requestCreateProperty,
			continueAfterSoftModal,
			incrementPropertyCount,
			refreshPropertyCount,
			decrementPropertyCount,
		],
	);

	return (
		<PaywallContext.Provider value={ctx}>
			{children}
		</PaywallContext.Provider>
	);
}

export function usePaywall() {
	const ctx = useContext(PaywallContext);
	if (!ctx) throw new Error('usePaywall must be used within PaywallProvider');
	return ctx;
}
