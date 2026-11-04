"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Devuelve `value` actualizado como mucho una vez cada `delay` ms.
 * - Leading: el primer cambio tras una pausa se aplica al momento.
 * - Trailing: el último cambio de cada ventana se aplica al cerrarla,
 *   así nunca se pierde el valor final (p. ej. la última tecla).
 * Pensado para lo que se deriva de un input (filtrar), nunca para el
 * `value` del propio input, que debe actualizarse en cada pulsación.
 */
export function useThrottledValue<T>(value: T, delay: number): T {
    const [throttledValue, setThrottledValue] = useState(value);
    const lastRunRef = useRef(0);

    useEffect(() => {
        const elapsed = Date.now() - lastRunRef.current;

        if (elapsed >= delay) {
            lastRunRef.current = Date.now();
            setThrottledValue(value);
            return;
        }

        // Cada cambio dentro de la ventana reemplaza al anterior: solo se
        // aplica el último, al terminar la ventana en curso
        const timeoutId = window.setTimeout(() => {
            lastRunRef.current = Date.now();
            setThrottledValue(value);
        }, delay - elapsed);

        return () => window.clearTimeout(timeoutId);
    }, [value, delay]);

    return throttledValue;
}
