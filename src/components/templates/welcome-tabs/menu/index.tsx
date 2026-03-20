// components/templates/welcome-tabs/menu/index.tsx
'use client';

import clsx from 'clsx';

import IconFavorite from '@/components/atoms/icon/favorite';
import IconModeHeat from '@/components/atoms/icon/mode-heat';
import IconNightLife from '@/components/atoms/icon/nightlife';

export type TabKey = 'featured' | 'must_visit' | 'events';

type IconColor = 'primary' | 'error' | 'warning' | 'body';

const TAB_CONFIG: Record<
	TabKey,
	{
		icon: (color: IconColor) => React.ReactNode;
		activeText: string;
		activeBg: string;
		activeCountBg: string;
		iconActiveColor: IconColor;
	}
> = {
	featured: {
		icon: (color) => <IconFavorite color={color} />,
		activeText: 'text-primary-500',
		activeBg: 'bg-primary-100',
		activeCountBg: 'bg-white',
		iconActiveColor: 'primary',
	},
	must_visit: {
		icon: (color) => <IconModeHeat color={color} />,
		activeText: 'text-red-500',
		activeBg: 'bg-red-100',
		activeCountBg: 'bg-white',
		iconActiveColor: 'error',
	},
	events: {
		icon: (color) => <IconNightLife color={color} />,
		activeText: 'text-warning-500',
		activeBg: 'bg-warning-100',
		activeCountBg: 'bg-white',
		iconActiveColor: 'warning',
	},
};

type TabItem = {
	key: TabKey;
	label: string;
	count?: number;
};

type WelcomeTabsMenuProps = {
	value: TabKey;
	onChange: (next: TabKey) => void;
	tabs: TabItem[];
	className?: string;
};

export default function WelcomeTabsMenu({
	value,
	onChange,
	tabs,
	className,
}: WelcomeTabsMenuProps) {
	return (
		<div
			className={clsx(
				'flex flex-col sm:flex-row md:flex-col lg:flex-row w-full rounded-3xl bg-white p-1 gap-1 shadow-xs',
				className,
			)}
		>
			{tabs.map((tab) => {
				const isActive = value === tab.key;
				const config = TAB_CONFIG[tab.key];

				return (
					<button
						key={tab.key}
						type="button"
						onClick={() => onChange(tab.key)}
						aria-pressed={isActive}
						className={clsx(
							'flex-1 rounded-full px-2 py-2 text-md font-medium min-w-0',
							'flex items-center justify-between gap-2 transition-colors hover:cursor-pointer',
							isActive
								? config.activeBg
								: 'bg-transparent hover:bg-white/50',
							isActive ? config.activeText : 'text-gray-800',
						)}
					>
						<span className="inline-flex items-center gap-2 min-w-0">
							{config.icon(
								isActive ? config.iconActiveColor : 'body',
							)}
							<span className="truncate uppercase font-semibold text-sm flex-1 min-w-0">
								{tab.label}
							</span>
						</span>

						{typeof tab.count === 'number' && (
							<span
								className={clsx(
									'text-sm font-semibold px-2.5 py-1 rounded-full flex-shrink-0',
									isActive
										? config.activeCountBg
										: 'bg-gray-200',
									isActive
										? config.activeText
										: 'text-gray-800',
								)}
							>
								{tab.count}
							</span>
						)}
					</button>
				);
			})}
		</div>
	);
}
