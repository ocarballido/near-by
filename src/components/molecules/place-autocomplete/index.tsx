'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';

import { waitForGoogleMapsReady } from '@/lib/google-maps/ready';
import TextField from '@/components/molecules/text-field';
import Button from '@/components/molecules/button';

export type SelectedPlace = {
	formattedAddress: string;
	lat: number;
	lng: number;
};

type Props = {
	label: string;
	placeholder?: string;
	locale: string;
	countryCodes?: string[];
	error?: boolean;
	helperTextIdle: string;
	helperTextSelected: string;
	helperTextError?: string;
	onSelect: (place: SelectedPlace) => void;
	onClearSelection?: () => void;
};

type GmpSelectEvent = Event & {
	placePrediction?: {
		toPlace: () => google.maps.places.Place;
	};
};

function isGmpSelectEvent(evt: Event): evt is GmpSelectEvent {
	return (
		typeof (evt as GmpSelectEvent).placePrediction?.toPlace === 'function'
	);
}

export default function PlaceAutocompleteField({
	label,
	placeholder,
	locale,
	countryCodes = ['es'],
	error,
	helperTextIdle,
	helperTextSelected,
	helperTextError,
	onSelect,
	onClearSelection,
}: Props) {
	const hostRef = useRef<HTMLDivElement | null>(null);
	const elRef = useRef<google.maps.places.PlaceAutocompleteElement | null>(
		null,
	);

	const t = useTranslations();

	const [internalError, setInternalError] = useState<string | null>(null);
	const [selectedAddress, setSelectedAddress] = useState('');
	const [isSelected, setIsSelected] = useState(false);

	useEffect(() => {
		if (isSelected) return;

		let cancelled = false;

		const init = async () => {
			setInternalError(null);

			await waitForGoogleMapsReady();
			await google.maps.importLibrary('places');

			if (cancelled || !hostRef.current) return;

			const el = new google.maps.places.PlaceAutocompleteElement({
				includedRegionCodes: countryCodes,
				requestedLanguage: locale,
				placeholder,
			});

			// 🔹 Estilo UNA vez (suficiente)
			el.style.display = 'block';
			el.style.width = '100%';
			el.style.backgroundColor = 'rgba(31, 41, 55, 0.05)';
			el.style.borderRadius = '0.5rem';
			el.style.borderWidth = '2px';
			el.style.borderStyle = 'solid';
			el.style.borderColor = error ? '#ef4444' : 'transparent';
			el.style.fontSize = '14px';
			el.style.color = '#374151';
			el.style.colorScheme = 'light';

			hostRef.current.innerHTML = '';
			hostRef.current.appendChild(el);
			elRef.current = el;

			const onGmpSelect: EventListener = async (evt) => {
				try {
					if (!isGmpSelectEvent(evt) || !evt.placePrediction) return;

					const place = evt.placePrediction.toPlace();
					await place.fetchFields({
						fields: ['formattedAddress', 'location'],
					});

					if (!place.formattedAddress || !place.location) return;

					onSelect({
						formattedAddress: place.formattedAddress,
						lat: place.location.lat(),
						lng: place.location.lng(),
					});

					setSelectedAddress(place.formattedAddress);
					setIsSelected(true);

					hostRef.current!.innerHTML = '';
					elRef.current = null;
				} catch {
					setInternalError(helperTextError ?? '');
				}
			};

			const onGmpError: EventListener = () => {
				setInternalError(helperTextError ?? '');
			};

			el.addEventListener('gmp-select', onGmpSelect);
			el.addEventListener('gmp-error', onGmpError);
		};

		init();

		return () => {
			cancelled = true;
			elRef.current = null;
		};
	}, [
		countryCodes,
		locale,
		placeholder,
		isSelected,
		onSelect,
		error,
		helperTextError,
	]);

	const handleChange = () => {
		setIsSelected(false);
		setSelectedAddress('');
		setInternalError(null);
		onClearSelection?.();
	};

	const helperTextToShow = internalError
		? internalError
		: isSelected
			? helperTextSelected
			: helperTextIdle;

	return (
		<div className="flex flex-col gap-2">
			{isSelected ? (
				<>
					<div className="flex gap-2 items-end">
						<TextField
							label={label}
							value={selectedAddress}
							disabled
							error={error}
							helperText={helperTextToShow}
						/>
					</div>
					<Button
						type="button"
						label={t('addressChange')}
						color="secondary"
						onClick={handleChange}
					/>
				</>
			) : (
				<div className="flex flex-col gap-2">
					<label
						className={`font-medium text-sm ${error ? 'text-error-500' : ''}`}
					>
						{label}
					</label>

					<div ref={hostRef} className="w-full" />

					{helperTextToShow && (
						<span
							className={`text-sm ${error || internalError ? 'text-error-500' : ''}`}
						>
							{helperTextToShow}
						</span>
					)}
				</div>
			)}
		</div>
	);
}
