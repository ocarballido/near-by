import { useTranslations } from "next-intl";

import Image from "next/image";

import Link from "next/link";
import LandingAuthButton from "../landing-auth-buttons/LandingAuthButton";
import ButtonLink from "@/components/molecules/button-link";
import { useTransition } from "react";
import IconOpenInNew from "@/components/atoms/icon/open-in-new";

type LandingAppBarProps = {
    className?: string;
};

const LandingAppBar = ({ className = "" }: LandingAppBarProps) => {
    const t = useTranslations();

    return (
        <div
            className={`w-full shadow-xs flex items-center rounded-lg p-4 transition-all ${className}`}
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
                <h1 className="hidden md:block font-heading font-semibold text-gray-800 text-sm">
                    BNBexplorer
                </h1>
            </Link>
            <ButtonLink
                href="https://www.bnbexplorer.com/es/public/37a03a95-cd39-4d40-a22b-7628cbb50245/welcome/highlights"
                label={t("home_page.hero.action_label")}
                color="white"
                target="_blank"
                className="shadow-xs ml-3 border border-primary-200 text-nowrap hidden md:flex"
                iconRight={<IconOpenInNew />}
            />
            <LandingAuthButton />
        </div>
    );
};

export default LandingAppBar;
