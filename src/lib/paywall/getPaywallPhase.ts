export type PaywallPhase = 'beta_free' | 'soft_paywall' | 'paid';

export function getPaywallPhase(): PaywallPhase {
	return (process.env.NEXT_PUBLIC_PAYWALL_PHASE ??
		'beta_free') as PaywallPhase;
}
