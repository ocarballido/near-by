"use client";

import PropertySidebar from "./property-sidebar";
import AppSidebar from "./app-sidebar";

type SidebarProps = {
    propertyId?: string;
    categoryId?: string;
    subCategoryId?: string;
    sidebar: "APP" | "PROPERTY";
};

const Sidebar = ({
    sidebar = "APP",
    propertyId,
    categoryId,
    subCategoryId,
}: SidebarProps) => {
    if (sidebar === "PROPERTY") {
        return (
            <PropertySidebar
                propertyId={propertyId}
                categoryId={categoryId}
                subCategoryId={subCategoryId}
            />
        );
    }

    return <AppSidebar />;
};

export default Sidebar;
