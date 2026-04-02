'use client';
/// <reference types="google.maps" />

import TextField from '@/components/molecules/text-field';
import PlaceAutocompleteField from '@/components/molecules/place-autocomplete';

import type { SelectedPlace } from '@/components/molecules/place-autocomplete';

type Props = {
	t: (key: string) => string;
	locale: string;

	isEdit: boolean;

	// Create mode widgets
	error: boolean;
	helperTextIdle: string;
	helperTextSelected?: string;
	helperTextError: string;

	onSelect: (p: SelectedPlace) => void;
	onClearSelection: () => void;

	// Values for edit display
	addressValue: string;

	// Hidden input props (from RHF register)
	addressRegisterProps: React.InputHTMLAttributes<HTMLInputElement>;
	latRegisterProps: React.InputHTMLAttributes<HTMLInputElement>;
	lngRegisterProps: React.InputHTMLAttributes<HTMLInputElement>;
};

export default function AddressSection({
	t,
	locale,
	isEdit,
	error,
	helperTextIdle,
	helperTextSelected = '',
	helperTextError,
	onSelect,
	onClearSelection,
	addressValue,
	addressRegisterProps,
	latRegisterProps,
	lngRegisterProps,
}: Props) {
	if (isEdit) {
		return (
			<>
				<TextField
					label={t('Dirección *')}
					id="address_display"
					value={addressValue}
					disabled
				/>

				{/* Mantener address/lat/lng en RHF para submit */}
				<input type="hidden" {...addressRegisterProps} />
				<input type="hidden" {...latRegisterProps} />
				<input type="hidden" {...lngRegisterProps} />
			</>
		);
	}

	return (
		<>
			<PlaceAutocompleteField
				label={t('Dirección *')}
				placeholder={t('Dirección ejemplo')}
				locale={locale}
				error={error}
				helperTextIdle={helperTextIdle}
				helperTextSelected={helperTextSelected}
				helperTextError={helperTextError}
				onSelect={onSelect}
				onClearSelection={onClearSelection}
			/>

			<input type="hidden" {...addressRegisterProps} />
			<input type="hidden" {...latRegisterProps} />
			<input type="hidden" {...lngRegisterProps} />
		</>
	);
}
