import { Accordion, AccordionItem } from "@/components/molecules/accordion";

export type FaqItem = {
    id: string;
    question: string;
    answer: React.ReactNode;
};

type FaqSectionProps = {
    items: FaqItem[];
    /** Id del item que debe empezar desplegado. */
    defaultActiveId?: string;
    className?: string;
};

export function FaqSection({
    items,
    defaultActiveId,
    className = "",
}: FaqSectionProps) {
    return (
        <Accordion
            defaultActiveId={defaultActiveId ?? null}
            className={`flex flex-col gap-2 ${className}`}
        >
            {items.map((item) => (
                <AccordionItem key={item.id} id={item.id} title={item.question}>
                    {item.answer}
                </AccordionItem>
            ))}
        </Accordion>
    );
}
