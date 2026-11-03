"use client";

import {
    useCallback,
    useEffect,
    useLayoutEffect,
    useRef,
    useState,
    type FocusEvent,
    type PointerEvent,
    type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import clsx from "clsx";

type TooltipProps = {
    label: string;
    // Debe ser enfocable (botón, enlace) para que funcione con teclado
    children: ReactNode;
    className?: string;
};

type Position = {
    top: number;
    left: number;
    arrowLeft: number;
    placement: "top" | "bottom";
};

// Separación entre el disparador y la pill: deja sitio al triángulo (6px)
const OFFSET = 8;
// Distancia mínima a los bordes de la pantalla
const VIEWPORT_MARGIN = 8;
// Medio triángulo (6px) más el radio de la pill: el triángulo nunca se sale
const ARROW_INSET = 6 + 13;

// Safari < 15.4 no soporta :focus-visible y matches() lanza. Ahí tocar no
// enfoca botones, así que el foco viene del teclado
const isKeyboardFocus = (element: HTMLElement): boolean => {
    try {
        return element.matches(":focus-visible");
    } catch {
        return true;
    }
};

const Tooltip = ({ label, children, className }: TooltipProps) => {
    const triggerRef = useRef<HTMLSpanElement>(null);
    const tooltipRef = useRef<HTMLSpanElement>(null);

    const [open, setOpen] = useState(false);
    const [position, setPosition] = useState<Position | null>(null);

    // La posición se borra en el mismo render que cierra: al volver a abrir
    // se mide de cero, sin renders extra
    const close = useCallback(() => {
        setOpen(false);
        setPosition(null);
    }, []);

    // Se mide antes de pintar: primero se renderiza oculta, luego se coloca.
    // Arriba por defecto; si no cabe, en el lado con más espacio. En
    // horizontal se ajusta a la pantalla y el triángulo sigue apuntando al
    // centro del disparador
    useLayoutEffect(() => {
        if (!open) return;

        const trigger = triggerRef.current?.getBoundingClientRect();
        const tooltip = tooltipRef.current?.getBoundingClientRect();
        if (!trigger || !tooltip) return;

        const fitsAbove =
            trigger.top - OFFSET - tooltip.height >= VIEWPORT_MARGIN;
        const placeAbove =
            fitsAbove || trigger.top > window.innerHeight - trigger.bottom;
        const center = trigger.left + trigger.width / 2;
        // El max-w de la pill garantiza que cabe a lo ancho
        const left = Math.min(
            Math.max(center - tooltip.width / 2, VIEWPORT_MARGIN),
            window.innerWidth - tooltip.width - VIEWPORT_MARGIN,
        );

        setPosition({
            placement: placeAbove ? "top" : "bottom",
            top: placeAbove
                ? trigger.top - OFFSET - tooltip.height
                : trigger.bottom + OFFSET,
            left,
            arrowLeft: Math.min(
                Math.max(center - left, ARROW_INSET),
                tooltip.width - ARROW_INSET,
            ),
        });
    }, [open, label]);

    // Abierta, se cierra al tocar fuera, con scroll, al redimensionar o con
    // Escape. Con scroll se cierra en lugar de seguir al disparador
    useEffect(() => {
        if (!open) return;

        const handlePointerDown = (event: globalThis.PointerEvent) => {
            if (!triggerRef.current?.contains(event.target as Node)) close();
        };
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") close();
        };

        document.addEventListener("pointerdown", handlePointerDown, true);
        document.addEventListener("keydown", handleKeyDown);
        window.addEventListener("scroll", close, {
            capture: true,
            passive: true,
        });
        window.addEventListener("resize", close);

        return () => {
            document.removeEventListener("pointerdown", handlePointerDown, true);
            document.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("scroll", close, { capture: true });
            window.removeEventListener("resize", close);
        };
    }, [open, close]);

    // Ratón: hover. Táctil: tocar abre y vuelve a cerrar
    const handlePointerEnter = (event: PointerEvent) => {
        if (event.pointerType === "mouse") setOpen(true);
    };
    const handlePointerLeave = (event: PointerEvent) => {
        if (event.pointerType === "mouse") close();
    };
    const handlePointerUp = (event: PointerEvent) => {
        if (event.pointerType === "mouse") return;
        if (open) close();
        else setOpen(true);
    };

    // Solo el foco de teclado: Android también enfoca al tocar, y eso ya lo
    // gestiona handlePointerUp
    const handleFocus = (event: FocusEvent) => {
        if (isKeyboardFocus(event.target as HTMLElement)) setOpen(true);
    };

    return (
        <span
            ref={triggerRef}
            className={clsx("inline-flex", className)}
            onPointerEnter={handlePointerEnter}
            onPointerLeave={handlePointerLeave}
            onPointerUp={handlePointerUp}
            onFocus={handleFocus}
            onBlur={close}
        >
            {children}
            {/* Portal a body: no le afectan overflow, z-index ni transform de
                los contenedores. Solo existe abierta, así que no hay SSR */}
            {open &&
                createPortal(
                    <span
                        ref={tooltipRef}
                        role="tooltip"
                        style={{
                            top: position?.top ?? 0,
                            left: position?.left ?? 0,
                        }}
                        className={clsx(
                            // Sin nowrap y con max-w: un texto largo pasa a
                            // varias líneas en vez de salirse de la pantalla.
                            // Radio 13px = pill en una línea (26px de alto)
                            "fixed z-50 w-max max-w-[calc(100vw-16px)] px-3 py-1.5 rounded-[13px] bg-white shadow-md text-center pointer-events-none text-xs leading-3.5 font-medium text-gray-600",
                            position ? "visible" : "invisible",
                        )}
                    >
                        {label}
                        {position && (
                            <span
                                style={{ left: position.arrowLeft - 6 }}
                                className={clsx(
                                    "absolute w-0 h-0 border-x-[6px] border-x-transparent",
                                    position.placement === "top"
                                        ? "top-full border-t-[6px] border-t-white"
                                        : "bottom-full border-b-[6px] border-b-white",
                                )}
                            />
                        )}
                    </span>,
                    document.body,
                )}
        </span>
    );
};

export default Tooltip;
