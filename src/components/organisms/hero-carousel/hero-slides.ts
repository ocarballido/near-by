import { HeroSlide } from ".";

// hero-01
import hero01Desktop from "../../../../public/static/img/home/hero/ui-01_en.png";
import hero01Mobile from "../../../../public/static/img/home/hero/ui-01_en_mobile.png";

// hero-02
import hero02Desktop from "../../../../public/static/img/home/hero/ui-02_en.png";
import hero02Mobile from "../../../../public/static/img/home/hero/ui-02_en_mobile.png";

// hero-03
import hero03Desktop from "../../../../public/static/img/home/hero/ui-03_en.png";
import hero03Mobile from "../../../../public/static/img/home/hero/ui-03_en_mobile.png";

// hero-04
import hero04Desktop from "../../../../public/static/img/home/hero/ui-04_en.png";
import hero04Mobile from "../../../../public/static/img/home/hero/ui-04_en_mobile.png";

// hero-05
import hero05Desktop from "../../../../public/static/img/home/hero/ui-05_en.png";
import hero05Mobile from "../../../../public/static/img/home/hero/ui-05_en_mobile.png";

type Translator = (key: string) => string;

export function getHeroSlides(t: Translator): HeroSlide[] {
    return [
        {
            id: "hero-01",
            images: { desktop: hero01Desktop, mobile: hero01Mobile },
            alt: t("home_page.hero.slide_01_alt"),
            label: t("home_page.hero.slide_01_label"),
        },
        {
            id: "hero-02",
            images: { desktop: hero02Desktop, mobile: hero02Mobile },
            alt: t("home_page.hero.slide_02_alt"),
            label: t("home_page.hero.slide_02_label"),
        },
        {
            id: "hero-03",
            images: { desktop: hero03Desktop, mobile: hero03Mobile },
            alt: t("home_page.hero.slide_03_alt"),
            label: t("home_page.hero.slide_03_label"),
        },
        {
            id: "hero-04",
            images: { desktop: hero04Desktop, mobile: hero04Mobile },
            alt: t("home_page.hero.slide_04_alt"),
            label: t("home_page.hero.slide_04_label"),
        },
        {
            id: "hero-05",
            images: { desktop: hero05Desktop, mobile: hero05Mobile },
            alt: t("home_page.hero.slide_05_alt"),
            label: t("home_page.hero.slide_05_label"),
        },
    ];
}
