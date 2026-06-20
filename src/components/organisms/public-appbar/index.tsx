import Image from "next/image";

import Link from "next/link";
import LanguageSelector from "@/components/molecules/language-selector";
import MenuIconButton from "../appbar/menu-icon-button";

type PublicAppBarProps = {
    className?: string;
};

const PublicAppBar = ({ className = "" }: PublicAppBarProps) => {
    return (
        <div
            className={`w-full shadow-xs ml-auto mr-auto flex gap-1 items-center rounded-lg p-4 bg-white transition-all ${className}`}
        >
            <Link href="/" className="flex items-center">
                <div className="relative mr-3 w-[40px] h-[50px]">
                    <Image
                        src="/static/img/symbol_shadow_colored@2x.webp"
                        fill
                        alt="Icon Logo"
                        sizes="40px"
                        style={{ objectFit: "contain" }}
                    />
                </div>
                <h1 className="hidden md:block font-heading font-medium text-primary-500 text-md">
                    BNBexplorer
                </h1>
            </Link>
            <div className="w-full justify-end md:justify-end flex gap-1">
                <LanguageSelector triggerColor="white" />
                <MenuIconButton />
            </div>
        </div>
    );
};

export default PublicAppBar;
