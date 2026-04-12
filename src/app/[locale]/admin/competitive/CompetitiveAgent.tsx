'use client';

import { useState, useEffect } from 'react';

const DEFAULT_COMPETITORS = ['TouchStay', 'Hostfully', 'Lodgify'];

const FOCUS_OPTIONS = [
	'Captación de usuarios',
	'Features nuevas',
	'Viralización',
	'Onboarding propietarios',
	'Pricing',
	'Retención inquilinos',
	'Integraciones AI',
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
	const [status, setStatus] = useState<'idle' | 'copied' | 'error'>('idle');

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
		if (competitors.length === 0 || activeAreas.length === 0) return;
		const prompt = buildPrompt(competitors, activeAreas, depth, context);
		try {
			await navigator.clipboard.writeText(prompt);
			setStatus('copied');
			saveHistory(competitors, activeAreas);
			window.open('https://claude.ai/new', '_blank');
			setTimeout(() => setStatus('idle'), 4000);
		} catch {
			setStatus('error');
		}
	}

	return (
		<div className="min-h-screen bg-stone-50 px-4 py-10">
			<div className="mx-auto max-w-2xl">
				{/* Header */}
				<div className="mb-8">
					<h1 className="text-xl font-medium text-stone-900">
						Agente de inteligencia competitiva
					</h1>
					<p className="mt-1 text-sm text-stone-500">
						Configura el análisis, pulsa lanzar y pega el prompt en
						Claude con{' '}
						<kbd className="rounded border border-stone-200 bg-stone-100 px-1.5 py-0.5 text-xs">
							⌘V
						</kbd>
						.
					</p>
				</div>

				<div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
					{/* Competitors */}
					<div className="rounded-xl border border-stone-200 bg-white p-4">
						<p className="mb-3 text-xs text-stone-400">
							Competidores
						</p>
						<div className="mb-3 flex flex-wrap gap-1.5">
							{competitors.map((c) => (
								<span
									key={c}
									className="flex items-center gap-1.5 rounded-full border border-stone-200 bg-stone-50 px-3 py-1 text-xs text-stone-600"
								>
									{c}
									<button
										onClick={() => removeCompetitor(c)}
										className="text-stone-300 hover:text-red-400 transition-colors"
									>
										×
									</button>
								</span>
							))}
						</div>
						<div className="flex gap-2">
							<input
								type="text"
								value={newComp}
								onChange={(e) => setNewComp(e.target.value)}
								onKeyDown={(e) =>
									e.key === 'Enter' && addCompetitor()
								}
								placeholder="Añadir competidor..."
								className="flex-1 rounded-lg border border-stone-200 bg-stone-50 px-3 py-1.5 text-xs text-stone-800 placeholder:text-stone-300 focus:outline-none focus:border-stone-400"
							/>
							<button
								onClick={addCompetitor}
								className="rounded-lg border border-stone-200 bg-white px-3 py-1.5 text-xs text-stone-600 hover:bg-stone-50 transition-colors"
							>
								+ Añadir
							</button>
						</div>
					</div>

					{/* Focus areas */}
					<div className="rounded-xl border border-stone-200 bg-white p-4">
						<p className="mb-3 text-xs text-stone-400">
							Área de análisis
						</p>
						<div className="flex flex-wrap gap-1.5">
							{FOCUS_OPTIONS.map((area) => (
								<button
									key={area}
									onClick={() => toggleArea(area)}
									className={`rounded-full border px-3 py-1 text-xs transition-colors ${
										activeAreas.includes(area)
											? 'border-transparent bg-blue-50 text-blue-700'
											: 'border-stone-200 bg-white text-stone-400 hover:text-stone-600'
									}`}
								>
									{area}
								</button>
							))}
						</div>
					</div>
				</div>

				{/* Context */}
				<div className="mt-3 rounded-xl border border-stone-200 bg-white p-4">
					<p className="mb-2 text-xs text-stone-400">
						Contexto de tu app (actualiza si algo cambia)
					</p>
					<textarea
						value={context}
						onChange={(e) => setContext(e.target.value)}
						placeholder={DEFAULT_CONTEXT}
						rows={3}
						className="w-full resize-none rounded-lg border border-stone-200 bg-stone-50 px-3 py-2 text-xs text-stone-800 placeholder:text-stone-300 focus:outline-none focus:border-stone-400"
					/>
				</div>

				{/* Depth */}
				<div className="mt-3 rounded-xl border border-stone-200 bg-white p-4">
					<p className="mb-3 text-xs text-stone-400">
						Profundidad del análisis
					</p>
					<div className="flex items-center gap-3">
						<span className="text-xs text-stone-400">Rápido</span>
						<input
							type="range"
							min={1}
							max={3}
							step={1}
							value={depth}
							onChange={(e) => setDepth(Number(e.target.value))}
							className="flex-1 accent-blue-600"
						/>
						<span className="text-xs text-stone-400">
							Exhaustivo
						</span>
						<span className="min-w-[120px] text-right text-xs font-medium text-stone-700">
							{DEPTH_LABELS[depth]}
						</span>
					</div>
				</div>

				{/* Run button */}
				<button
					onClick={runAgent}
					disabled={
						competitors.length === 0 || activeAreas.length === 0
					}
					className="mt-4 w-full rounded-xl border border-stone-200 bg-white py-3 text-sm font-medium text-stone-800 transition-colors hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed"
				>
					{status === 'copied'
						? '✓ Copiado — pega en Claude y envía'
						: status === 'error'
							? 'Error al copiar — inténtalo manualmente'
							: '↗ Lanzar análisis en Claude'}
				</button>

				{/* History */}
				{history.length > 0 && (
					<div className="mt-8">
						<p className="mb-3 text-sm font-medium text-stone-500">
							Análisis anteriores
						</p>
						<div className="flex flex-col gap-2">
							{history.map((h, i) => (
								<div
									key={i}
									className="flex items-center justify-between rounded-xl border border-stone-200 bg-white px-4 py-3"
								>
									<span className="text-xs text-stone-600">
										{h.competitors.join(', ')} —{' '}
										{h.focuses.slice(0, 2).join(', ')}
										{h.focuses.length > 2 && '...'}
									</span>
									<span className="text-xs text-stone-300">
										{h.date}
									</span>
								</div>
							))}
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
