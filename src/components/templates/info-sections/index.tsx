'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import Typography from '@/components/atoms/typography';
import type { InfoGroup } from '@/app/[locale]/public/[...slug]/_data';

import IconAlarm from '@/components/atoms/icon/alarm';
import IconListBullet from '@/components/atoms/icon/list-bullet';
import IconManual from '@/components/atoms/icon/manual';
import IconRecicle from '@/components/atoms/icon/recicle';
import IconWifi from '@/components/atoms/icon/wifi';
import { CATEGORIES_SUB_CATEGORIES } from '@/config/config-constants';

const SUB_CATEGORY_ICONS: Record<string, React.ReactNode> = {
	[CATEGORIES_SUB_CATEGORIES.LODGING.SUB_CATEGORIES.MANUAL.id]: (
		<IconManual />
	),
	[CATEGORIES_SUB_CATEGORIES.LODGING.SUB_CATEGORIES.RULES.id]: (
		<IconListBullet />
	),
	[CATEGORIES_SUB_CATEGORIES.LODGING.SUB_CATEGORIES.SCHEDULE.id]: (
		<IconAlarm />
	),
	[CATEGORIES_SUB_CATEGORIES.LODGING.SUB_CATEGORIES.RECYCLE.id]: (
		<IconRecicle />
	),
	[CATEGORIES_SUB_CATEGORIES.LODGING.SUB_CATEGORIES.WIFI.id]: <IconWifi />,
};

type Props = {
	groups: InfoGroup[];
	defaultOpenId?: string;
	title?: string;
};

const InfoSections = ({ groups, defaultOpenId, title }: Props) => {
	const t = useTranslations();

	const [openId, setOpenId] = useState<string | null>(
		defaultOpenId ?? groups[0]?.sub_category_id ?? null,
	);

	if (groups.length === 0) return null;

	return (
		<div className="flex flex-col gap-3 w-full">
			{title && (
				<Typography component="h2" size="lg">
					{title}
				</Typography>
			)}
			{groups.map((group) => {
				const isOpen = openId === group.sub_category_id;
				const icon = SUB_CATEGORY_ICONS[group.sub_category_id] ?? (
					<IconManual />
				);

				return (
					<div
						key={group.sub_category_id}
						className="rounded-xl bg-white overflow-hidden shadow-xs"
					>
						<button
							className="w-full flex items-center justify-between px-4 py-3 font-medium text-left hover:bg-primary-100 hover:cursor-pointer transition-colors duration-200"
							onClick={() =>
								setOpenId(isOpen ? null : group.sub_category_id)
							}
						>
							<span className="flex items-center gap-2">
								{icon}
								{t(group.sub_category_name)}
							</span>
							<span
								className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
							>
								▾
							</span>
						</button>

						<div
							className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
						>
							<div className="overflow-hidden">
								<div className="px-4 pb-4 text-sm whitespace-pre-wrap font-body text-gray-700">
									<Typography>{group.description}</Typography>
								</div>
							</div>
						</div>
					</div>
				);
			})}
		</div>
	);
};

export default InfoSections;
