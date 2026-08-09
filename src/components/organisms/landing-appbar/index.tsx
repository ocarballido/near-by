import Image from "next/image";

import Link from "next/link";
import LandingAuthButton from "../landing-auth-buttons/LandingAuthButton";

type LandingAppBarProps = {
    className?: string;
};

const LandingAppBar = ({ className = "" }: LandingAppBarProps) => {
    return (
        <div
            className={`w-full shadow-xs flex items-center rounded-lg p-4 bg-white transition-all ${className}`}
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
            <LandingAuthButton />
        </div>
    );
};

export default LandingAppBar;
