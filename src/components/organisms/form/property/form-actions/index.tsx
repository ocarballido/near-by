'use client';

import Button from '@/components/molecules/button';

type Props = {
	isSubmitting: boolean;
	onCancel: () => void;
	submitLabel: string;
	cancelLabel: string;
	className?: string;
};

export default function FormActions({
	isSubmitting,
	onCancel,
	submitLabel,
	cancelLabel,
	className,
}: Props) {
	return (
		<div className={`flex flex-col gap-2 ${className}`}>
			<Button
				type="submit"
				label={submitLabel}
				className="w-full"
				disabled={isSubmitting}
			/>

			<Button
				type="button"
				label={cancelLabel}
				className="w-full"
				color="secondary"
				onClick={onCancel}
			/>
		</div>
	);
}
