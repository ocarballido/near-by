import { HeroSlide, HeroSlideImages } from ".";
import { DEFAULT_LOCALE, type Locale } from "@/config/config-constants";

// Re-exportado por compatibilidad, por si algo importa `Locale` desde aquí.
export type { Locale };

// hero-01
import hero01EsDesktop from "../../../../public/static/img/home/hero/ui-01_es.png";
import hero01EsMobile from "../../../../public/static/img/home/hero/ui-01_es_mobile.png";
import hero01EnDesktop from "../../../../public/static/img/home/hero/ui-01_en.png";
import hero01EnMobile from "../../../../public/static/img/home/hero/ui-01_en_mobile.png";
import hero01FrDesktop from "../../../../public/static/img/home/hero/ui-01_fr.png";
import hero01FrMobile from "../../../../public/static/img/home/hero/ui-01_fr_mobile.png";

// hero-02
import hero02EsDesktop from "../../../../public/static/img/home/hero/ui-02_es.png";
import hero02EsMobile from "../../../../public/static/img/home/hero/ui-02_es_mobile.png";
import hero02EnDesktop from "../../../../public/static/img/home/hero/ui-02_en.png";
import hero02EnMobile from "../../../../public/static/img/home/hero/ui-02_en_mobile.png";
import hero02FrDesktop from "../../../../public/static/img/home/hero/ui-02_fr.png";
import hero02FrMobile from "../../../../public/static/img/home/hero/ui-02_fr_mobile.png";

// hero-03
import hero03EsDesktop from "../../../../public/static/img/home/hero/ui-03_es.png";
import hero03EsMobile from "../../../../public/static/img/home/hero/ui-03_es_mobile.png";
import hero03EnDesktop from "../../../../public/static/img/home/hero/ui-03_en.png";
import hero03EnMobile from "../../../../public/static/img/home/hero/ui-03_en_mobile.png";
import hero03FrDesktop from "../../../../public/static/img/home/hero/ui-03_fr.png";
import hero03FrMobile from "../../../../public/static/img/home/hero/ui-03_fr_mobile.png";

// hero-04
import hero04EsDesktop from "../../../../public/static/img/home/hero/ui-04_es.png";
import hero04EsMobile from "../../../../public/static/img/home/hero/ui-04_es_mobile.png";
import hero04EnDesktop from "../../../../public/static/img/home/hero/ui-04_en.png";
import hero04EnMobile from "../../../../public/static/img/home/hero/ui-04_en_mobile.png";
import hero04FrDesktop from "../../../../public/static/img/home/hero/ui-04_fr.png";
import hero04FrMobile from "../../../../public/static/img/home/hero/ui-04_fr_mobile.png";

// hero-05
import hero05EsDesktop from "../../../../public/static/img/home/hero/ui-05_es.png";
import hero05EsMobile from "../../../../public/static/img/home/hero/ui-05_es_mobile.png";
import hero05EnDesktop from "../../../../public/static/img/home/hero/ui-05_en.png";
import hero05EnMobile from "../../../../public/static/img/home/hero/ui-05_en_mobile.png";
import hero05FrDesktop from "../../../../public/static/img/home/hero/ui-05_fr.png";
import hero05FrMobile from "../../../../public/static/img/home/hero/ui-05_fr_mobile.png";

type Translator = (key: string) => string;

// Partial: no todos los locales tienen capturas propias todavía (pt/it
// no las tienen aún). resolveImages() cae a DEFAULT_LOCALE cuando falta.
type ImagesByLocale = Partial<Record<Locale, HeroSlideImages>>;

const hero01Images: ImagesByLocale = {
    es: { desktop: hero01EsDesktop, mobile: hero01EsMobile },
    en: { desktop: hero01EnDesktop, mobile: hero01EnMobile },
    fr: { desktop: hero01FrDesktop, mobile: hero01FrMobile },
};
const hero02Images: ImagesByLocale = {
    es: { desktop: hero02EsDesktop, mobile: hero02EsMobile },
    en: { desktop: hero02EnDesktop, mobile: hero02EnMobile },
    fr: { desktop: hero02FrDesktop, mobile: hero02FrMobile },
};
const hero03Images: ImagesByLocale = {
    es: { desktop: hero03EsDesktop, mobile: hero03EsMobile },
    en: { desktop: hero03EnDesktop, mobile: hero03EnMobile },
    fr: { desktop: hero03FrDesktop, mobile: hero03FrMobile },
};
const hero04Images: ImagesByLocale = {
    es: { desktop: hero04EsDesktop, mobile: hero04EsMobile },
    en: { desktop: hero04EnDesktop, mobile: hero04EnMobile },
    fr: { desktop: hero04FrDesktop, mobile: hero04FrMobile },
};
const hero05Images: ImagesByLocale = {
    es: { desktop: hero05EsDesktop, mobile: hero05EsMobile },
    en: { desktop: hero05EnDesktop, mobile: hero05EnMobile },
    fr: { desktop: hero05FrDesktop, mobile: hero05FrMobile },
};

// Las capturas de producto solo existen en es/en/fr por ahora. Hasta que
// haya capturas nativas para pt/it, mostramos las de DEFAULT_LOCALE en
// vez de romper el carrusel: son mockups ilustrativos, no texto a traducir.
// El `!` es seguro: DEFAULT_LOCALE ("en") siempre está poblado en los 5 mapas de arriba.
function resolveImages(
    images: ImagesByLocale,
    locale: Locale,
): HeroSlideImages {
    return images[locale] ?? images[DEFAULT_LOCALE]!;
}

export function getHeroSlides(t: Translator, locale: Locale): HeroSlide[] {
    return [
        {
            id: "hero-01",
            images: resolveImages(hero01Images, locale),
            alt: t("home_page.hero.slide_01_alt"),
            label: t("home_page.hero.slide_01_label"),
        },
        {
            id: "hero-02",
            images: resolveImages(hero02Images, locale),
            alt: t("home_page.hero.slide_02_alt"),
            label: t("home_page.hero.slide_02_label"),
        },
        {
            id: "hero-03",
            images: resolveImages(hero03Images, locale),
            alt: t("home_page.hero.slide_03_alt"),
            label: t("home_page.hero.slide_03_label"),
        },
        {
            id: "hero-04",
            images: resolveImages(hero04Images, locale),
            alt: t("home_page.hero.slide_04_alt"),
            label: t("home_page.hero.slide_04_label"),
        },
        {
            id: "hero-05",
            images: resolveImages(hero05Images, locale),
            alt: t("home_page.hero.slide_05_alt"),
            label: t("home_page.hero.slide_05_label"),
        },
    ];
}
