"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";

import { useDropdown } from "@/hooks/useDropdown";
import { usePrintQr } from "@/hooks/usePrintQr";
import { formatDate, formatTime } from "@/utils/format-date-time";
import type { PropertyMenuData } from "@/lib/context/PropertyMenuContext";

import DropdownMenu from "@/components/atoms/dropdown-menu";
import IconApartment from "@/components/atoms/icon/apartment";
import IconCheckIn from "@/components/atoms/icon/check-in";
import IconCheckOut from "@/components/atoms/icon/check-out";
import IconEdit from "@/components/atoms/icon/edit";
import IconKeyboardArrowDown from "@/components/atoms/icon/keyboard-arrow-down";
import IconKeyboardArrowUp from "@/components/atoms/icon/keyboard-arrow-up";
import IconOpenInNew from "@/components/atoms/icon/open-in-new";
import IconQrCode from "@/components/atoms/icon/qr-code";
import ButtonLink from "@/components/molecules/button-link";
import DropdownItem from "@/components/molecules/dropdown-item";
import DropdownItemButton from "@/components/molecules/dropdown-item-button";
import QrPrintContent from "@/components/molecules/qr-print-content";

type PropertyDropdownProps = {
    property: PropertyMenuData;
};

const DEFAULT_LOGO = "/static/img/symbol_colored@2x.webp";

const PropertyDropdown = ({ property }: PropertyDropdownProps) => {
    const t = useTranslations();
    const locale = useLocale();

    const { open, toggleDropdown, closeDropdown, dropdownRef } = useDropdown();
    const { qrRef, printQr } = usePrintQr();

    // Solo los horarios con algún dato; fecha y hora van en líneas separadas
    // porque cada columna no da para las dos en una sola
    const schedule = [
        {
            key: "checkIn",
            icon: <IconCheckIn color="primary" />,
            label: t("propertyMenuCheckIn"),
            date: formatDate(property.check_in_date, locale),
            time: formatTime(property.check_in_time, locale),
        },
        {
            key: "checkOut",
            icon: <IconCheckOut color="primary" />,
            label: t("propertyMenuCheckOut"),
            date: formatDate(property.check_out_date, locale),
            time: formatTime(property.check_out_time, locale),
        },
    ].filter((item) => item.date || item.time);

    const publicPath = `/public/${property.id}/welcome/highlights`;

    // isolate mantiene el trigger sobre el panel; z-50 solo abierto para no
    // quedar por encima del overlay del sidebar (z-10) con el menú cerrado
    return (
        <div
            ref={dropdownRef}
            className={`relative isolate min-w-0 ${open ? "z-50" : ""}`}
        >
            {/* El trigger queda por encima del panel, que se abre detrás de él.
                max-w-full: un <button> toma el ancho de su contenido y, sin
                tope, el nombre largo no llega a truncarse */}
            <button
                type="button"
                aria-expanded={open}
                aria-haspopup="true"
                onClick={toggleDropdown}
                className="relative z-20 flex items-center gap-2 min-w-0 max-w-full h-10 hover:cursor-pointer"
            >
                {/* En móvil el AppBar va justo de sitio: se prioriza el nombre */}
                <span className="relative shrink-0 w-10 h-10 rounded-lg overflow-hidden max-md:hidden">
                    <Image
                        src={property.logo_url || DEFAULT_LOGO}
                        fill
                        alt=""
                        sizes="40px"
                        style={{ objectFit: "cover" }}
                    />
                </span>
                <span className="truncate text-base font-medium">
                    {property.name}
                </span>
                <span className="shrink-0 flex">
                    {open ? <IconKeyboardArrowUp /> : <IconKeyboardArrowDown />}
                </span>
            </button>

            <DropdownMenu
                open={open}
                className="absolute -top-2 -left-2 w-64 max-w-[calc(100vw-2rem)] px-2! pb-2! pt-16! rounded-2xl! shadow-[0_4px_16px_rgba(0,0,0,0.2)]!"
            >
                {schedule.length > 0 && (
                    <>
                        <div className="grid grid-cols-2 gap-4">
                            {schedule.map((item) => (
                                <div
                                    key={item.key}
                                    className="flex items-center min-w-0"
                                >
                                    <span className="shrink-0 flex justify-center items-center w-10 h-10">
                                        {item.icon}
                                    </span>
                                    <p className="flex flex-col min-w-0 text-sm text-secondary-600">
                                        <span className="sr-only">
                                            {item.label}
                                        </span>
                                        {item.date && <span>{item.date}</span>}
                                        {item.time && <span>{item.time}</span>}
                                    </p>
                                </div>
                            ))}
                        </div>
                        <hr className="border-gray-200" />
                    </>
                )}

                <DropdownItem
                    className="min-h-10 px-4! text-base!"
                    icon={<IconEdit />}
                    label={t("Editar")}
                    href={`/app/properties/edit/${property.id}?from=manage`}
                    onClick={closeDropdown}
                />
                <DropdownItemButton
                    className="min-h-10 px-4! text-base!"
                    icon={<IconQrCode />}
                    label={t("propertyMenuQrCode")}
                    onClick={() => {
                        printQr();
                        closeDropdown();
                    }}
                />
                <DropdownItem
                    className="min-h-10 px-4! text-base!"
                    icon={<IconApartment />}
                    label={t("Mis propiedades")}
                    href="/app/properties"
                    onClick={closeDropdown}
                />
                {/* ButtonLink no acepta onClick: el clic sube hasta aquí */}
                <div onClick={closeDropdown}>
                    <ButtonLink
                        className="w-full"
                        color="primary"
                        iconRight={<IconOpenInNew />}
                        label={t("Sitio público")}
                        href={publicPath}
                        target="_blank"
                    />
                </div>
            </DropdownMenu>

            <QrPrintContent
                ref={qrRef}
                url={`${process.env.NEXT_PUBLIC_APP_URL}${publicPath}`}
            />
        </div>
    );
};

export default PropertyDropdown;
