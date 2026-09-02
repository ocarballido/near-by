import PublicSidebar from "@/components/organisms/sidebar/public-sidebar";
import Content from "@/components/organisms/content";
import HousePublicMobile from "@/components/molecules/card/house-public-mobile";

type PublicContentTemplateProps = {
    address: string;
    name: string;
    image?: string | null;
    latitude: number;
    longitude: number;
    children: React.ReactNode;
    sidebar?: "APP" | "PROPERTY";
    categoryId?: string;
    subCategoryId?: string;
    propertyId?: string;
    checkInDate?: string;
    checkInTime?: string;
    checkOutDate?: string;
    checkOutTime?: string;
};

const PublicContentTemplate = ({
    address,
    name,
    latitude,
    longitude,
    image,
    children,
    categoryId,
    subCategoryId,
    propertyId,
    checkInDate,
    checkInTime,
    checkOutDate,
    checkOutTime,
}: PublicContentTemplateProps) => {
    return (
        <>
            <HousePublicMobile
                address={address}
                latitude={latitude}
                longitude={longitude}
                name={name}
                checkInDate={checkInDate}
                checkInTime={checkInTime}
                checkOutDate={checkOutDate}
                checkOutTime={checkOutTime}
                className="flex md:hidden -mt-5.5 rounded-t-none"
            />
            <div className="flex flex-col gap-2 items-stretch w-full font-body overflow-hidden grow min-h-0">
                <div className={`flex flex-auto gap-2 min-h-0 relative w-full`}>
                    <PublicSidebar
                        categoryId={categoryId}
                        subCategoryId={subCategoryId}
                        propertyId={propertyId}
                        address={address}
                        name={name}
                        image={image}
                        latitude={latitude}
                        longitude={longitude}
                        checkInDate={checkInDate}
                        checkInTime={checkInTime}
                        checkOutDate={checkOutDate}
                        checkOutTime={checkOutTime}
                    />
                    <Content>{children}</Content>
                </div>
            </div>
        </>
    );
};

export default PublicContentTemplate;
