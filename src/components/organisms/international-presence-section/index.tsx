import { getLocale, getTranslations } from "next-intl/server";
import { COUNTRIES_PRESENCE, type Locale } from "@/config/config-constants";
import { CountryPinsCarousel } from "@/components/organisms/country-pins-carousel";
import Typography from "@/components/atoms/typography";
import Rating from "@/components/molecules/rating";

export async function InternationalPresenceSection() {
    // Lista estática (config-constants.ts), sin query detrás.
    // Esta guarda no protege de un dato "vacío por casualidad" (no puede
    // pasar solo, alguien tendría que vaciar el archivo a mano) — protege
    // de que, si algún día pasa, la sección no se renderice rota.
    if (COUNTRIES_PRESENCE.length === 0) return null;

    // next-intl expone getLocale() como string por defecto; si vuestro
    // middleware.ts usa "typed routing" puede que ya devuelva Locale sin
    // cast — a confirmar contra vuestra configuración real.
    const locale = (await getLocale()) as Locale;
    const t = await getTranslations();

    return (
        <section
            aria-labelledby="international-presence-title"
            className="w-full max-w-[1280px] mx-auto bg-white flex flex-col gap-8 justify-center items-center py-12 border-b border-gray-200 relative px-4"
        >
            <div className="flex flex-col gap-2 justify-center w-full max-w-[800px] mx-auto relative">
                <Typography
                    component="h2"
                    className="text-center text-2xl! sm:text-4xl!"
                    lineHeight="tight"
                    weight="semibold"
                    color="black"
                    id="features"
                >
                    {t("home_page.international_presence.title")}
                </Typography>
                <Typography
                    className="text-center text-lg sm:text-2xl! text-gray-900/60"
                    fontFamily="base"
                    weight="light"
                >
                    {t("home_page.international_presence.subtitle")}
                </Typography>
            </div>
            <Rating
                label={t("home_page.hero.rating")}
                className="px-4 max-w-xs text-center"
            />
            <CountryPinsCarousel
                countries={COUNTRIES_PRESENCE}
                locale={locale}
            />
        </section>
    );
}
