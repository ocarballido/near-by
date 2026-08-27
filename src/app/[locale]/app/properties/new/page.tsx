import AddPropertyForm from "@/components/organisms/form/property";
import FirstPropertyBanner from "@/components/organisms/first-property-banner";
import AppContentTemplate from "@/components/templates/app-content";

type PageProps = {
    searchParams?: Promise<{ fromAuth?: string }>;
};

export default async function NewProperty({ searchParams }: PageProps) {
    const { fromAuth } = searchParams ? await searchParams : {};

    const showFirstTimeMsg = fromAuth === "1";

    // Si el usuario llega desde el flujo de login/registro, no existe un
    // "de dónde vino" fiable en el historial del navegador (los redirects
    // de servidor no dejan entradas intermedias). Le damos un destino
    // explícito en vez de depender de router.back().
    const cancelHref = fromAuth === "1" ? "/app/properties" : undefined;

    return (
        <AppContentTemplate showSidebar={false}>
            <div className="p-1.5 font-roboto flex flex-col grow items-center gap-3 py-6">
                {showFirstTimeMsg && <FirstPropertyBanner />}
                <AddPropertyForm cancelHref={cancelHref} />
            </div>
        </AppContentTemplate>
    );
}
