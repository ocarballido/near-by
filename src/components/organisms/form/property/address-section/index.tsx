"use client";
/// <reference types="google.maps" />

import PlaceAutocompleteField from "@/components/molecules/place-autocomplete";

import type { SelectedPlace } from "@/components/molecules/place-autocomplete";

type Props = {
    t: (key: string) => string;
    locale: string;

    error: boolean;
    helperTextIdle: string;
    helperTextSelected?: string;
    helperTextError: string;

    onSelect: (p: SelectedPlace) => void;
    onClearSelection: () => void;

    // Estado controlado desde el padre — refleja si hay una dirección
    // seleccionada ahora mismo (true en edición al montar, false en creación).
    // undefined preservaría el comportamiento interno del widget, pero ya
    // no lo necesitamos: ambos modos pasan siempre un valor explícito.
    isSelected: boolean;
    selectedValue: string;

    addressRegisterProps: React.InputHTMLAttributes<HTMLInputElement>;
    latRegisterProps: React.InputHTMLAttributes<HTMLInputElement>;
    lngRegisterProps: React.InputHTMLAttributes<HTMLInputElement>;
};

export default function AddressSection({
    t,
    locale,
    error,
    helperTextIdle,
    helperTextSelected = "",
    helperTextError,
    onSelect,
    onClearSelection,
    isSelected,
    selectedValue,
    addressRegisterProps,
    latRegisterProps,
    lngRegisterProps,
}: Props) {
    return (
        <>
            <PlaceAutocompleteField
                label={t("Dirección *")}
                placeholder={t("Dirección ejemplo")}
                locale={locale}
                error={error}
                helperTextIdle={helperTextIdle}
                helperTextSelected={helperTextSelected}
                helperTextError={helperTextError}
                onSelect={onSelect}
                onClearSelection={onClearSelection}
                isSelected={isSelected}
                selectedValue={selectedValue}
            />

            <input type="hidden" {...addressRegisterProps} />
            <input type="hidden" {...latRegisterProps} />
            <input type="hidden" {...lngRegisterProps} />
        </>
    );
}
