/// <reference types="@types/google.maps" />

declare namespace google.maps.places {
	/**
	 * Evento del widget Places Autocomplete (new): `gmp-select`
	 * Contiene la predicción seleccionada.
	 */
	interface PlacePredictionSelectEvent extends Event {
		placePrediction: PlacePrediction;
	}

	/**
	 * Predicción de lugar devuelta por el widget.
	 * Tiene método toPlace() para obtener Place.
	 */
	interface PlacePrediction {
		toPlace(): Place;
	}

	/**
	 * Place (nuevo) con fetchFields para pedir campos concretos.
	 */
	interface Place {
		fetchFields(request: { fields: string[] }): Promise<void>;
		formattedAddress?: string;
		location?: google.maps.LatLng;
	}

	/**
	 * Opciones del PlaceAutocompleteElement.
	 * (Definimos solo las que usaremos.)
	 */
	interface PlaceAutocompleteElementOptions {
		includedRegionCodes?: string[];
		requestedLanguage?: string;
		requestedRegion?: string;
		placeholder?: string;
		value?: string;
	}

	/**
	 * Web component: PlaceAutocompleteElement.
	 * Nota: Google lo describe como elemento que se inserta en el DOM
	 * y dispara `gmp-select` / `gmp-error`.
	 */
	class PlaceAutocompleteElement extends HTMLElement {
		constructor(options?: PlaceAutocompleteElementOptions);
		value: string;
	}
}
