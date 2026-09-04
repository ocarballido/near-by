import ui01 from "../../../../public/static/img/home/hero/ui-01.png";
import ui02 from "../../../../public/static/img/home/hero/ui-02.png";
import ui03 from "../../../../public/static/img/home/hero/ui-03.png";
import ui04 from "../../../../public/static/img/home/hero/ui-04.png";
import ui05 from "../../../../public/static/img/home/hero/ui-05.png";
import { HeroSlide } from ".";

// Firma mínima: solo necesitamos "algo que traduzca una key a texto".
// Este archivo no importa nada de next-intl directamente, así que no
// le importa si `t` viene de getTranslations (server) o useTranslations
// (client) — desacopla los datos del mecanismo de i18n.
type Translator = (key: string) => string;

export function getHeroSlides(t: Translator): HeroSlide[] {
    return [
        {
            id: "hero-01",
            src: ui01,
            alt: t("home_page.hero.slide_01_alt"),
            label: t("home_page.hero.slide_01_label"),
        },
        {
            id: "hero-02",
            src: ui02,
            alt: t("home_page.hero.slide_02_alt"),
            label: t("home_page.hero.slide_02_label"),
        },
        {
            id: "hero-03",
            src: ui03,
            alt: t("home_page.hero.slide_03_alt"),
            label: t("home_page.hero.slide_03_label"),
        },
        {
            id: "hero-04",
            src: ui04,
            alt: t("home_page.hero.slide_04_alt"),
            label: t("home_page.hero.slide_04_label"),
        },
        {
            id: "hero-05",
            src: ui05,
            alt: t("home_page.hero.slide_05_alt"),
            label: t("home_page.hero.slide_05_label"),
        },
    ];
}
