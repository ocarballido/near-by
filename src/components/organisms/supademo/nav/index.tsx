'use client';

import { useTranslations } from 'next-intl';

import BadgeCheck from '@/components/atoms/BadgeCheck';

export type DemoItem = {
	id: string;
	label: string;
	embedUrl: string;
	publicUrl: string;
};

export type SupademoDemoNavProps = {
	demos: DemoItem[];
	selectedId: string | null;
	onSelect: (demo: DemoItem) => void;
};

export default function SupademoDemoNav({
	demos,
	selectedId,
	onSelect,
}: SupademoDemoNavProps) {
	const t = useTranslations();

	return (
		<div className="flex flex-wrap gap-1">
			{demos.map((demo) => (
				<BadgeCheck
					key={demo.id}
					label={t(`demo.navigation.${demo.label}`)}
					checked={demo.id === selectedId}
					onToggle={() => onSelect(demo)}
					checkedColor="primary"
				/>
			))}
		</div>
	);
}
