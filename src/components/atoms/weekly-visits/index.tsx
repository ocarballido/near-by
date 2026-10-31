type WeeklyVisitsProps = {
    title: string;
    timeWindow: string;
    value: number;
};

const WeeklyVisits = ({ title, timeWindow, value }: WeeklyVisitsProps) => {
    return (
        // En móvil, una fila por semana (textos a la izquierda, cifra a la
        // derecha); desde sm, columna como en Figma
        <div className="flex items-center justify-between gap-4 min-w-0 sm:flex-col sm:items-start sm:justify-start sm:gap-1 sm:flex-1">
            <div className="flex flex-col gap-0.5 min-w-0 text-xs font-medium">
                <p className="text-gray-600">{title}</p>
                <p className="text-gray-500">{timeWindow}</p>
            </div>
            <p className="shrink-0 font-heading font-bold text-3xl text-primary-500">
                {value}
            </p>
        </div>
    );
};

export default WeeklyVisits;
