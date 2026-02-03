import type { PaywallPhase } from './getPaywallPhase';

export type Plan = 'free' | 'host' | 'super_host';

export type PaywallBehavior =
	| 'allow_without_modal'
	| 'allow_with_modal'
	| 'block_with_modal';

export function getPlanLimit(plan: Plan): number | 'unlimited' {
	if (plan === 'free') return 1;
	if (plan === 'host') return 5;
	return 'unlimited';
}

export function resolvePaywallBehavior(args: {
	phase: PaywallPhase;
	plan: Plan;
	propertyCount: number;
}): PaywallBehavior {
	const { phase, plan, propertyCount } = args;

	const limit = getPlanLimit(plan);
	const isExceedingLimit = limit !== 'unlimited' && propertyCount >= limit;

	if (!isExceedingLimit) return 'allow_without_modal';
	if (phase === 'paid') return 'block_with_modal';

	// beta_free y soft_paywall educan, pero no bloquean
	return 'allow_with_modal';
}
