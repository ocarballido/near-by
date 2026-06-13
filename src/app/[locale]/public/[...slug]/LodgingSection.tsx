import { getTranslations, getLocale } from "next-intl/server";
import { fetchInfoSectionsData, fetchExploreDetailsData } from "./_data";
import InfoSections from "@/components/templates/info-sections";
import ExploreDetailsPublicSection from "@/components/organisms/explore-details-public-section";

type Props = {
    propertyId: string;
    defaultOpenId?: string;
};

export default async function LodgingSection({
    propertyId,
    defaultOpenId,
}: Props) {
    const locale = await getLocale();
    const t = await getTranslations();

    const [infoGroups, exploreDetails] = await Promise.all([
        fetchInfoSectionsData(propertyId, locale),
        fetchExploreDetailsData(propertyId, locale),
    ]);

    return (
        <>
            <InfoSections
                groups={infoGroups}
                defaultOpenId={defaultOpenId}
                title={t("El Alojamiento")}
            />
            {exploreDetails.length > 0 && (
                <ExploreDetailsPublicSection details={exploreDetails} />
            )}
        </>
    );
}
