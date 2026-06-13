"use client";

import { useTranslations } from "next-intl";
import Typography from "@/components/atoms/typography";
import ExploreDetailCard from "@/components/molecules/card/explore-detail-card";
import type { ExploreDetailPublic } from "@/app/[locale]/public/[...slug]/_data";

type Props = {
    details: ExploreDetailPublic[];
};

export default function ExploreDetailsPublicSection({ details }: Props) {
    const t = useTranslations();

    return (
        <div className="flex flex-col gap-3 w-full">
            <Typography component="h2" size="lg">
                {t("Explora los detalles")}
            </Typography>
            <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
                {details.map((detail) => (
                    <ExploreDetailCard
                        key={detail.id}
                        detail={{
                            ...(detail as any),
                            name: detail.predefined_key
                                ? t(
                                      `exploreDetails.predefined.${detail.predefined_key}.name`,
                                  )
                                : detail.name,
                        }}
                    />
                ))}
            </div>
        </div>
    );
}
