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
                    isScrolled
                        ? "shadow-xs bg-white/80"
                        : "shadow-none bg-white"
                } ${className}`}
            >
                {children}
            </header>
        </>
    );
}
