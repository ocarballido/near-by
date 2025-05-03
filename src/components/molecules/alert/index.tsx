'use client';
import { useEffect, useRef, useState } from 'react';

import clsx from 'clsx';

import HeadingType from '@/components/atoms/typography/heading';
import BodyType from '@/components/atoms/typography/body';
import IconCheckCircle from '@/components/atoms/icon/check-circle';
import IconInfo from '@/components/atoms/icon/info';
import IconChatBubble from '@/components/atoms/icon/chat-bubble';
import IconError from '@/components/atoms/icon/error';
import IconCancel from '@/components/atoms/icon/cancel';

type AlertProps = {
	className?: string;
	type?: 'error' | 'success' | 'info' | 'warning';
	dismissible?: boolean;
	hideTime?: number;
	message?: string;
	open: boolean;
	title: string;
	onClose?: () => void;
	onLeave?: () => void;
};

const Alert = ({
	className = '',
	type = 'info',
	dismissible = false,
	hideTime,
	message = '',
	open = false,
	title,
	onClose,
	onLeave,
}: AlertProps) => {
	const alertStyles = clsx(
		{ flex: open },
		{ hidden: !open },
		{ 'bg-info-400': type === 'info' },
		{ 'bg-success-400': type === 'success' },
		{ 'bg-error-500': type === 'error' },
		{ 'bg-warning-400': type === 'warning' },
		className
	);

	const closeStyles = clsx(
		{ 'bg-info-400': type === 'info' },
		{ 'bg-success-400': type === 'success' },
		{ 'bg-error-500': type === 'error' },
		{ 'bg-warning-400': type === 'warning' },
		className
	);

	const [isVisible, setIsVisible] = useState(open);
	const prevVisibleRef = useRef(isVisible);

	useEffect(() => {
		setIsVisible(open);

		let timer: number | undefined;
		if (open && hideTime) {
			timer = window.setTimeout(() => {
				setIsVisible(false);
				if (onClose) {
					onClose();
				}
			}, hideTime);
		}

		return () => {
			if (timer) {
				clearTimeout(timer);
			}
		};
	}, [open, hideTime, onClose]);

	useEffect(() => {
		if (prevVisibleRef.current && !isVisible) {
			if (onLeave) {
				onLeave();
			}
		}
		prevVisibleRef.current = isVisible;
	}, [isVisible, onLeave]);

	const handleClose = () => {
		setIsVisible(false);
		if (onClose) {
			onClose();
		}
	};

	if (!isVisible) return null;

	return (
		<div
			className={`fixed flex-row gap-2 sm:max-w-96 left-4 right-4 top-10 rounded-2xl shadow-xl ml-auto mr-auto p-4 h-fit transition-all z-10 ${alertStyles}`}
		>
			<div className="shrink-0">
				{type === 'warning' && <IconChatBubble color="white" />}
				{type === 'info' && <IconInfo color="white" />}
				{type === 'success' && <IconCheckCircle color="white" />}
				{type === 'error' && <IconError color="white" />}
			</div>
			<div className="flex flex-col gap-2 mt-0.5">
				<HeadingType color="white" variant="sm" component="h6">
					{title}
				</HeadingType>
				{message && (
					<BodyType color="white" weight="medium">
						{message}
					</BodyType>
				)}
			</div>
			{dismissible && (
				<div
					className={`hover:cursor-pointer p-0.5 absolute rounded-full right-0 top-0 -mt-3 -mr-3 ${closeStyles}`}
					onClick={handleClose}
				>
					<IconCancel color="white" />
				</div>
			)}
		</div>
	);
};

export default Alert;
