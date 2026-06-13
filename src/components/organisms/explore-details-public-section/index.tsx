"use client";

import { useTranslations } from "next-intl";
import Typography from "@/components/atoms/typography";
import ExploreDetailCard, {
    type ExploreDetailCardDetail,
} from "@/components/molecules/card/explore-detail-card";
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
                {details.map((detail) => {
                    const cardDetail: ExploreDetailCardDetail = {
                        id: detail.id,
                        name: detail.predefined_key
                            ? t(
                                  `exploreDetails.predefined.${detail.predefined_key}.name`,
                              )
                            : detail.name,
                        instructions: detail.instructions,
                        guidelines: detail.guidelines,
                        image_url: detail.image_url,
                    };
                    return (
                        <ExploreDetailCard
                            key={detail.id}
                            detail={cardDetail}
                        />
                    );
                })}
            </div>
        </div>
    );
}
