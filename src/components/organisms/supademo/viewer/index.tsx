'use client';

import { useEffect, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';

import Image from 'next/image';
import SupademoEmbed from '../embed';
import SupademoDemoNav, { DemoItem } from '../nav';
import Typography from '@/components/atoms/typography';
import IconOpenInNew from '@/components/atoms/icon/open-in-new';
import Button from '@/components/molecules/button';

export type SupademoDemoViewerProps = {
	demos: DemoItem[];
	defaultDemoId?: string;
};

export default function SupademoDemoViewer({
	demos,
	defaultDemoId,
}: SupademoDemoViewerProps) {
	const t = useTranslations();
	const [selectedId, setSelectedId] = useState<string | null>(null);
	const [selectedLabel, setSelectedLabel] = useState<string | null>(null);

	useEffect(() => {
		if (!demos.length) return;

		const initialId =
			(defaultDemoId && demos.find((d) => d.id === defaultDemoId)?.id) ||
			demos[0].id;

		const initialLabel =
			(defaultDemoId &&
				demos.find((d) => d.id === defaultDemoId)?.label) ||
			demos[0].label;

		setSelectedId((prev) => prev ?? initialId);
		setSelectedLabel((prev) => prev ?? initialLabel);
	}, [demos, defaultDemoId]);

	const selectedDemo = useMemo(
		() => demos.find((d) => d.id === selectedId) ?? null,
		[demos, selectedId],
	);

	const handleSelect = (demo: DemoItem) => {
		setSelectedId(demo.id);
		setSelectedLabel(demo.label);
	};

	if (!demos.length) return null;

	return (
		<div className="flex flex-col gap-3 w-full">
			<SupademoDemoNav
				demos={demos}
				selectedId={selectedId}
				onSelect={handleSelect}
			/>

			{/* DESKTOP ONLY */}
			<div className="hidden md:block">
				{selectedDemo && (
					<SupademoEmbed
						src={selectedDemo.embedUrl}
						title={selectedDemo.label}
					/>
				)}
			</div>

			{/* MOBILE ONLY */}
			<div className="md:hidden">
				{selectedDemo && (
					<a
						href={selectedDemo.publicUrl}
						target="_blank"
						rel="noopener noreferrer"
					>
						<div className="w-full p-6 items-center bg-primary-900 rounded-2xl shadow-xs text-center flex flex-col gap-1 relative overflow-hidden -mb-3">
							<div className="absolute w-[900px] h-[900px] -translate-y-[50%] top-[50%] z-0">
								<Image
									src="/static/img/home/blur.webp"
									fill={true}
									alt="Blur image"
									className="absolute object-cover "
								/>
							</div>
							<div className="relative">
								<Image
									alt="Add property"
									src="/static/img/star.svg"
									height={120}
									width={120}
								/>
								<div className="absolute top-0 lef-0 w-full h-full flex justify-center items-center">
									<IconOpenInNew color="white" />
								</div>
							</div>
							<div className="flex flex-col gap-1 relative">
								<Typography
									component="h2"
									size="lg"
									color="text-white"
								>
									{t('demo.mobileNotice.title')}
								</Typography>
								<Typography color="text-white" weight="medium">
									{t('demo.mobileNotice.description')}
								</Typography>
								<Button
									label={t(
										`demo.navigation.${selectedLabel}`,
									)}
									color="white"
									className="w-fit mx-auto mt-3"
									iconRight={<IconOpenInNew />}
								/>
							</div>
						</div>
					</a>
				)}
			</div>
		</div>
	);
}
