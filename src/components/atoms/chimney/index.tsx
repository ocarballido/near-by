'use client';
import React, { useEffect, useRef } from 'react';
import clsx from 'clsx';
import styles from './chimney.module.css';

type Mode = 'bubble' | 'image';

interface ChimneyEffectProps {
	mode: Mode;
	images?: string[];
	className?: string;
	size?: number; // px (default: 24)
	frequency?: number; // ms between spawns (default: 400)
	duration?: number; // ms per element (default: 3000)
	colors?: string[];
}

const defaultColors = [
	'#FF6B6B', // coral rojo
	'#6BCB77', // verde menta
	'#4D96FF', // azul vibrante
	'#FFD93D', // amarillo sol pastel
	'#FF9CEE', // rosa chicle pastel
	'#845EC2', // púrpura vibrante
	'#FF6F91', // rosado brillante
	'#B0F2B6', // verde agua pastel
	'#FFC75F', // naranja pastel
	'#A0E7E5', // celeste pastel
];

const ChimneyEffect: React.FC<ChimneyEffectProps> = ({
	mode,
	images,
	className,
	size = 24,
	frequency = 400,
	duration = 3000,
	colors,
}) => {
	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const createElement = () => {
			let element: HTMLElement;

			const usedColors = colors ?? defaultColors;

			if (mode === 'bubble') {
				element = document.createElement('div');
				element.className = styles.bubble;
				element.style.background =
					usedColors[Math.floor(Math.random() * usedColors.length)];
			} else {
				if (!images || images.length === 0) return;
				const img = document.createElement('img');
				img.className = styles.bubbleImage;
				img.src = images[Math.floor(Math.random() * images.length)];
				element = img;
			}

			const drift = Math.random() * 160 - 80; // ❗ -80 to +80 (más caos lateral)
			const rotation = Math.random() * 60 - 30; // -30 to +30deg
			const scale = 0.8 + Math.random() * 1.2; // 0.8 to 2
			const durationMs = duration + Math.random() * 2000 - 500; // más margen aleatorio

			element.style.setProperty('--x', `${drift}px`);
			element.style.setProperty('--r', `${rotation}deg`);
			element.style.setProperty('--s', `${scale}`); // sigue igual
			element.style.setProperty('--sStart', `${scale * 0.2}`);
			element.style.left = '50%';
			element.style.bottom = '0';
			element.style.width = `${size}px`;
			element.style.height = mode === 'bubble' ? `${size}px` : 'auto';
			element.style.animationDuration = `${durationMs}ms`;
			element.style.position = 'absolute';

			containerRef.current?.appendChild(element);
			setTimeout(() => element.remove(), durationMs);
		};

		const interval = setInterval(createElement, frequency);
		return () => clearInterval(interval);
	}, [mode, images, size, frequency, duration, colors]);

	const combinedClass = clsx(styles.chimney, className);

	return <div className={combinedClass} ref={containerRef}></div>;
};

export default ChimneyEffect;
