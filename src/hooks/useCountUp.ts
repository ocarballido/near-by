'use client';

import { useEffect, useRef, useState } from 'react';

const DURATION_MS = 900;
const TICK_MS = 30;

export function useCountUp(target: number): number {
	const [count, setCount] = useState(0);
	const targetRef = useRef(target);

	useEffect(() => {
		targetRef.current = target;

		if (target === 0) {
			setCount(0);
			return;
		}

		let current = 0;
		const steps = DURATION_MS / TICK_MS;
		const increment = target / steps;

		const timer = setInterval(() => {
			current = Math.min(current + increment, targetRef.current);
			setCount(Math.floor(current));

			if (current >= targetRef.current) clearInterval(timer);
		}, TICK_MS);

		return () => clearInterval(timer);
	}, [target]);

	return count;
}
