'use client';

import Button from '@/components/molecules/button';
import ButtonLink from '@/components/molecules/button-link';
import IconHelp from '@/components/atoms/icon/help';

type Props = {
	isEdit: boolean;
	isSubmitting: boolean;
	onCancel: () => void;
	submitLabel: string;
	cancelLabel: string;

	// Feedback (solo create)
	showFeedback: boolean;
	feedbackLabel: string;
	feedbackHref: string;
};

export default function FormActions({
	isEdit,
	isSubmitting,
	onCancel,
	submitLabel,
	cancelLabel,
	showFeedback,
	feedbackLabel,
	feedbackHref,
}: Props) {
	return (
		<div className="flex flex-col gap-2">
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

			{/* feedback link: solo create (o cuando decidas) */}
			{showFeedback && !isEdit && (
				<ButtonLink
					label={feedbackLabel}
					href={feedbackHref}
					color="white"
					className="w-full"
					iconLeft={<IconHelp />}
				/>
			)}
		</div>
	);
}
