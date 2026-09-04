"use client";

import { useEffect, useRef, useState } from "react";

type StickyHeaderProps = {
    children: React.ReactNode;
    className?: string;
};

export function StickyHeader({ children, className = "" }: StickyHeaderProps) {
    const sentinelRef = useRef<HTMLDivElement>(null);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const sentinel = sentinelRef.current;
        if (!sentinel) return;

        // Cuando el centinela (colocado justo antes del header, en lo
        // más alto de la página) deja de intersectar con el viewport,
        // significa que el usuario ha hecho scroll.
        const observer = new IntersectionObserver(
            ([entry]) => setIsScrolled(!entry.isIntersecting),
            { threshold: 0 },
        );

        observer.observe(sentinel);
        return () => observer.disconnect();
    }, []);

    return (
        <>
            <div ref={sentinelRef} aria-hidden="true" className="h-px w-full" />
            <header
                className={`sticky top-0 z-50 transition-shadow duration-200 ${
                    isScrolled ? "shadow-xs" : "shadow-none"
                } ${className}`}
            >
                {children}
            </header>
        </>
    );
}
