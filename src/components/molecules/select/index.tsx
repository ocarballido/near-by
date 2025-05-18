'use client';

import React from 'react';
import clsx from 'clsx';

export type SelectOption<V = string> = {
	value: V;
	label: string;
};

export type SelectProps<V = string> = {
	label?: string;
	options: SelectOption<V>[];
	value: V;
	onChange: (value: V) => void;
	name?: string;
	disabled?: boolean;
	error?: boolean;
	placeholder?: string;
	className?: string;
	helperText?: string;
};

export function Select<V extends string = string>({
	label,
	options,
	value,
	error = false,
	onChange,
	name,
	disabled = false,
	placeholder,
	helperText = '',
	className,
}: SelectProps<V>) {
	const selectStyles = clsx(disabled && 'opacity-50 cursor-not-allowed');

	const labelStyles = clsx({ 'text-error-500': error });

	const helperTextStyles = clsx({ 'text-error-500': error });

	return (
		<div className={clsx('flex flex-col gap-1', className)}>
			{label && (
				<label
					className={`font-bold text-sm ${labelStyles}`}
					htmlFor={name}
				>
					{label}
				</label>
			)}
			<select
				id={name}
				name={name}
				disabled={disabled}
				value={value}
				onChange={(e) => onChange(e.target.value as V)}
				className={`py-4 px-3 bg-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 ${selectStyles}`}
			>
				{placeholder && (
					<option value="" disabled>
						{placeholder}
					</option>
				)}
				{options.map((opt) => (
					<option key={opt.value} value={opt.value}>
						{opt.label}
					</option>
				))}
			</select>
			{helperText && (
				<span className={`text-sm ${helperTextStyles}`}>
					{helperText}
				</span>
			)}
		</div>
	);
}
