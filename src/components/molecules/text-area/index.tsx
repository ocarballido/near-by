'use client';

import clsx from 'clsx';

import styles from './styles.module.css';

export type TextAreaProps = {
	className?: string;
	label?: string;
	helperText?: string;
	error?: boolean;
	iconLeft?: React.ReactNode;
	iconRight?: React.ReactNode;
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>;

const TextArea = ({
	className = '',
	label,
	helperText = '',
	error = false,
	iconLeft,
	iconRight,
	disabled = false,
	rows = 4,
	...rest
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
					htmlFor={rest.id}
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
					{...rest}
					disabled={disabled}
					rows={rows}
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
