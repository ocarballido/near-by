'use client';

import { useState, useEffect } from 'react';
import TextField from '@/components/molecules/text-field';
import Button from '@/components/molecules/button';
import Alert from '@/components/molecules/alert';

const DEFAULT_COMPETITORS = ['TouchStay', 'Hostfully', 'Lodgify'];

const FOCUS_OPTIONS = [
	'Captación de usuarios',
	'Features nuevas',
	'Viralización',
	'Onboarding propietarios',
	'Pricing',
	'Retención inquilinos',
	'Integraciones AI',
	'Marketing',
];

const DEFAULT_ACTIVE = [
	'Captación de usuarios',
	'Features nuevas',
	'Viralización',
	'Onboarding propietarios',
];

const DEPTH_LABELS = [
	'',
	'Rápido (1-2 fuentes)',
	'Equilibrado (3-4 fuentes)',
	'Exhaustivo (5+ fuentes)',
];

const DEFAULT_CONTEXT =
	'Mi app es una guía digital para propiedades de alquiler vacacional. Los propietarios crean guías con localizaciones, normas e información para sus inquilinos. Stack: Next.js + Supabase. Etapa: búsqueda de primeros usuarios.';

interface HistoryEntry {
	date: string;
	competitors: string[];
	focuses: string[];
}

function buildPrompt(
	competitors: string[],
	focuses: string[],
	depth: number,
	context: string,
): string {
	const depthLabel = DEPTH_LABELS[depth];
	const ctx = context.trim() || DEFAULT_CONTEXT;
	return [
		'Actúa como un analista de producto senior especializado en proptech y apps de digital guidebooks para alojamientos de corta estancia.',
		'',
		'CONTEXTO DE MI APP:',
		ctx,
		'',
		'COMPETIDORES A ANALIZAR: ' + competitors.join(', '),
		'',
		'ÁREAS DE ANÁLISIS: ' + focuses.join(', '),
		'',
		'PROFUNDIDAD: ' + depthLabel,
		'',
		'Para cada área analizada, quiero:',
		'1. Qué están haciendo estos competidores concretamente (con datos reales que encuentres buscando en internet)',
		'2. Qué estrategias o features están funcionando mejor según reseñas, Product Hunt, App Store, foros o posts recientes',
		'3. Una recomendación concreta y accionable para mi app, ordenada por impacto estimado vs esfuerzo de implementación',
		'',
		'Restricciones importantes:',
		'- Soy desarrollador indie, sin equipo ni presupuesto de marketing',
		'- Prioriza acciones que pueda implementar solo con código o de forma gratuita',
		'- Sé específico: nombres de features, copy concreto, flujos exactos — no generalidades',
		'- Si encuentras datos de crecimiento, retención o conversión de los competidores, inclúyelos',
	].join('\n');
}

