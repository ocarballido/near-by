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
	size?: string;
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
	size = 'max-w-xl',
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
		<Dialog
			open={open}
			transition
			onClose={onClose}
			className="relative z-50 transition duration-300 ease-out data-closed:opacity-0"
		>
			<DialogBackdrop className="fixed inset-0 bg-gray-200/90" />

			<div className="fixed inset-0 w-screen overflow-y-auto p-4">
				<div className="flex items-center justify-center p-4">
					<DialogPanel
						className={`${size} space-y-4 rounded-2xl bg-white shadow-2xl`}
					>
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
						<div className="flex flex-col sm:flex-row justify-end gap-2 p-4 border-t border-t-gray-100">
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
									className="order-first sm:order-last"
								/>
							)}
						</div>
					</DialogPanel>
				</div>
			</div>
		</Dialog>
	);
};

export default Modal;
