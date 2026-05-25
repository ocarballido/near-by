import Typography from '@/components/atoms/typography';
import IconLocationOn from '@/components/atoms/icon/location-on';
import { useTranslations } from 'next-intl';

const PREVIEW_COUNT = 4;

export type WowPreviewLocation = {
	id: string;
	name: string | null;
};

interface Props {
	locations: WowPreviewLocation[];
	total: number;
}

export function WowPreviewList({ locations, total }: Props) {
	const t = useTranslations('wow');
	const preview = locations.slice(0, PREVIEW_COUNT);
	const remaining = total - preview.length;

	if (total === 0) {
		return (
			<div className="rounded-xl border border-dashed border-gray-300 p-4 text-center flex flex-col gap-1">
				<Typography
					component="p"
					size="sm"
					color="text-gray-500"
					weight="medium"
				>
					{t('preview.empty')}
				</Typography>
				<Typography component="p" size="sm" color="text-gray-500">
					{t('motivation')}
				</Typography>
			</div>
		);
	}

	return (
		<div className="rounded-xl overflow-hidden">
			<ul className="flex flex-col gap-1">
				{preview.map((loc) => (
					<li
						key={loc.id}
						className="flex items-center gap-2 bg-gray-100/50 px-2 py-2 rounded-xl"
					>
						<div className="p-1 rounded-full bg-white">
							<IconLocationOn color="primary" size={20} />
						</div>
						<Typography
							component="span"
							size="sm"
							weight="medium"
							className="truncate"
						>
							{loc.name ?? '—'}
						</Typography>
					</li>
				))}
			</ul>

			{remaining > 0 && (
				<div className="px-4 py-2">
					<Typography component="p" size="sm" color="text-gray-400">
						{t('preview.andMore', { count: remaining })}
					</Typography>
				</div>
			)}
		</div>
	);
}