export default function CompetitiveAgent() {
	const [competitors, setCompetitors] =
		useState<string[]>(DEFAULT_COMPETITORS);
	const [newComp, setNewComp] = useState('');
	const [activeAreas, setActiveAreas] = useState<string[]>(DEFAULT_ACTIVE);
	const [depth, setDepth] = useState(2);
	const [context, setContext] = useState('');
	const [history, setHistory] = useState<HistoryEntry[]>([]);
	const [alert, setAlert] = useState<{
		type: 'error' | 'success';
		message: string;
	} | null>(null);

	useEffect(() => {
		try {
			const stored = localStorage.getItem('ci_history');
			if (stored) setHistory(JSON.parse(stored));
		} catch {}
	}, []);

	function addCompetitor() {
		const val = newComp.trim();
		if (!val || competitors.includes(val)) return;
		setCompetitors((prev) => [...prev, val]);
		setNewComp('');
	}

	function removeCompetitor(val: string) {
		setCompetitors((prev) => prev.filter((c) => c !== val));
	}

	function toggleArea(area: string) {
		setActiveAreas((prev) =>
			prev.includes(area)
				? prev.filter((a) => a !== area)
				: [...prev, area],
		);
	}

	function saveHistory(comps: string[], focuses: string[]) {
		const entry: HistoryEntry = {
			date: new Date().toLocaleDateString('es-ES', {
				day: '2-digit',
				month: 'short',
				year: 'numeric',
			}),
			competitors: comps,
			focuses,
		};
		const updated = [entry, ...history].slice(0, 10);
		setHistory(updated);
		try {
			localStorage.setItem('ci_history', JSON.stringify(updated));
		} catch {}
	}

	async function runAgent() {
		if (competitors.length === 0) {
			setAlert({
				type: 'error',
				message: 'Añade al menos un competidor antes de lanzar.',
			});
			return;
		}
		if (activeAreas.length === 0) {
			setAlert({
				type: 'error',
				message: 'Selecciona al menos un área de análisis.',
			});
			return;
		}

		const prompt = buildPrompt(competitors, activeAreas, depth, context);

		try {
			await navigator.clipboard.writeText(prompt);
			setAlert({
				type: 'success',
				message:
					'Prompt copiado. Ábrelo en Claude y pega con Cmd+V / Ctrl+V.',
			});
			saveHistory(competitors, activeAreas);
			window.open('https://claude.ai/new', '_blank');
		} catch {
			setAlert({
				type: 'error',
				message:
					'No se pudo copiar automáticamente. Inténtalo manualmente.',
			});
		}
	}

	return (
		<div className="flex justify-center items-center p-6">
			<div className="bg-white p-2 rounded-xl w-full max-w-[700px] shadow-xs">
				{alert && (
					<Alert
						hideTime={4000}
						open={alert !== null}
						title={alert.type === 'error' ? 'Error' : 'Listo'}
						dismissible
						type={alert.type}
						message={alert.message}
					/>
				)}

				<div className="p-2 mb-2">
					<h1 className="text-base font-semibold text-gray-900">
						Agente competitivo
					</h1>
					<p className="text-sm text-gray-500 mt-0.5">
						Configura el análisis y lanza el prompt en Claude.
					</p>
				</div>

				<div className="flex flex-col gap-4 w-full p-2">
					{/* Competidores */}
					<div className="flex flex-col gap-2">
						<p className="text-sm font-medium text-gray-700">
							Competidores
						</p>
						<div className="flex flex-wrap gap-1.5">
							{competitors.map((c) => (
								<span
									key={c}
									className="flex items-center gap-1.5 rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs text-gray-600"
								>
									{c}
									<button
										type="button"
										onClick={() => removeCompetitor(c)}
										className="text-gray-300 hover:text-red-400 transition-colors leading-none"
									>
										×
									</button>
								</span>
							))}
						</div>
						<div className="flex gap-2 items-end">
							<div className="flex-1">
								<TextField
									label="Añadir competidor"
									placeholder="ej. Guesty, Airbnb..."
									id="newComp"
									value={newComp}
									onChange={(e) => setNewComp(e.target.value)}
									onKeyDown={(e) => {
										if (e.key === 'Enter') {
											e.preventDefault();
											addCompetitor();
										}
									}}
								/>
							</div>
							<Button
								label="+ Añadir"
								color="secondary"
								onClick={addCompetitor}
							/>
						</div>
					</div>

					{/* Áreas */}
					<div className="flex flex-col gap-2">
						<p className="text-sm font-medium text-gray-700">
							Área de análisis
						</p>
						<div className="flex flex-wrap gap-1.5">
							{FOCUS_OPTIONS.map((area) => (
								<button
									key={area}
									type="button"
									onClick={() => toggleArea(area)}
									className={`rounded-full border px-3 py-1 text-xs transition-colors ${
										activeAreas.includes(area)
											? 'border-transparent bg-primary-100 text-primary-800 font-medium'
											: 'border-gray-200 bg-white text-gray-400 hover:text-gray-600'
									}`}
								>
									{area}
								</button>
							))}
						</div>
					</div>

					{/* Contexto */}
					<div className="flex flex-col gap-1">
						<label className="text-sm font-medium text-gray-700">
							Contexto de tu app
						</label>
						<textarea
							value={context}
							onChange={(e) => setContext(e.target.value)}
							placeholder={DEFAULT_CONTEXT}
							rows={8}
							className="w-full resize-none rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-800 placeholder:text-gray-300 focus:outline-none focus:border-gray-400 focus:bg-white transition-colors"
						/>
					</div>

					{/* Profundidad — mismo patrón que el toggle dateTimeMode */}
					<div className="flex flex-col gap-2">
						<div className="flex items-center justify-between">
							<p className="text-sm font-medium text-gray-700">
								Profundidad
							</p>
							<span className="text-xs text-gray-500">
								{DEPTH_LABELS[depth]}
							</span>
						</div>
						<div className="flex gap-1 p-1 rounded-full bg-gray-200">
							{(
								['Rápido', 'Equilibrado', 'Exhaustivo'] as const
							).map((label, i) => (
								<Button
									key={label}
									label={label}
									className="w-full"
									color={
										depth === i + 1 ? 'white' : 'secondary'
									}
									onClick={() => setDepth(i + 1)}
								/>
							))}
						</div>
					</div>

					{/* Hint — mismo patrón que address_hint */}
					<div className="rounded-lg bg-primary-100 p-4 text-sm text-primary-800 font-medium">
						Al pulsar lanzar, se copiará el prompt y se abrirá
						Claude. Pega con <kbd className="font-mono">⌘V</kbd> y
						envía.
					</div>

					{/* Acción principal */}
					<Button
						label="↗ Lanzar análisis en Claude"
						className="w-full"
						color="primary"
						onClick={runAgent}
					/>

					{/* Historial */}
					{history.length > 0 && (
						<div className="flex flex-col gap-2 pt-2 border-t border-gray-100">
							<p className="text-xs text-gray-400">
								Análisis anteriores
							</p>
							{history.map((h, i) => (
								<div
									key={i}
									className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 px-3 py-2"
								>
									<span className="text-xs text-gray-600 truncate mr-3">
										{h.competitors.join(', ')} —{' '}
										{h.focuses.slice(0, 2).join(', ')}
										{h.focuses.length > 2 && '…'}
									</span>
									<span className="text-xs text-gray-300 whitespace-nowrap">
										{h.date}
									</span>
								</div>
							))}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
