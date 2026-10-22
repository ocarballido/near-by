import { getTranslations } from "next-intl/server";
import type { ExploreDetailPublic, InfoGroup } from "./_data";
import InfoSections from "@/components/templates/info-sections";
import ExploreDetailsPublicSection from "@/components/organisms/explore-details-public-section";

type Props = {
    infoGroups: InfoGroup[];
    exploreDetails: ExploreDetailPublic[];
    defaultOpenId?: string;
};

// Los datos llegan resueltos desde el Promise.all de la página
export default async function LodgingSection({
    infoGroups,
    exploreDetails,
    defaultOpenId,
}: Props) {
    const t = await getTranslations();

    return (
        <div>
            <section className="bg-white px-4 py-10 border-b border-gray-100">
                <InfoSections
                    groups={infoGroups}
                    defaultOpenId={defaultOpenId}
                    title={t("El Alojamiento")}
                />
            </section>
            {exploreDetails.length > 0 && (
                <section className="px-4 py-10">
                    <ExploreDetailsPublicSection details={exploreDetails} />
                </section>
            )}
        </div>
    );
}
