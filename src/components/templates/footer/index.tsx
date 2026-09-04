"use client";

import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";

import Image from "next/image";
import Link from "next/link";

import Typography from "@/components/atoms/typography";
import { ShareMenu } from "@/components/molecules/button-share";

import logo from "../../../../public/static/img/brand_colored.webp";

const Footer = () => {
    const t = useTranslations();

    const path = usePathname();

    const pathWithoutLocale = path.replace(/^\/[a-z]{2}(-[A-Z]{2})?/, "");
    if (
        pathWithoutLocale.startsWith("/app") ||
        pathWithoutLocale.startsWith("/public")
    )
        return null;

    return (
        <footer className="text-center py-12 px-4 flex flex-col gap-4 items-center">
            <div className="flex flex-col gap-4 w-full max-w-[1280px] mx-auto border-t border-gray-200 pt-12">
                <Image
                    src={logo}
                    width={185}
                    height={30}
                    alt="BNBexplorer logo"
                />
                <div className="flex flex-col md:flex-row gap-4 justify-between">
                    <div className="flex flex-col gap-3">
                        <p className="text-sm text-gray-400 font-body text-left w-full max-w-[400px]">
                            <span className="font-bold">
                                BNBexplorer &#169; {new Date().getFullYear()}:
                            </span>{" "}
                            {t("home_page.footer.description")}
                        </p>
                        <ShareMenu
                            url="https://bnbexplorer.com"
                            surface="landing_header"
                            distinctId="anon-missing"
                        />
                    </div>
                    <div className="flex flex-col gap-3"></div>
                    <div className="px-4 flex flex-col sm:flex-row gap-4 font-body text-xs underline opacity-50">
                        <Link href="/legal/conditions">
                            {t("Términos y Condiciones")}
                        </Link>
                        <Link href="/legal/notice">{t("Aviso Legal")}</Link>
                        <Link href="/legal/privacy">
                            {t("Política de privacidad")}
                        </Link>
                        <Link href="/legal/content">{t("Contenido")}</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
