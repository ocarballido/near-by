// components/domain/CreatePropertyEntry.tsx
'use client';

import { usePaywall } from '@/lib/context/PaywallContext';

type Props = {
	link: React.ReactNode;
	action: React.ReactNode;
	href: string;
	className?: string;
};

export default function CreatePropertyEntry({
	link,
	action,
	href,
	className,
}: Props) {
	const { paywallBehavior, requestCreateProperty } = usePaywall();

	// Caso sin fricción → navegación directa
	if (paywallBehavior === 'allow_without_modal') {
		return <>{link}</>;
	}

	// Casos beta / soft / hard → acción controlada
	return (
		<div
			role="button"
			tabIndex={0}
			className={`w-full ${className}`}
			onClick={() => requestCreateProperty(href)}
			onKeyDown={(e) => {
				if (e.key === 'Enter' || e.key === ' ') {
					e.preventDefault();
					requestCreateProperty(href);
				}
			}}
		>
			{action}
		</div>
	);
}
