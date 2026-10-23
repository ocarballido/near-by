type BlobsBackgroundProps = {
    className?: string;
};

type HeroBlob = {
    className: string;
    // Desfase propio para que las manchas con la misma animación no se muevan a la par
    delay?: string;
};

// Manchas de color difuminadas (sustituyen al PNG de Figma). Posición = centro de la mancha
const blobs: HeroBlob[] = [
    // Acento lavanda (puente entre el azul y el melocotón). Primera del array para que
    // el verde de marca quede por encima y siga dominando
    {
        className:
            "left-[82%] top-[15%] animate-blob-drift-a bg-[radial-gradient(closest-side,rgb(200_185_250/0.7),transparent)]",
        delay: "-5s",
    },
    {
        className:
            "left-[25%] top-[72%] animate-blob-drift-a bg-[radial-gradient(closest-side,rgb(240_200_150/0.8),transparent)]",
    },
    {
        className:
            "left-[40%] top-[55%] animate-blob-orbit bg-[radial-gradient(closest-side,rgb(120_235_195/0.7),transparent)]",
    },
    {
        className:
            "left-[62%] top-[80%] animate-blob-drift-b bg-[radial-gradient(closest-side,rgb(140_220_240/0.7),transparent)]",
    },
    {
        className:
            "left-[74%] top-[50%] animate-blob-drift-a bg-[radial-gradient(closest-side,rgb(110_240_200/0.7),transparent)]",
        delay: "-11s",
    },
    {
        className:
            "left-[35%] top-[5%] animate-blob-drift-b bg-[radial-gradient(closest-side,rgb(190_225_240/0.7),transparent)]",
        delay: "-9s",
    },
];

// Fondo decorativo animado: manchas de color en movimiento y, encima, las elipses
// semitransparentes para que el color se vea a través. El contenedor padre necesita
// "relative isolate"; el color base se pasa por className o lo pone el padre
const BlobsBackground = ({ className = "" }: BlobsBackgroundProps) => {
    return (
        <div
            aria-hidden
            className={`pointer-events-none absolute inset-0 -z-10 overflow-hidden ${className}`}
        >
            {blobs.map((blob) => (
                <div
                    key={blob.className}
                    className={`absolute aspect-[3/2] w-[max(80%,600px)] -translate-x-1/2 -translate-y-1/2 motion-reduce:animate-none ${blob.className}`}
                    style={
                        blob.delay ? { animationDelay: blob.delay } : undefined
                    }
                />
            ))}
            {/* Encuadre de las elipses con "slice": equivale al object-cover
                del fondo de Figma (viewBox = proporción del diseño original) */}
            <svg
                className="absolute inset-0 size-full opacity-40"
                viewBox="0 0 2000 781"
                preserveAspectRatio="xMidYMid slice"
            >
                <image
                    href="/static/img/house-public-hero/radar.svg"
                    x="-99"
                    y="133"
                    width="2198"
                    height="957"
                />
            </svg>
        </div>
    );
};

export default BlobsBackground;
