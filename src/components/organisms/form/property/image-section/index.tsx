'use client';

import Image from 'next/image';
import Typography from '@/components/atoms/typography';
import InputFile from '@/components/molecules/input-file';

import type { FieldError } from 'react-hook-form';

type Props = {
	t: (key: string) => string;
	isEdit: boolean;
	imageUrl: string | null;
	label: string;
	error?: FieldError;
	registerProps: React.InputHTMLAttributes<HTMLInputElement>;
};

export default function ImageSection({
	t,
	isEdit,
	imageUrl,
	label,
	error,
	registerProps,
}: Props) {
	return (
		<>
			{isEdit && imageUrl && (
				<div className="flex flex-col gap-2">
					<label className="font-medium text-sm">
						{t('propertyForm.currentImage')}
					</label>

					<div className="w-full overflow-hidden rounded-lg relative h-[200px]">
						<Image
							src={imageUrl}
							fill
							priority
							alt={t('propertyForm.currentImageAlt')}
							className="object-cover"
						/>
					</div>

					<Typography size="sm" className="opacity-70">
						{t('propertyForm.changeImageHelper')}
					</Typography>
				</div>
			)}

			<InputFile
				label={label}
				error={Boolean(error)}
				helperText={error?.message as string}
				{...registerProps}
			/>
		</>
	);
}
