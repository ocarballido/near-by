"use client";

import { useLocale, useTranslations } from "next-intl";

import { useDropdown } from "@/hooks/useDropdown";
import { usePrintQr } from "@/hooks/usePrintQr";
import { formatTime } from "@/utils/format-date-time";
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
import Button from "@/components/molecules/button";
import ButtonLink from "@/components/molecules/button-link";
import DropdownItem from "@/components/molecules/dropdown-item";
import DropdownItemButton from "@/components/molecules/dropdown-item-button";
import QrPrintContent from "@/components/molecules/qr-print-content";

type PropertyDropdownProps = {
    property: PropertyMenuData;
};

const PropertyDropdown = ({ property }: PropertyDropdownProps) => {
    const t = useTranslations();
    const locale = useLocale();

    const { open, toggleDropdown, closeDropdown, dropdownRef } = useDropdown();
    const { qrRef, printQr } = usePrintQr();

    // Solo las horas que existan: las fechas no se muestran en el menú
    const schedule = [
        {
            key: "checkIn",
            icon: <IconCheckIn color="primary" />,
            label: t("propertyMenuCheckIn"),
            time: formatTime(property.check_in_time, locale),
        },
        {
            key: "checkOut",
            icon: <IconCheckOut color="primary" />,
            label: t("propertyMenuCheckOut"),
            time: formatTime(property.check_out_time, locale),
        },
    ].filter((item) => item.time);

    const publicPath = `/public/${property.id}/welcome/highlights`;

    return (
        <div ref={dropdownRef} className="relative min-w-0">
            {/* max-w-full: un <button> toma el ancho de su contenido y, sin
                tope, el nombre largo no llega a truncarse */}
            <Button
                ariaExpanded={open}
                ariaHasPopup
                className="min-w-0 max-w-full"
                color="primary"
                iconRight={
                    <span className="shrink-0 flex">
                        {open ? (
                            <IconKeyboardArrowUp />
                        ) : (
                            <IconKeyboardArrowDown />
                        )}
                    </span>
                }
                label={property.name}
                onClick={toggleDropdown}
                truncate
            />

            <DropdownMenu
                open={open}
                className="absolute z-50 left-0 top-11 w-64 max-w-[calc(100vw-2rem)] p-2! gap-1! rounded-2xl! shadow-[0_4px_16px_rgba(0,0,0,0.2)]!"
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
                                    <p className="min-w-0 text-sm font-medium text-secondary-600">
                                        <span className="sr-only">
                                            {`${item.label} `}
                                        </span>
                                        {item.time}
                                    </p>
                                </div>
                            ))}
                        </div>
                        <hr className="my-1 border-gray-200" />
                    </>
                )}

                <DropdownItem
                    className="min-h-10 px-4!"
                    icon={<IconEdit size={20} />}
                    label={t("Editar")}
                    href={`/app/properties/edit/${property.id}?from=manage`}
                    onClick={closeDropdown}
                />
                <DropdownItemButton
                    className="min-h-10 px-4!"
                    icon={<IconQrCode size={20} />}
                    label={t("propertyMenuQrCode")}
                    onClick={() => {
                        printQr();
                        closeDropdown();
                    }}
                />
                <DropdownItem
                    className="min-h-10 px-4!"
                    icon={<IconApartment size={20} />}
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
                        label={t("propertyMenuPublicGuide")}
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
