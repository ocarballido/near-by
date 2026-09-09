"use client";

import clsx from "clsx";
import {
    Listbox,
    ListboxButton,
    ListboxOptions,
    ListboxOption,
} from "@headlessui/react";
import IconCircle from "../icon/circle";
import IconCheckCircle from "../icon/check-circle";
import IconKeyboardArrowDown from "../icon/keyboard-arrow-down";

export type BadgeCheckedColor =
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "info"
    | "error"
    | "body"
    | "light"
    | "white";

type BadgeCheckCountProps = {
    label: string;
    checked: boolean;
    count: number;
    onToggle: () => void;
    onCountChange: (count: number) => void;
    min?: number;
    max?: number;
    checkedColor?: BadgeCheckedColor;
    className?: string;
    countAriaLabel?: string;
};

const BadgeCheckCount = ({
    label,
    checked,
    count,
    onToggle,
    onCountChange,
    min = 1,
    max = 5,
    checkedColor = "primary",
    className = "",
    countAriaLabel,
}: BadgeCheckCountProps) => {
    const countOptions = Array.from(
        { length: max - min + 1 },
        (_, i) => min + i,
    );

    const outerStyles = clsx(
        `rounded-full inline-flex items-center gap-1 font-bold text-xs pl-1.5 pr-1 py-1 min-h-[32px] cursor-pointer select-none transition-colors ${className}`,
        {
            "bg-secondary-200 text-secondary-900 hover:bg-secondary-300":
                !checked,
        },
        {
            "bg-primary-100 text-primary-900 hover:bg-primary-200":
                checkedColor === "primary" && checked,
        },
        {
            "bg-secondary-100 text-secondary-900 hover:bg-secondary-200":
                checkedColor === "secondary" && checked,
        },
        {
            "bg-success-100 text-success-900 hover:bg-success-200":
                checkedColor === "success" && checked,
        },
        {
            "bg-warning-100 text-warning-900 hover:bg-warning-200":
                checkedColor === "warning" && checked,
        },
        {
            "bg-info-100 text-info-900 hover:bg-info-200":
                checkedColor === "info" && checked,
        },
        {
            "bg-error-100 text-error-900 hover:bg-error-200":
                checkedColor === "error" && checked,
        },
        {
            "bg-gray-800 text-gray-200 hover:bg-gray-950":
                checkedColor === "body" && checked,
        },
        {
            "bg-gray-300 text-gray-900 hover:bg-gray-300":
                checkedColor === "light" && checked,
        },
        {
            "bg-gray-100 text-gray-900 hover:bg-gray-300":
                checkedColor === "white" && checked,
        },
    );

    const iconColor =
        checkedColor === "body"
            ? "white"
            : checkedColor === "white"
              ? "body"
              : checkedColor;

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onToggle();
        }
    };

    // Igual que en las dos implementaciones anteriores: solo bloqueamos
    // la propagación cuando el dropdown es interactivo (checked). Si está
    // disabled, el click debe subir al padre y togglear con normalidad.
    const handleDropdownClick = (e: React.MouseEvent) => {
        if (checked) e.stopPropagation();
    };

    return (
        <div
            role="button"
            tabIndex={0}
            aria-pressed={checked}
            onClick={onToggle}
            onKeyDown={handleKeyDown}
            className={outerStyles}
        >
            {checked ? (
                <span className="shrink-0">
                    <IconCheckCircle color={iconColor} size={20} />
                </span>
            ) : (
                <span className="opacity-50 shrink-0">
                    <IconCircle color="light" size={20} />
                </span>
            )}
            <span>{label}</span>

            <Listbox
                as="div"
                value={count}
                onChange={onCountChange}
                disabled={!checked}
                onClick={handleDropdownClick}
                className={clsx(
                    "inline-flex items-center bg-white rounded-full ml-1",
                    !checked && "opacity-40",
                )}
            >
                <ListboxButton
                    aria-label={countAriaLabel ?? `Cantidad para ${label}`}
                    className="inline-flex items-center gap-0.5 pl-2 pr-1.5 py-1 rounded-full font-bold text-xs cursor-pointer disabled:cursor-not-allowed outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                >
                    {count}
                    <IconKeyboardArrowDown size={16} />
                </ListboxButton>

                <ListboxOptions
                    anchor="bottom end"
                    className="bg-white rounded-lg shadow-lg border border-gray-200 py-1 min-w-[64px] z-50 [--anchor-gap:4px]"
                >
                    {countOptions.map((n) => (
                        <ListboxOption
                            key={n}
                            value={n}
                            className="px-3 py-1.5 text-xs font-bold text-gray-900 rounded cursor-pointer select-none data-focus:bg-secondary-100 data-selected:bg-primary-100 data-selected:text-primary-900"
                        >
                            {n}
                        </ListboxOption>
                    ))}
                </ListboxOptions>
            </Listbox>
        </div>
    );
};

export default BadgeCheckCount;
