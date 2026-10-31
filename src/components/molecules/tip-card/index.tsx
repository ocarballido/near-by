type TipCardProps = {
    emoji: string;
    title: string;
    text: string;
};

const TipCard = ({ emoji, title, text }: TipCardProps) => {
    return (
        <div className="flex flex-col gap-2.5 p-4 rounded-2xl bg-primary-50">
            {/* El gap separa emoji y título: no depende de si el texto
                traducido del emoji lleva espacio */}
            <h3 className="flex gap-1 font-heading font-bold text-base leading-5 text-gray-800">
                <span aria-hidden="true">{emoji}</span>
                <span>{title}</span>
            </h3>
            <p className="text-sm leading-5 text-gray-600">{text}</p>
        </div>
    );
};

export default TipCard;
