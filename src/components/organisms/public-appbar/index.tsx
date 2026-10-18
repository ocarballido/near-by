import Image from "next/image";

import Link from "next/link";
import LanguageSelector from "@/components/molecules/language-selector";

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
            className={`w-full ml-auto mr-auto flex gap-1 items-center justify-between p-4 transition-all bg-white md:bg-transparent ${className}`}
        >
            <Link
                href={publicUrl}
                className="flex items-center w-fit min-w-0 gap-2"
            >
                <div className="relative shrink-0 w-[40px] h-[40px] rounded-lg overflow-hidden">
                    <Image
                        src={logoSrc}
                        fill
                        alt={logoAlt}
                        sizes="40px"
                        style={{ objectFit: "cover" }}
                    />
                </div>
                <h1 className="truncate font-heading font-bold text-base leading-5 md:text-lg">
                    {propertyName || "BNBexplorer"}
                </h1>
            </Link>
            <div className="w-fit shrink-0 justify-end md:justify-end flex gap-1">
                <LanguageSelector triggerColor="secondary" />
            </div>
        </div>
    );
};

export default PublicAppBar;
