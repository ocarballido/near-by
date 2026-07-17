import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { redirect } from "@/i18n/routing";
import { getMaintenanceConfig } from "@/lib/maintenance";
import ButtonLink from "@/components/molecules/button-link";
import { PAGES } from "@/config/config-constants";
import Typography from "@/components/atoms/typography";

type MaintenancePageProps = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({
    params,
}: MaintenancePageProps): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "maintenance" });

    return {
        title: t("title"),
        description: t("description"),
        robots: {
            index: false,
            follow: false,
        },
    };
}

/**
 * Forzamos el renderizado dinámico: necesitamos comprobar la variable de
 * entorno en cada petición (para el guard de acceso directo, más abajo).
 * Sin esto, Next.js podría prerenderizar esta página una única vez y
 * servir esa versión cacheada, congelando el valor del flag.
 */
export const dynamic = "force-dynamic";

export default async function MaintenancePage({
    params,
}: MaintenancePageProps) {
    const { locale } = await params;
    const { isEnabled } = getMaintenanceConfig();

    // Si alguien entra a /maintenance directamente y el mantenimiento ya
    // terminó, no tiene sentido mostrar esta página: lo mandamos a la home.
    // El locale hay que pasarlo explícito: esta versión de next-intl ya no
    // lo infiere del contexto de la petición.
    if (!isEnabled) {
        redirect({ href: PAGES.home, locale });
    }

    const t = await getTranslations({ locale, namespace: "maintenance" });

    return (
        <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 py-16 text-center">
            {/*
				Contenedor de tamaño fijo + fill: la imagen se ajusta sin
				deformarse sea cual sea la proporción del PNG/JPG final.
				Ajusta el "src" si le pones otro nombre de archivo en public/.
			*/}
            <div className="flex flex-1 flex-col p-2 bg-white rounded-xl items-center justify-center text-center relative max-w-[400px] max-h-[600px] shadow-xs">
                <div className="relative grow h-full w-full rounded-md overflow-hidden bg-gradient-to-tr from-[#ffa263] to-[#6cffc9]">
                    <Image
                        alt="Mountains"
                        src="/static/img/mail/hero_uncomplite.png"
                        fill={true}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover"
                    />
                </div>
                <div className="p-6 flex flex-col gap-2 w-full">
                    <Typography component="h3" size="lg">
                        {t("title")}
                    </Typography>
                    <Typography className="opacity-70" weight="medium">
                        {t("description")}
                    </Typography>
                </div>
            </div>

            <ButtonLink href={PAGES.home} label={t("retryButton")} />
        </main>
    );
}
