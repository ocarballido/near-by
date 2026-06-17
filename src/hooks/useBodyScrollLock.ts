"use client";
import { useEffect, useRef } from "react";

export function useBodyScrollLock(isLocked: boolean) {
    const scrollY = useRef(0);

    useEffect(() => {
        if (!isLocked) return;

        scrollY.current = window.scrollY;
        const { style } = document.body;

        style.position = "fixed";
        style.top = `-${scrollY.current}px`;
        style.left = "0";
        style.right = "0";
        style.width = "100%";

        return () => {
            style.position = "";
            style.top = "";
            style.left = "";
            style.right = "";
            style.width = "";
            window.scrollTo(0, scrollY.current);
        };
    }, [isLocked]);
}
