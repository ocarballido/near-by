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
		<fieldset className="w-full p-2">
			<label className="font-bold text-sm mb-2 block">{title}</label>
			<div className="flex gap-1 flex-wrap mb-2">
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
