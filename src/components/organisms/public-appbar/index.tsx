import Image from "next/image";

import Link from "next/link";
import LanguageSelector from "@/components/molecules/language-selector";
import MenuIconButton from "../appbar/menu-icon-button";

type PublicAppBarProps = {
    className?: string;
    propertyId?: string;
    propertyName?: string;
    propertyLogoUrl?: string | null;
};

const PublicAppBar = ({
    className = "",
    propertyId,
    propertyName,
    propertyLogoUrl,
}: PublicAppBarProps) => {
    const publicUrl = `${process.env.NEXT_PUBLIC_APP_URL}/public/${propertyId}/welcome/highlights`;

    const logoSrc = propertyLogoUrl || "/static/img/symbol_colored@2x.webp";
    const logoAlt = propertyLogoUrl
        ? `${propertyName || "Property"} logo`
        : "Icon Logo";

    return (
        <div
            className={`w-full shadow-xs ml-auto mr-auto flex gap-1 items-center justify-between rounded-lg p-4 bg-white transition-all ${className}`}
        >
            <Link href={publicUrl} className="flex items-center w-fit gap-2">
                <div className="relative w-[40px] h-[40px] rounded-lg overflow-hidden">
                    <Image
                        src={logoSrc}
                        fill
                        alt={logoAlt}
                        sizes="40px"
                        style={{ objectFit: "cover" }}
                    />
                </div>
                <h1 className="hidden md:block font-heading font-bold text-lg">
                    {propertyName || "BNBexplorer"}
                </h1>
            </Link>
            <div className="w-fit justify-end md:justify-end flex gap-1">
                <LanguageSelector triggerColor="white" />
                <MenuIconButton />
            </div>
        </div>
    );
};

export default PublicAppBar;
