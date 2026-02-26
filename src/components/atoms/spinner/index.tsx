import Image from 'next/image';
import clsx from 'clsx';

type SpinnerProps = {
	position?: 'absolute' | 'fixed';
	/** Si quieres que bloquee clicks debajo (normalmente sí) */
	blocking?: boolean;
};

const Spinner = ({ position = 'absolute', blocking = true }: SpinnerProps) => {
	const overlay = clsx(
		// base overlay
		'inset-0 flex items-center justify-center bg-gray-100/80',
		// z-index alto (tailwind: z-50 suele bastar, aquí lo subimos)
		'z-[9999]',
		// comportamiento
		position === 'fixed' ? 'fixed' : 'absolute',
		// opcional: dejar pasar clicks si no quieres bloquear
		blocking ? 'pointer-events-auto' : 'pointer-events-none',
	);

	return (
		<div className={overlay} aria-busy="true" aria-live="polite">
			<div className="relative">
				<Image
					src="/static/icons/sping.svg"
					alt="Cargando"
					height={48}
					width={48}
					className="animate-spin"
					priority
				/>
				<div className="absolute inset-0 flex items-center justify-center">
					<Image
						src="/static/img/icon-gradient.webp"
						alt=""
						height={28}
						width={28}
					/>
				</div>
			</div>
		</div>
	);
};

export default Spinner;
