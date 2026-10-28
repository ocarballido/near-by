'use client';

import { useEffect } from 'react';
import {
	usePropertyMenu,
	type PropertyMenuData,
} from '@/lib/context/PropertyMenuContext';

type Props = {
	property: PropertyMenuData;
};

export default function PropertyMenuBootstrap({ property }: Props) {
	const { setProperty } = usePropertyMenu();

	// Al salir de la gestión (desmontaje del layout) el menú desaparece
	useEffect(() => {
		setProperty(property);
		return () => setProperty(null);
	}, [property, setProperty]);

	return null;
}
