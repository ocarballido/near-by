// TextField.tsx
'use client';

import React, { forwardRef, type InputHTMLAttributes, type Ref } from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

export type TextFieldProps = {
	/** Ref extra para casos como Autocomplete */
	inputRef?: Ref<HTMLInputElement>;
	className?: string;
	disabled?: boolean;
	iconLeft?: React.ReactNode;
	iconRight?: React.ReactNode;
	helperText?: string;
	placeholder?: string;
	defaultValue?: string;
	label: string;
	id?: string;
	error?: boolean;
} & InputHTMLAttributes<HTMLInputElement>;

/** Combina varios refs en uno solo */
function mergeRefs<T>(...refs: Array<Ref<T> | undefined>) {
	return (el: T | null) => {
		refs.forEach((ref) => {
			if (!ref) return;
			if (typeof ref === 'function') ref(el);
			else ref.current = el;
		});
	};
}

const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
	(
		{
			inputRef,
			className = '',
			disabled = false,
			error = false,
			iconLeft,
			iconRight,
			label,
			helperText = '',
			id = '',
			placeholder = '',
			defaultValue,
			type = 'text',
			...rest
		},
		forwardedRef
	) => {
		const textFieldStyles = clsx(
			{ [styles.icon]: true, [styles['icon--error']]: error },
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

		// Mezcla el ref de RHF (forwardedRef) con nuestro inputRef
		const combinedRef = mergeRefs<HTMLInputElement>(forwardedRef, inputRef);

		return (
			<div className={`flex flex-col gap-2 ${textFieldStyles}`}>
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
					<input
						ref={combinedRef}
						type={type}
						id={id}
						name={id}
						disabled={disabled}
						placeholder={placeholder}
						defaultValue={defaultValue}
						className={`py-3 px-4 m-0 bg-gray-800/5 rounded-lg w-full placeholder:text-sm text-gray-700 border-2 focus:border-gray-300 focus:outline-0 ${inputStyles}`}
						{...rest}
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
	}
);

TextField.displayName = 'TextField';
export default TextField;
