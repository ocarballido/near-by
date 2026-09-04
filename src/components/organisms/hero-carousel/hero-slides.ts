import ui01 from "../../../../public/static/img/home/hero/ui-01.png";
import ui02 from "../../../../public/static/img/home/hero/ui-02.png";
import ui03 from "../../../../public/static/img/home/hero/ui-03.png";
import ui04 from "../../../../public/static/img/home/hero/ui-04.png";
import ui05 from "../../../../public/static/img/home/hero/ui-05.png";
import { HeroSlide } from ".";

export const heroSlides: HeroSlide[] = [
    {
        id: "hero-01",
        src: ui01,
        alt: "Vista del panel de bienvenida de la guía digital con recomendaciones locales",
        label: "Enlace directo",
    },
    {
        id: "hero-02",
        src: ui02,
        alt: "Sección de horario de check-in y check-out en la guía del alojamiento",
        label: "Guía de bienvenida",
    },
    {
        id: "hero-03",
        src: ui03,
        alt: "Recomendaciones destacadas de restaurantes y ocio cerca del alojamiento",
        label: "Recomendaciones horarias",
    },
    {
        id: "hero-04",
        src: ui04,
        alt: "Widget de recomendaciones por franja horaria del día",
        label: "Aistente inteligente",
    },
    {
        id: "hero-05",
        src: ui05,
        alt: "Asistente virtual respondiendo dudas del huésped dentro de la guía",
        label: "Favoritos y Visita obligatoria",
    },
];
