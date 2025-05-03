'use client';

import React, {
	forwardRef,
	useRef,
	useImperativeHandle,
	ChangeEvent,
} from 'react';
import { useTranslations } from 'next-intl';
import clsx from 'clsx';
import Image from 'next/image';
import Button from '../button';
import IconAdd from '@/components/atoms/icon/add';

export type InputFileProps = {
	className?: string;
	disabled?: boolean;
	error?: boolean;
	helperText?: string;
	id?: string;
	label?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

const InputFile = forwardRef<HTMLInputElement, InputFileProps>(
	(
		{
			className = '',
			disabled = false,
			error = false,
			helperText = '',
			id = '',
			label,
			onChange,
			onBlur,
			name,
			...rest
		},
		forwardedRef
	) => {
		const t = useTranslations();
		const internalRef = useRef<HTMLInputElement>(null);
		const [selectedImage, setSelectedImage] = React.useState<string | null>(
			null
		);

		useImperativeHandle(forwardedRef, () => internalRef.current!);

		const handleClick = () => {
			if (!disabled) internalRef.current?.click();
		};

		const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
			const file = e.target.files?.[0];
			if (file) {
				setSelectedImage(URL.createObjectURL(file));
			}

			onChange?.(e);
		};

		const labelStyles = clsx({ 'text-error-500': error });
		const helperTextStyles = clsx({ 'text-error-500': error });
		const inputStyles = clsx(
			{ 'border-transparent': !error },
			{ 'border-error-500': error },
			{ 'opacity-30': disabled }
		);

		return (
			<div className={`flex flex-col gap-2 ${className}`}>
				{label && (
					<label
						htmlFor={id}
						className={`font-bold text-sm ${labelStyles}`}
					>
						{label}
					</label>
				)}

				<input
					type="file"
					id={id}
					name={name}
					accept="image/*"
					disabled={disabled}
					ref={internalRef}
					style={{ display: 'none' }}
					onChange={handleFileChange}
					onBlur={onBlur}
					{...rest}
				/>

				<div
					className={`w-full max-w-96 h-full min-h-48 bg-gray-800/5 border-2 flex items-center justify-center cursor-pointer relative rounded-lg overflow-hidden ${inputStyles}`}
					onClick={handleClick}
				>
					{selectedImage ? (
						<Image
							className="object-cover"
							src={selectedImage}
							alt="Preview"
							fill
						/>
					) : (
						<Button
							label={t('Subir imagen')}
							className="pointer-events-none"
							color="white"
							iconLeft={<IconAdd />}
						/>
					)}
				</div>

				{helperText && (
					<span className={`text-sm ${helperTextStyles}`}>
						{helperText}
					</span>
				)}
			</div>
		);
	}
);

InputFile.displayName = 'InputFile';
export default InputFile;
