'use client';

import clsx from 'clsx';

import IconFavorite from '@/components/atoms/icon/favorite';
import IconModeHeat from '@/components/atoms/icon/mode-heat';

type TabKey = 'featured' | 'must_visit';

type TabItem = {
	key: TabKey;
	label: string;
	count?: number;
};

type FeaturedMustVisitMenuProps = {
	value: TabKey;
	onChange: (next: TabKey) => void;
	tabs: TabItem[];
	className?: string;
};

export default function FeaturedMustVisitMenu({
	value,
	onChange,
	tabs,
	className,
}: FeaturedMustVisitMenuProps) {
	return (
		<div
			className={clsx(
				'flex w-full rounded-full bg-white p-1 gap-1 shadow-xs',
				className,
			)}
		>
			{tabs.map((tab) => {
				const isActive = value === tab.key;
				const isFeatured = tab.key === 'featured';

				const activeTextClass = isFeatured
					? 'text-primary-500'
					: 'text-red-500';

				const activeBgClass = isFeatured
					? 'bg-primary-100'
					: 'bg-red-100';

				const activeCountBgClass = isFeatured ? 'bg-white' : 'bg-white';

				const iconColor = isActive
					? isFeatured
						? 'primary'
						: 'error'
					: 'body';

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
								? activeBgClass
								: 'bg-transparent hover:bg-white/50',
							isActive ? activeTextClass : 'text-gray-800',
						)}
					>
						{/* Left: icon + label */}
						<span className="inline-flex items-center gap-2 min-w-0">
							{isFeatured ? (
								<IconFavorite color={iconColor} />
							) : (
								<IconModeHeat color={iconColor} />
							)}
							<span className="truncate uppercase font-semibold text-sm flex-1 min-w-0">
								{tab.label}
							</span>
						</span>

						{/* Right: count */}
						{typeof tab.count === 'number' && (
							<span
								className={clsx(
									'text-sm font-semibold px-2.5 py-1 rounded-full',
									'flex-shrink-0',
									isActive
										? activeCountBgClass
										: 'bg-gray-200',
									isActive
										? activeTextClass
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
