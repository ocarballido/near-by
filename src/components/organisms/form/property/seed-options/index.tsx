'use client';

import BadgeCheck from '@/components/atoms/BadgeCheck';

type Option = {
	id: string;
	label: string;
};

type Props = {
	title: string;
	options: Option[];
	selectedIds: string[];
	onToggle: (id: string) => void;
};

export default function SeedOptions({
	title,
	options,
	selectedIds,
	onToggle,
}: Props) {
	return (
		<fieldset className="w-full">
			<label className="font-medium text-xs mb-1 block text-gray-600">
				{title}
			</label>
			<div className="flex gap-1 flex-wrap">
				{options.map((opt) => (
					<BadgeCheck
						key={opt.id}
						label={opt.label}
						checked={selectedIds.includes(opt.id)}
						onToggle={() => onToggle(opt.id)}
					/>
				))}
			</div>
		</fieldset>
	);
}
