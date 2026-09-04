import IconStar from "@/components/atoms/icon/star";
import Typography from "@/components/atoms/typography";

type RatingProps = {
    className?: string;
    starsClassName?: string;
    color?:
        | "primary"
        | "secondary"
        | "success"
        | "warning"
        | "info"
        | "error"
        | "body"
        | "light"
        | "white";
    label?: string;
};

const Rating = ({
    className = "",
    color = "warning",
    label,
    starsClassName = "bg-warning-50",
}: RatingProps) => {
    return (
        <div className={`flex flex-col gap-2 items-center ${className}`}>
            <div
                className={`py-1 px-2 rounded-full flex gap-2 justify-center items-center w-fit ${starsClassName}`}
            >
                <IconStar color={color} size={16} />
                <IconStar color={color} size={16} />
                <IconStar color={color} size={16} />
                <IconStar color={color} size={16} />
                <IconStar color={color} size={16} />
            </div>
            <Typography weight="medium" className="text-primary-800 text-sm">
                {label && label}
            </Typography>
        </div>
    );
};

export default Rating;
