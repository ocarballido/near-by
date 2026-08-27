import { useTranslations } from "next-intl";

import Link from "next/link";
import CreatePropertyEntry from "../property-entry";
import FancyIcon from "@/components/atoms/icon/fancy-icon";
import IconAdd from "@/components/atoms/icon/add";

const NewPropertyCard = () => {
    const t = useTranslations();

    return (
        <CreatePropertyEntry
            href="/app/properties/new"
            link={
                <Link
                    className="flex flex-col gap-2 bg-primary-100 rounded-xl justify-center items-center hover:bg-primary-400 transition-all pb-6 min-h-[300px]"
                    href="/app/properties/new"
                >
                    <FancyIcon
                        icon={<IconAdd color="white" />}
                        color="gradient"
                    />
                    <p className="font-heading font-bold">
                        {t("Nueva Propiedad").toUpperCase()}
                    </p>
                </Link>
            }
            action={
                <div className="flex flex-col gap-2 h-full min-h-[300px] bg-primary-100 rounded-xl justify-center items-center hover:bg-primary-400 transition-all pb-6 hover:cursor-pointer">
                    <FancyIcon
                        icon={<IconAdd color="white" />}
                        color="gradient"
                    />
                    <p className="font-heading font-bold">
                        {t("Nueva Propiedad").toUpperCase()}
                    </p>
                </div>
            }
        />
    );
};

export default NewPropertyCard;
