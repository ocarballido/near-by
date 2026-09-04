type BadgeMarketingProps = {
    label: string;
    className?: string;
};

const BadgeMarketing = ({ className, label }: BadgeMarketingProps) => {
    return (
        <span
            className={`text-sm text-primary-800 px-4 py-2 rounded-full border border-primary-200 bg-gradient-to-tr from-[#ffa263]/20 to-[#6cffc9]/20 shadow-[0_0_30px_rgba(50,195,140,0.20)] w-fit mx-auto ${className}`}
        >
            {label}
        </span>
    );
};

export default BadgeMarketing;
