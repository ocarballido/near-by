'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import TextField from '@/components/molecules/text-field';

interface Message {
	role: 'bot' | 'user';
	text: string;
}

interface GuestChatProps {
	propertyId: string;
	locale: string;
}

export default function GuestChat({ propertyId, locale }: GuestChatProps) {
	const t = useTranslations('GuestChat');

	const containerRef = useRef<HTMLDivElement>(null);

	const [open, setOpen] = useState(false);
	const [messages, setMessages] = useState<Message[]>([
		{ role: 'bot', text: t('welcomeMessage') },
	]);
	const [input, setInput] = useState('');
	const [loading, setLoading] = useState(false);
	const bottomRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (open) {
			bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
		}
	}, [messages, open]);

	useEffect(() => {
		function handleClickOutside(e: MouseEvent) {
			if (
				containerRef.current &&
				!containerRef.current.contains(e.target as Node)
			) {
				setOpen(false);
			}
		}

		if (open) {
			document.addEventListener('mousedown', handleClickOutside);
		}

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [open]);

	async function sendMessage() {
		const text = input.trim();
		if (!text || loading) return;

		setInput('');
		setMessages((prev) => [...prev, { role: 'user', text }]);
		setLoading(true);

		try {
			const res = await fetch('/api/chat', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ message: text, propertyId, locale }),
			});
			const { reply } = await res.json();
			setMessages((prev) => [...prev, { role: 'bot', text: reply }]);
		} catch {
			setMessages((prev) => [
				...prev,
				{ role: 'bot', text: t('networkError') },
			]);
		} finally {
			setLoading(false);
		}
	}

	return (
		<div
			ref={containerRef}
			className="fixed bottom-6 right-4 z-50 flex flex-col items-end gap-3"
		>
			{/* Panel de chat */}
			{open && (
				<div className="flex flex-col w-80 h-96 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
					{/* Header */}
					<div className="flex items-center justify-between px-4 py-3 bg-primary-500">
						<div className="flex items-center gap-2">
							<span className="text-xl">🏠</span>
							<span className="text-white font-semibold text-sm">
								{t('header')}
							</span>
						</div>
						<button
							onClick={() => setOpen(false)}
							className="text-white hover:opacity-75 transition-opacity text-lg leading-none"
							aria-label={t('closeAriaLabel')}
						>
							✕
						</button>
					</div>

					{/* Mensajes */}
					<div className="flex flex-col gap-3 p-4 overflow-y-auto flex-1">
						{messages.map((msg, i) => (
							<div
								key={i}
								className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
							>
								<div
									className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm whitespace-pre-wrap leading-relaxed ${
										msg.role === 'user'
											? 'bg-primary-200 text-primary-800 font-medium rounded-br-sm'
											: 'bg-gray-100 text-gray-800 rounded-bl-sm'
									}`}
								>
									{msg.text}
								</div>
							</div>
						))}
						{loading && (
							<div className="flex justify-start">
								<div className="bg-gray-100 rounded-2xl rounded-bl-sm px-4 py-2">
									<span className="flex gap-1 items-center h-4">
										<span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0ms]" />
										<span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:150ms]" />
										<span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:300ms]" />
									</span>
								</div>
							</div>
						)}
						<div ref={bottomRef} />
					</div>

					{/* Input */}
					<div className="flex items-center gap-2 px-3 py-3 border-t border-gray-100">
						<TextField
							label=""
							placeholder={t('inputPlaceholder')}
							value={input}
							onChange={(e) => setInput(e.target.value)}
							onKeyDown={(e) => {
								if (e.key === 'Enter') sendMessage();
							}}
							disabled={loading}
							id="guest-chat-input"
							className="w-full"
						/>
						<button
							onClick={sendMessage}
							disabled={loading || !input.trim()}
							className="w-8 h-8 flex items-center justify-center rounded-full bg-gradient-to-r from-orange-400 to-green-400 text-white disabled:opacity-40 transition-opacity flex-shrink-0"
							aria-label={t('sendAriaLabel')}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 24 24"
								fill="currentColor"
								className="w-4 h-4"
							>
								<path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
							</svg>
						</button>
					</div>
				</div>
			)}

			{/* Botón flotante */}
			<button
				onClick={() => setOpen((prev) => !prev)}
				className="flex items-center gap-2 px-3.5 h-12 rounded-full bg-gradient-to-r from-orange-400 to-green-400 text-white shadow-lg hover:opacity-90 transition-opacity hover:cursor-pointer"
				aria-label={t('header')}
			>
				{open ? (
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="currentColor"
						className="w-5 h-5 flex-shrink-0"
					>
						<path
							fillRule="evenodd"
							d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z"
							clipRule="evenodd"
						/>
					</svg>
				) : (
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="currentColor"
						className="w-5 h-5 flex-shrink-0"
					>
						<path
							fillRule="evenodd"
							d="M4.848 2.771A49.144 49.144 0 0112 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 01-3.476.383.39.39 0 00-.297.17l-2.755 4.133a.75.75 0 01-1.248 0l-2.755-4.133a.39.39 0 00-.297-.17 48.9 48.9 0 01-3.476-.384c-1.978-.29-3.348-2.024-3.348-3.97V6.741c0-1.946 1.37-3.68 3.348-3.97z"
							clipRule="evenodd"
						/>
					</svg>
				)}
				{!open && (
					<span className="text-sm font-medium whitespace-nowrap">
						{t('triggerLabel')}
					</span>
				)}
			</button>
		</div>
	);
}
