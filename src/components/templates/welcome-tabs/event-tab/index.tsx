'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { useEvents } from '@/hooks/useEvents';

import BadgeCheck from '@/components/atoms/BadgeCheck';
import { Select } from '@/components/molecules/select';
import Typography from '@/components/atoms/typography';
import ButtonIcon from '@/components/atoms/button-icon';
import IconChevronForward from '@/components/atoms/icon/chevron-forward';
import Skeleton from '@/components/atoms/skeleton';
import Button from '@/components/molecules/button';
import IconAdd from '@/components/atoms/icon/add';

const RADIUS_OPTIONS = [5, 15, 30, 50, 100];
const DEFAULT_VISIBLE = 8;

type CategoryChip = 'all' | 'Music' | 'Sports' | 'Arts & Theatre';

const CHIPS: { key: CategoryChip; label: string }[] = [
	{ key: 'all', label: 'Todos' },
	{ key: 'Music', label: 'Música' },
	{ key: 'Sports', label: 'Deportes' },
	{ key: 'Arts & Theatre', label: 'Teatro' },
];

type Props = {
	lat: number;
	lng: number;
};

export default function EventsTab({ lat, lng }: Props) {
	const t = useTranslations();

	const {
		events,
		loading,
		error,
		radiusUsed,
		manualRadius,
		setManualRadius,
		total,
	} = useEvents(lat, lng);

	const [activeChip, setActiveChip] = useState<CategoryChip>('all');
	const [showAll, setShowAll] = useState(false);

	const filtered =
		activeChip === 'all'
			? events
			: events.filter((e) => e.category === activeChip);

	const visible = showAll ? filtered : filtered.slice(0, DEFAULT_VISIBLE);
	const hasMore = filtered.length > DEFAULT_VISIBLE && !showAll;

	return (
		<div className="flex flex-col gap-4">
			{/* Loading skeleton */}
			<Typography component="h2" size="lg">
				{t('eventsSubtitle')}
			</Typography>
			{loading && (
				<div className="flex flex-col gap-3">
					{[1, 2, 3].map((i) => (
						<Skeleton height="5rem" key={i} />
					))}
				</div>
			)}

			{/* Chips de categoría */}
			{!loading && !error && events.length > 0 && (
				<div className="flex flex-col lg:flex-row gap-3">
					<Select
						options={RADIUS_OPTIONS.map((r) => ({
							value: String(r),
							label: `${r} km`,
						}))}
						value={String(manualRadius ?? radiusUsed)}
						onChange={(val) => {
							setShowAll(false);
							setManualRadius(Number(val));
						}}
						className="mr-auto w-full max-w-[768px]"
					/>

					<div className="flex items-center gap-1 flex-wrap md:flex-nowrap w-full lg:justify-end">
						{CHIPS.map((chip) => (
							<BadgeCheck
								key={chip.key}
								label={chip.label}
								checked={activeChip === chip.key}
								onToggle={() => {
									setActiveChip(chip.key);
									setShowAll(false);
								}}
							/>
						))}
					</div>
				</div>
			)}

			{/* Loading skeleton */}
			{loading && (
				<div className="flex flex-col gap-3">
					{[1, 2, 3, 4].map((i) => (
						<Skeleton height="5rem" key={i} />
					))}
				</div>
			)}

			{/* Error */}
			{!loading && error && <Typography>{t('eventsError')}</Typography>}

			{/* Empty state */}
			{!loading && !error && filtered.length === 0 && (
				<Typography className="text-center mt-6">
					{t('eventsEmpty', { radius: radiusUsed })}
				</Typography>
			)}

			{/* Lista de eventos */}
			{!loading && !error && visible.length > 0 && (
				<div className="flex flex-col gap-4">
					{visible.map((event) => (
						<a
							key={event.id}
							href={event.url}
							target="_blank"
							rel="noopener noreferrer"
							className="flex gap-3 p-1 rounded-lg hover:bg-gray-100 transition-colors items-center"
						>
							{event.image ? (
								<img
									src={event.image}
									alt={event.name}
									className="w-20 h-20 object-cover rounded-md flex-shrink-0"
								/>
							) : (
								<div className="w-20 h-20 rounded-md bg-muted flex-shrink-0" />
							)}

							<div className="flex flex-col gap-1 min-w-0 flex-1 py-3 pr-3">
								<Typography component="h3" size="base">
									{event.name}
								</Typography>
								<Typography>
									{event.date}
									{event.venue && ` · ${event.venue}`}
								</Typography>
							</div>
							<ButtonIcon
								color="secondary"
								size="small"
								className="mr-2"
								icon={<IconChevronForward />}
							/>
						</a>
					))}
				</div>
			)}

			{/* Ver más */}
			{hasMore && (
				<Button
					onClick={() => setShowAll(true)}
					label={t('eventsShowMore', {
						count: filtered.length - DEFAULT_VISIBLE,
					})}
					iconLeft={<IconAdd />}
					color="secondary"
					className="w-fit mx-auto"
				/>
			)}
		</div>
	);
}
