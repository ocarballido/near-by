'use client';

import { useState } from 'react';

type EmailType = 'newsletter' | 'survey' | 'announcement';
type Locale = 'es' | 'en' | 'fr';

type LocaleContent = {
	subject: string;
	preheader: string;
	title: string;
	mainText: string;
	alertText: string;
	bullets: string;
	ctaLabel: string;
};

const emptyContent = (): LocaleContent => ({
	subject: '',
	preheader: '',
	title: '',
	mainText: '',
	alertText: '',
	bullets: '',
	ctaLabel: '',
});

type BroadcastResult = {
	ok: boolean;
	sent: number;
	skipped: number;
	errors: number;
};

export default function BroadcastForm() {
	const [activeLocale, setActiveLocale] = useState<Locale>('es');
	const [content, setContent] = useState<Record<Locale, LocaleContent>>({
		es: emptyContent(),
		en: emptyContent(),
		fr: emptyContent(),
	});
	const [imageUrl, setImageUrl] = useState('');
	const [ctaUrl, setCtaUrl] = useState('');
	const [emailType, setEmailType] = useState<EmailType>('newsletter');
	const [loading, setLoading] = useState(false);
	const [ready, setReady] = useState(false); // ← NUEVO
	const [result, setResult] = useState<BroadcastResult | null>(null);
	const [error, setError] = useState<string | null>(null);

	const updateContent = (field: keyof LocaleContent, value: string) => {
		setContent((prev) => ({
			...prev,
			[activeLocale]: { ...prev[activeLocale], [field]: value },
		}));
	};

	const current = content[activeLocale];

	const handleSubmit = async () => {
		if (
			!content.es.subject ||
			!content.es.preheader ||
			!content.es.title ||
			!content.es.mainText
		) {
			setError(
				'El idioma ES debe tener subject, preheader, título y texto principal.',
			);
			return;
		}

		setLoading(true);
		setError(null);
		setResult(null);

		const parseContent = (c: LocaleContent) => ({
			subject: c.subject,
			preheader: c.preheader,
			title: c.title,
			mainText: c.mainText,
			alertText: c.alertText || undefined,
			bullets: c.bullets
				.split('\n')
				.map((b) => b.trim())
				.filter(Boolean),
			ctaLabel: c.ctaLabel || undefined,
		});

		const esContent = parseContent(content.es);
		const enContent = content.en.subject
			? parseContent(content.en)
			: esContent;
		const frContent = content.fr.subject
			? parseContent(content.fr)
			: esContent;

		try {
			const res = await fetch('/api/broadcast', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					es: esContent,
					en: enContent,
					fr: frContent,
					imageUrl: imageUrl || undefined,
					ctaUrl: ctaUrl || undefined,
					emailType,
				}),
			});

			const data = await res.json();

			if (!res.ok) {
				setError(data.error ?? 'Error desconocido');
			} else {
				setResult(data);
				setContent({
					es: emptyContent(),
					en: emptyContent(),
					fr: emptyContent(),
				});
				setImageUrl('');
				setCtaUrl('');
				setEmailType('newsletter');
				setReady(false); // ← resetear el checkbox tras envío exitoso
			}
		} catch (err) {
			setError(String(err));
		} finally {
			setLoading(false);
		}
	};

	const localeLabels: Record<Locale, string> = {
		es: '🇪🇸 Español',
		en: '🇬🇧 English',
		fr: '🇫🇷 Français',
	};

	return (
		<div className="max-w-2xl mx-auto p-8">
			<h1 className="text-2xl font-bold font-heading text-gray-800 mb-2">
				Enviar comunicado
			</h1>
			<p className="text-gray-500 text-sm mb-8">
				ES es obligatorio. EN y FR usan ES como fallback si se dejan
				vacíos.
			</p>

			<div className="flex flex-col gap-5">
				{/* Email type */}
				<div className="flex flex-col gap-1">
					<label className="text-sm font-semibold text-gray-700">
						Tipo de email
					</label>
					<select
						value={emailType}
						onChange={(e) =>
							setEmailType(e.target.value as EmailType)
						}
						className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
					>
						<option value="newsletter">Newsletter</option>
						<option value="survey">Encuesta</option>
						<option value="announcement">Anuncio</option>
					</select>
				</div>

				{/* Image URL */}
				<div className="flex flex-col gap-1">
					<label className="text-sm font-semibold text-gray-700">
						URL de imagen{' '}
						<span className="text-gray-400 font-normal">
							(opcional)
						</span>
					</label>
					<input
						type="text"
						value={imageUrl}
						onChange={(e) => setImageUrl(e.target.value)}
						placeholder="https://bnbexplorer.com/static/img/mail/..."
						className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
					/>
				</div>

				{/* Pestañas de idioma */}
				<div className="flex gap-2 border-b border-gray-200">
					{(['es', 'en', 'fr'] as Locale[]).map((loc) => (
						<button
							type="button" // ← AÑADIDO
							key={loc}
							onClick={() => setActiveLocale(loc)}
							className={`px-4 py-2 text-sm font-semibold transition-colors border-b-2 -mb-px ${
								activeLocale === loc
									? 'border-primary-500 text-primary-600'
									: 'border-transparent text-gray-500 hover:text-gray-700'
							}`}
						>
							{localeLabels[loc]}
							{loc !== 'es' && !content[loc].subject && (
								<span className="ml-1 text-xs text-gray-400">
									(fallback ES)
								</span>
							)}
						</button>
					))}
				</div>

				{/* Campos por idioma */}
				<div className="flex flex-col gap-4">
					<div className="flex flex-col gap-1">
						<label className="text-sm font-semibold text-gray-700">
							Subject {activeLocale === 'es' && '*'}
						</label>
						<input
							type="text"
							value={current.subject}
							onChange={(e) =>
								updateContent('subject', e.target.value)
							}
							placeholder="Asunto del email"
							className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
						/>
					</div>

					<div className="flex flex-col gap-1">
						<label className="text-sm font-semibold text-gray-700">
							Preheader {activeLocale === 'es' && '*'}
						</label>
						<input
							type="text"
							value={current.preheader}
							onChange={(e) =>
								updateContent('preheader', e.target.value)
							}
							placeholder="Texto de preview en la bandeja de entrada"
							className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
						/>
					</div>

					<div className="flex flex-col gap-1">
						<label className="text-sm font-semibold text-gray-700">
							Título {activeLocale === 'es' && '*'}
						</label>
						<input
							type="text"
							value={current.title}
							onChange={(e) =>
								updateContent('title', e.target.value)
							}
							placeholder="Título principal del email (h2)"
							className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
						/>
					</div>

					<div className="flex flex-col gap-1">
						<label className="text-sm font-semibold text-gray-700">
							Texto principal {activeLocale === 'es' && '*'}
						</label>
						<textarea
							value={current.mainText}
							onChange={(e) =>
								updateContent('mainText', e.target.value)
							}
							placeholder="Cuerpo principal del mensaje"
							rows={4}
							className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
						/>
					</div>

					<div className="flex flex-col gap-1">
						<label className="text-sm font-semibold text-gray-700">
							Alert{' '}
							<span className="text-gray-400 font-normal">
								(opcional)
							</span>
						</label>
						<textarea
							value={current.alertText}
							onChange={(e) =>
								updateContent('alertText', e.target.value)
							}
							placeholder="Mensaje destacado en caja verde. Ej: 🎉 ¡Nueva feature disponible!"
							rows={2}
							className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
						/>
					</div>

					<div className="flex flex-col gap-1">
						<label className="text-sm font-semibold text-gray-700">
							Bullet points{' '}
							<span className="text-gray-400 font-normal">
								(opcional — uno por línea)
							</span>
						</label>
						<textarea
							value={current.bullets}
							onChange={(e) =>
								updateContent('bullets', e.target.value)
							}
							placeholder={`Exporta tus datos en PDF\nNuevo diseño de la guía\nMejoras de velocidad`}
							rows={4}
							className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
						/>
					</div>

					<div className="flex flex-col gap-1">
						<label className="text-sm font-semibold text-gray-700">
							CTA Label{' '}
							<span className="text-gray-400 font-normal">
								(opcional)
							</span>
						</label>
						<input
							type="text"
							value={current.ctaLabel}
							onChange={(e) =>
								updateContent('ctaLabel', e.target.value)
							}
							placeholder="Visita BNBexplorer"
							className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
						/>
					</div>

					<div className="flex flex-col gap-1">
						<label className="text-sm font-semibold text-gray-700">
							CTA URL{' '}
							<span className="text-gray-400 font-normal">
								(opcional)
							</span>
						</label>
						<input
							type="text"
							value={ctaUrl}
							onChange={(e) => setCtaUrl(e.target.value)}
							placeholder="https://bnbexplorer.com"
							className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
						/>
					</div>
				</div>

				{/* Error */}
				{error && (
					<div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3">
						<p className="text-red-700 text-sm">{error}</p>
					</div>
				)}

				{/* Result */}
				{result && (
					<div className="bg-green-50 border border-green-200 rounded-lg px-4 py-3 flex flex-col gap-1">
						<p className="text-green-700 text-sm font-semibold">
							✅ Envío completado
						</p>
						<p className="text-green-700 text-sm">
							{result.sent} enviados · {result.skipped} saltados ·{' '}
							{result.errors} errores
						</p>
					</div>
				)}

				{/* ← NUEVO: Checkbox de confirmación */}
				<label className="flex items-center gap-3 cursor-pointer select-none">
					<input
						type="checkbox"
						checked={ready}
						onChange={(e) => setReady(e.target.checked)}
						className="w-4 h-4 rounded border-gray-300 text-primary-500 focus:ring-primary-500 cursor-pointer"
					/>
					<span className="text-sm font-semibold text-gray-700">
						Marcar emails como listos para enviar
					</span>
				</label>

				{/* Submit */}
				<button
					type="button" // ← AÑADIDO: evita submit con Enter
					onClick={handleSubmit}
					disabled={loading || !ready} // ← MODIFICADO
					className="bg-primary-500 hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg px-6 py-3 text-sm transition-colors"
				>
					{loading ? 'Enviando...' : 'Enviar a todos los usuarios'}
				</button>
			</div>
		</div>
	);
}
