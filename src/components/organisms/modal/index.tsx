import {
	Description,
	Dialog,
	DialogPanel,
	DialogTitle,
	DialogBackdrop,
} from '@headlessui/react';
import Button from '@/components/molecules/button';

type ModalProps = {
	description?: React.ReactNode;
	destructiveButtonLabel?: string;
	destructiveButtonAction?: () => void;
	destructiveButtonDisabled?: boolean;
	icon?: React.ReactNode;
	message?: string;
	open: boolean;
	onClose: () => void;
	title: string;
	primaryButtonLabel?: string;
	primaryButtonAction?: () => void;
	primaryButtonDisabled?: boolean;
	secondaryButtonLabel?: string;
	secondaryButtonAction?: () => void;
	secondaryButtonDisabled?: boolean;
	children?: React.ReactNode;
};

const Modal = ({
	description,
	destructiveButtonAction,
	destructiveButtonLabel,
	destructiveButtonDisabled,
	icon,
	message,
	open,
	onClose,
	primaryButtonAction,
	primaryButtonLabel,
	primaryButtonDisabled,
	secondaryButtonAction,
	secondaryButtonLabel,
	secondaryButtonDisabled,
	title,
	children,
}: ModalProps) => {
	return (
		<Dialog open={open} onClose={onClose} className="relative z-50">
			<DialogBackdrop className="fixed inset-0 bg-gray-200/90" />

			<div className="fixed inset-0 flex w-screen items-center justify-center p-4">
				<DialogPanel className="max-w-xl space-y-4 rounded-2xl bg-white shadow-2xl">
					<DialogTitle className="font-bold text-xl p-4 border-b border-b-gray-100 m-0">
						{title}
					</DialogTitle>
					<div className="py-4 px-6 text-center flex flex-col gap-2 items-center m-0 font-body font-medium">
						{icon}
						{description && (
							<Description>{description}</Description>
						)}
						{message && <Description>{message}</Description>}

						{children}
					</div>
					<div className="flex justify-end gap-2 p-4 border-t border-t-gray-100">
						{destructiveButtonLabel && (
							<Button
								onClick={destructiveButtonAction}
								label={destructiveButtonLabel}
								color="error"
								disabled={destructiveButtonDisabled}
							/>
						)}
						{secondaryButtonLabel && (
							<Button
								onClick={secondaryButtonAction}
								label={secondaryButtonLabel}
								color="secondary"
								disabled={secondaryButtonDisabled}
							/>
						)}
						{primaryButtonLabel && (
							<Button
								onClick={primaryButtonAction}
								label={primaryButtonLabel}
								color="primary"
								disabled={primaryButtonDisabled}
							/>
						)}
					</div>
				</DialogPanel>
			</div>
		</Dialog>
	);
};

export default Modal;
