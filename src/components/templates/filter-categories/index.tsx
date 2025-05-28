'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Select, SelectOption } from '@/components/molecules/select';
import Badge from '@/components/atoms/badge';

const subcategories = {
	alojamiento: [
		'Información general',
		'Manual de alojamiento',
		'Normas de uso',
		'Horario',
		'Reciclaje',
		'Wifi',
	],
	salud: [
		'Hospitales',
		'Farmacias',
		'Urgencias',
		'Cuidado dental',
		'Masajes y Spa',
		'Fisioterapia',
		'Gimnasios',
		'Yoga',
		'Salud Mental',
	],
	comida: [
		'Restaurantes',
		'Cafeterías',
		'Panaderías',
		'Comida rápida',
		'Bares',
		'Pubs',
		'Cervecerías',
		'Bares de Vinos',
		'Camiones de comida',
	],
	arte: [
		'Museos',
		'Galerías de arte',
		'Teatros',
		'Salas de conciertos',
		'Sitios históricos',
		'Monumentos',
		'Bibliotecas',
		'Centros culturales',
	],
	parques: [
		'Parques urbanos',
		'Parques infantiles',
		'Jardines botánicos',
		'Senderos',
		'Playas',
		'Zoológicos y Acuarios',
		'Reservas naturales',
	],
	compras: [
		'Supermercados',
		'Mercados de agricultores',
		'Centros comerciales',
		'Boutiques',
		'Souvenirs',
		'Mercadillos',
	],
	servicios: [
		'Bancos',
		'Oficinas de correos',
		'Tintorerías',
		'Lavanderías',
		'Peluquerías y Barberías',
		'Centros de impresión y copiado',
	],
	transporte: [
		'Paradas de autobús',
		'Estaciones de metro',
		'Estaciones de tren',
		'Alquiler de bicicletas',
		'Alquiler de scooters',
		'Terminales de ferry',
		'Paradas de taxi',
	],
	entretenimiento: [
		'Discotecas',
		'Casinos',
		'Clubes de comedia',
		'Karaoke',
		'Cines',
		'Salas de escape',
		'Boleras',
		'Arcades',
	],
	atracciones: [
		'Atracciones turísticas',
		'Lugares emblemáticos',
		'Miradores',
		'Parques temáticos',
		'Parques acuáticos',
		'Tours guiados',
	],
	seguridad: [
		'Estaciones de policía',
		'Estaciones de bomberos',
		'Clínicas de emergencia',
		'Embajadas',
	],
	familia: [
		'Restaurantes para niños',
		'Centros de juegos interiores',
		'Jugueterías',
		'Museos infantiles',
		'Parques',
	],
	mascotas: ['Tiendas de mascotas', 'Veterinarios', 'Peluquerías'],
} as const;

// A partir de aquí TS sabe que CategoryKey es uno de los strings arriba
type CategoryKey = keyof typeof subcategories;

const FilterCategories = () => {
	const t = useTranslations();

	// Ahora el estado solo puede ser uno de los CategoryKey
	const [category, setCategory] = useState<CategoryKey>('alojamiento');

	const CATEGORY_OPTIONS: SelectOption<CategoryKey>[] = [
		{ value: 'alojamiento', label: t('El Alojamiento') },
		{ value: 'salud', label: t('Salud y Bienestar') },
		{ value: 'comida', label: t('Comida y Bebida') },
		{ value: 'arte', label: t('Arte y Cultura') },
		{ value: 'parques', label: t('Parques y Naturaleza') },
		{ value: 'compras', label: t('Compras') },
		{ value: 'servicios', label: t('Servicios') },
		{ value: 'transporte', label: t('Transporte') },
		{
			value: 'entretenimiento',
			label: t('Entretenimiento y Vida Nocturna'),
		},
		{ value: 'atracciones', label: t('Atracciones y Turismo') },
		{ value: 'seguridad', label: t('Seguridad y Emergencias') },
		{ value: 'familia', label: t('Familia y Niños') },
		{ value: 'mascotas', label: t('Mascotas') },
	];

	return (
		<div className="pr-4 pl-6">
			<Select
				label={t('Selecciona una categoría')}
				name="category"
				options={CATEGORY_OPTIONS}
				value={category}
				onChange={setCategory}
				placeholder={t('Selecciona')}
				className="mb-4"
			/>
			<div className="flex flex-wrap gap-1">
				{subcategories[category].map((item) => (
					<Badge color="success" key={item} label={t(item)} />
				))}
			</div>
		</div>
	);
};

export default FilterCategories;
