import { useTranslations, useLocale } from "next-intl";

import { Link } from "@/i18n/routing";
import { formatRelativeDays } from "@/utils/format-relative-days";
import IconChevronForward from "@/components/atoms/icon/chevron-forward";

type LastEditedProps = {
    propertyName: string;
    updatedAt: string;
    href: string;
};

const LastEdited = ({ propertyName, updatedAt, href }: LastEditedProps) => {
    const t = useTranslations();
    const locale = useLocale();

    return (
        <Link
            href={href}
            className="flex gap-2 items-center w-full py-3 pl-4 pr-3 rounded-2xl bg-white transition-colors hover:bg-gray-50"
        >
            <p className="flex-1 min-w-0 text-sm leading-4 font-medium text-gray-600 break-words">
                {t("lastActivity.edited", {
                    property: propertyName,
                    time: formatRelativeDays(updatedAt, locale),
                })}
            </p>

            <IconChevronForward className="shrink-0 fill-gray-600" />
        </Link>
    );
};

export default LastEdited;
