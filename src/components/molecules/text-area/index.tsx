'use client';

import clsx from 'clsx';

import styles from './styles.module.css';

type TextAreaProps = {
	className?: string;
	defaultValue?: string;
	disabled?: boolean;
	error?: boolean;
	helperText?: string;
	iconLeft?: React.ReactNode;
	iconRight?: React.ReactNode;
	id?: string;
	label: string;
	onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
	placeholder?: string;
	rows?: number;
};

const TextArea = ({
	className = '',
	defaultValue = '',
	disabled = false,
	error = false,
	helperText = '',
	iconLeft,
	iconRight,
	id = '',
	label,
	onChange,
	placeholder = '',
	rows = 4,
}: TextAreaProps) => {
	const textAreaStyles = clsx(
		{
			[styles.icon]: true,
			[styles['icon--error']]: error,
		},
		className
	);

	const labelStyles = clsx({ 'text-error-500': error });

	const helperTextStyles = clsx({ 'text-error-500': error });

	const inputStyles = clsx(
		{ 'pl-9': iconLeft },
		{ 'pr-9': iconRight },
		{ 'border-transparent': !error },
		{ 'border-error-500': error },
		{ 'opacity-30': disabled }
	);

	return (
		<div className={`flex flex-col gap-2 ${textAreaStyles}`}>
			{label && (
				<label
					htmlFor={id}
					className={`font-bold text-sm ${labelStyles}`}
				>
					{label}
				</label>
			)}
			<div className="flex items-center relative">
				{iconLeft && (
					<span className="absolute left-2">{iconLeft}</span>
				)}
				<textarea
					rows={rows}
					id={id}
					disabled={disabled}
					placeholder={placeholder}
					defaultValue={defaultValue}
					onChange={onChange}
					className={`py-3 px-4 m-0 bg-gray-800/5 rounded-lg w-full placeholder:text-sm text-gray-700 border-2  focus:border-gray-300 focus:outline-0 ${inputStyles}`}
				/>
				{iconRight && (
					<span className="absolute right-2">{iconRight}</span>
				)}
			</div>
			{helperText && (
				<span className={`text-sm ${helperTextStyles}`}>
					{helperText}
				</span>
			)}
		</div>
	);
};

export default TextArea;
