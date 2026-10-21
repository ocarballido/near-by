import {
	Dialog,
	DialogPanel,
	DialogTitle,
	DialogBackdrop,
} from '@headlessui/react';
import Button from '@/components/molecules/button';
import ButtonIcon from '@/components/atoms/button-icon';
import IconClose from '@/components/atoms/icon/close';

type ModalProps = {
	background?: React.ReactNode;
	closeButtonAriaLabel?: string;
	destructiveButtonLabel?: string;
	destructiveButtonAction?: () => void;
	destructiveButtonDisabled?: boolean;
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

const SimpleModal = ({
	background,
	closeButtonAriaLabel,
	destructiveButtonAction,
	destructiveButtonLabel,
	destructiveButtonDisabled,
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
	const hasButtons = Boolean(
		destructiveButtonLabel || secondaryButtonLabel || primaryButtonLabel,
	);

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
						className={`${size} space-y-4 rounded-2xl bg-white shadow-2xl ${background ? 'relative isolate overflow-hidden' : ''}`}
					>
						{/* Fondo decorativo a panel completo: también pasa por detrás del título.
							m-0: el margen de space-y-4 acortaría la caja absoluta y dejaría una franja abajo */}
						{background && (
							<div
								aria-hidden
								className="pointer-events-none absolute inset-0 -z-10 m-0"
							>
								{background}
							</div>
						)}
						{closeButtonAriaLabel ? (
							<div className="flex items-center gap-4 px-4 py-2 border-b border-b-gray-100 m-0">
								<DialogTitle className="flex-1 font-bold text-xl m-0">
									{title}
								</DialogTitle>
								<ButtonIcon
									color="secondary"
									icon={<IconClose />}
									onClick={onClose}
									ariaLabel={closeButtonAriaLabel}
								/>
							</div>
						) : (
							<DialogTitle className="font-bold text-xl p-4 border-b border-b-gray-100 m-0">
								{title}
							</DialogTitle>
						)}
						{children}
						{hasButtons && (
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
						)}
					</DialogPanel>
				</div>
			</div>
		</Dialog>
	);
};

export default SimpleModal;
