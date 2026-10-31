type StatProps = {
    label: string;
    value: number;
};

const Stat = ({ label, value }: StatProps) => {
    return (
        <div className="flex flex-col gap-1 text-white">
            <p className="text-xs font-medium">{label}</p>
            <p className="font-heading font-bold text-3xl">{value}</p>
        </div>
    );
};

export default Stat;
