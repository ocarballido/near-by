import { getTranslations } from "next-intl/server";
import Image from "next/image";

import Stat from "@/components/atoms/stat";

type PropertiesOverviewProps = {
    totalCount: number;
    completedCount: number;
    incompleteCount: number;
};

const PropertiesOverview = async ({
    totalCount,
    completedCount,
    incompleteCount,
}: PropertiesOverviewProps) => {
    const t = await getTranslations();

    return (
        // Fondo -600: con el -500 de Figma las etiquetas blancas de 12px no
        // llegan a 4.5:1
        <div className="relative isolate flex flex-col gap-4 items-start p-4 rounded-2xl overflow-hidden bg-primary-600 shadow-xs">
            {/* Fondo decorativo: imagen girada y desenfocada que se funde
                con el verde (isolate + -z-10 la deja bajo el contenido) */}
            <div className="absolute -z-10 left-[calc(50%+40px)] top-1/2 h-[637px] w-[591px] -translate-x-1/2 -translate-y-1/2 -rotate-90 opacity-40 blur-[23px] mix-blend-difference pointer-events-none">
                <Image
                    src="/static/img/properties-overview-bg.webp"
                    alt=""
                    fill
                    sizes="591px"
                    className="object-cover"
                />
            </div>

            <h2 className="grow font-heading font-bold text-sm leading-4 text-white">
                {t("Propiedades")}
            </h2>

            <Image
                src="/static/img/rooftop-2.png"
                alt=""
                width={157}
                height={152}
                className="self-center h-[152px] w-[157px] object-cover"
            />

            {/* A todo el ancho (móvil) las stats se reparten por igual; desde md
                la card mide lo que su contenido, como en Figma */}
            <div className="grid grid-cols-3 gap-6 w-full md:flex">
                <Stat label={t("propertiesOverviewTotal")} value={totalCount} />
                <Stat
                    label={t("propertiesStatus.completed")}
                    value={completedCount}
                />
                <Stat
                    label={t("propertiesStatus.inProgress")}
                    value={incompleteCount}
                />
            </div>
        </div>
    );
};

export default PropertiesOverview;
