"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

import addProperty from "../../../../public/static/img/add-property.webp";
import type { PropertyDetailRow } from "@/types/property-details";

import Image from "next/image";

import { PropertyInfoContent } from "../property-info-content";
import EmptyContentAction from "@/components/molecules/empty-content-action";
import { LocationsContent } from "../locations-content";
import ButtonLinkMagic from "@/components/molecules/button-link-magic";
import ExploreDetailsView from "@/components/organisms/explore-details-view";
import { CATEGORIES_SUB_CATEGORIES } from "@/config/config-constants";

type PropertyDataItem = {
    id: string;
    name: string;
    address: string;
    description?: string;
    image_url: string;
    latitude?: number;
    longitude?: number;
    type?: "info" | "location";
    featured?: boolean;
    mustVisit?: boolean;
};

export function PropertyDataBySubCategory({
    propertyId,
    categoryId,
    subCategoryId,
    propertyData,
    type,
    lat,
    lng,
    propertyDetails = [],
}: {
    propertyId: string;
    categoryId: string;
    subCategoryId: string;
    type: string;
    propertyData: PropertyDataItem[];
    lat: number;
    lng: number;
    propertyDetails?: PropertyDetailRow[];
}) {
    const t = useTranslations();
    const router = useRouter();

    if (
        subCategoryId ===
        CATEGORIES_SUB_CATEGORIES.LODGING.SUB_CATEGORIES.EXPLORE_DETAILS.id
    ) {
        if (propertyDetails.length === 0) {
            return (
                <div className="block ml-auto mr-auto">
                    <Image
                        alt="Add location"
                        src={addProperty}
                        height={184}
                        width={248}
                    />
                    <EmptyContentAction
                        className="mt-12"
                        onClick={() =>
                            router.push(
                                `/app/details/${propertyId}/${categoryId}/${subCategoryId}`,
                            )
                        }
                    />
                </div>
            );
        }

        return (
            <ExploreDetailsView
                propertyId={propertyId}
                categoryId={categoryId}
                subCategoryId={subCategoryId}
                details={propertyDetails}
            />
        );
    }

    if (propertyData.length === 0)
        return (
            <>
                {type === "info" ? (
                    <div className="block ml-auto mr-auto">
                        <Image
                            alt="Add location"
                            src={addProperty}
                            height={184}
                            width={248}
                        />
                        <EmptyContentAction
                            className="mt-12"
                            onClick={() =>
                                router.push(
                                    `/app/info/${propertyId}/${categoryId}/${subCategoryId}`,
                                )
                            }
                        />
                    </div>
                ) : (
                    <div className="block ml-auto mr-auto">
                        <Image
                            alt="Add location"
                            src={addProperty}
                            height={184}
                            width={248}
                        />
                        <EmptyContentAction
                            className="mt-12"
                            onClick={() =>
                                router.push(
                                    `/app/location/${propertyId}/${categoryId}/${subCategoryId}`,
                                )
                            }
                        />
                        <ButtonLinkMagic
                            label={t("Buscador mágico")}
                            url={`/app/magic-finder/${propertyId}/${lat}/${lng}/${categoryId}/${subCategoryId}`}
                            className="w-fit ml-auto mr-auto mt-2"
                        />
                    </div>
                )}
            </>
        );

    return (
        <>
            {type === "info" ? (
                <PropertyInfoContent
                    infos={propertyData}
                    categoryId={categoryId}
                    subCategoryId={subCategoryId}
                    propertyId={propertyId}
                />
            ) : (
                <LocationsContent
                    locations={propertyData}
                    propertyId={propertyId}
                    categoryId={categoryId}
                    subCategoryId={subCategoryId}
                    lat={lat}
                    lng={lng}
                />
            )}
        </>
    );
}
