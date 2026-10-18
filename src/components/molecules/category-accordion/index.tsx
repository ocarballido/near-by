import CategoryButton from "../caterory-button";
import CategoryBody from "../category-body";

type CategoryAccordionProps = {
    children: React.ReactNode;
    icon: React.ReactNode;
    name: string;
    open: boolean;
    active?: boolean;
    hasContent?: boolean;
    href?: string;
    onClick?: () => void;
};

const CategoryAccordion = ({
    children,
    icon,
    name,
    open,
    active = false,
    hasContent,
    onClick,
}: CategoryAccordionProps) => {
    return (
        <div className="w-full flex flex-col items-center font-medium">
            <CategoryButton
                name={name}
                active={active}
                icon={icon}
                open={open}
                hasContent={hasContent}
                onClick={onClick}
            />
            <CategoryBody open={open}>{children}</CategoryBody>
        </div>
    );
};

export default CategoryAccordion;
