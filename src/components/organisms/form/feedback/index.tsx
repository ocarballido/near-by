'use client';

import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { createFeedback } from '@/app/actions/feedback/create-feedback';

type SourceArea =
	| 'create_property'
	| 'create_location'
	| 'create_info'
	| 'dashboard'
	| 'subscription';

type ContextType = 'property' | 'location' | 'info' | 'none';
type Category = 'question' | 'suggestion' | 'unclear' | 'bug' | 'other';

type Props = {
	sourceArea: SourceArea;
	contextType?: ContextType;
	contextId?: string;
	returnTo?: string;
};

export default function FeedbackForm({
	sourceArea,
	contextType,
	contextId,
	returnTo,
}: Props) {
	const locale = useLocale();
	const router = useRouter();

	const [message, setMessage] = useState('');
	const [category, setCategory] = useState<Category>('other');
	const [email, setEmail] = useState('');
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState(false);

	const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setCategory(e.target.value as Category);
	};

	const onCancel = () => {
		if (returnTo) {
			router.push(returnTo);
		} else {
			router.back();
		}
	};

	const onSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);

		const fd = new FormData();
		fd.append('message', message);
		fd.append('category', category);
		if (email.trim()) fd.append('user_email', email.trim());

		fd.append('source_area', sourceArea);
		fd.append('context_type', contextType ?? 'none');
		if (contextId) fd.append('context_id', contextId);

		if (returnTo) {
			fd.append('page_path', returnTo);
		}
		fd.append('locale', locale);

		const res = await createFeedback(fd);

		if (res?.errors?.server?.length) {
			setError(res.errors.server.join(', '));
			return;
		}

		setSuccess(true);
		setMessage('');
		setEmail('');
	};

	if (success) {
		return (
			<div className="p-4 rounded-md bg-green-50">
				<p className="text-sm">
					¡Gracias! 🙌 Tu comentario ya está en nuestras manos.
				</p>
				<button
					className="mt-3 underline"
					onClick={onCancel}
					type="button"
				>
					Volver
				</button>
			</div>
		);
	}

	return (
		<form onSubmit={onSubmit} className="flex flex-col gap-3 max-w-[480px]">
			{error && <p className="text-sm text-red-600">{error}</p>}

			<label className="text-sm font-medium">Tipo</label>
			<select
				value={category}
				onChange={handleCategoryChange}
				className="border rounded p-2"
			>
				<option value="question">Tengo una duda</option>
				<option value="suggestion">Sugerencia</option>
				<option value="unclear">Algo no me ha quedado claro</option>
				<option value="bug">He tenido un problema</option>
				<option value="other">Otro</option>
			</select>

			<label className="text-sm font-medium">Mensaje *</label>
			<textarea
				className="border rounded p-2 min-h-[120px]"
				value={message}
				onChange={(e) => setMessage(e.target.value)}
				required
			/>

			<label className="text-sm font-medium">Email (opcional)</label>
			<input
				className="border rounded p-2"
				value={email}
				onChange={(e) => setEmail(e.target.value)}
				placeholder="Solo si quieres respuesta"
			/>

			<div className="flex gap-2">
				<button
					type="button"
					className="border rounded p-2 w-full"
					onClick={onCancel}
				>
					Cancelar
				</button>
				<button
					type="submit"
					className="rounded p-2 w-full bg-black text-white"
					disabled={!message.trim()}
				>
					Enviar comentario
				</button>
			</div>
		</form>
	);
}
