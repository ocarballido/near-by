'use client';

import React, { FC } from 'react';

import { UseFormRegisterReturn } from 'react-hook-form';
import { useTranslations } from 'next-intl';

import clsx from 'clsx';

import Spinner from '@/components/atoms/spinner';
import TextField from '@/components/molecules/text-field';
import Button from '@/components/molecules/button';

export interface AddressFieldProps {
	registerReturn: UseFormRegisterReturn;
	loading: boolean;
	error?: boolean;
	helperText?: string;
	coords?: { formatted: string; lat: number; lng: number };
	onValidate: () => void;
	label: string;
	placeholder: string;
	className?: string;
}

const AddressField: FC<AddressFieldProps> = ({
	registerReturn,
	loading,
	error,
	helperText,
	coords,
	onValidate,
	label,
	placeholder,
	className,
}) => {
	const t = useTranslations();
	return (
		<div
			className={clsx(
				'relative flex flex-col gap-2 rounded-lg',
				className
			)}
		>
			{loading && <Spinner position="absolute" />}

			<TextField
				label={label}
				placeholder={placeholder}
				id={registerReturn.name}
				{...registerReturn}
				error={error}
				helperText={helperText}
			/>

			{coords && (
				<div className="p-2 bg-success-100 rounded-md text-success-800 flex flex-col gap-1">
					<p className="font-bold text-xs">
						{t('La dirección propuesta es')}
					</p>
					<p className="text-xs">{coords.formatted}</p>
					<p className="text-xs">
						{t(
							'Si no es la tuya, inserta una dirección mas específica, con nombre de la ciudad o código postal'
						)}
					</p>
				</div>
			)}

			<Button
				type="button"
				label="Validar dirección"
				onClick={onValidate}
				color="white"
				className="shadow-sm"
				disabled={loading}
			/>
		</div>
	);
};

export default AddressField;
