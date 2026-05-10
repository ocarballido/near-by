import { getTranslations } from 'next-intl/server';

export default async function GuestChatPreview() {
	const t = await getTranslations('GuestChat');

	return (
		<div className="flex flex-col w-[80%] h-80 bg-white rounded-2xl shadow-2xl overflow-hidden mx-auto">
			{/* Header */}
			<div className="flex items-center gap-2 px-4 py-3 bg-primary-500">
				<span className="text-xl">🏠</span>
				<span className="text-white font-semibold text-sm">
					{t('header')}
				</span>
			</div>

			{/* Mensajes simulados */}
			<div className="flex flex-col gap-3 p-4 flex-1">
				<div className="flex justify-start">
					<div className="max-w-[85%] rounded-2xl rounded-bl-sm px-3 py-2 text-xs bg-gray-100 text-gray-800 leading-relaxed">
						{t('previewWelcome')}
					</div>
				</div>
				<div className="flex justify-end">
					<div className="max-w-[85%] rounded-2xl rounded-br-sm px-3 py-2 text-xs bg-primary-200 text-primary-800 font-medium leading-relaxed">
						{t('previewQuestion1')}
					</div>
				</div>
				<div className="flex justify-start">
					<div className="max-w-[85%] rounded-2xl rounded-bl-sm px-3 py-2 text-xs bg-gray-100 text-gray-800 leading-relaxed">
						{t('previewAnswer1')}
					</div>
				</div>
				<div className="flex justify-end">
					<div className="max-w-[85%] rounded-2xl rounded-br-sm px-3 py-2 text-xs bg-primary-200 text-primary-800 font-medium leading-relaxed">
						{t('previewQuestion2')}
					</div>
				</div>
				<div className="flex justify-start">
					<div className="max-w-[85%] rounded-2xl rounded-bl-sm px-3 py-2 text-xs bg-gray-100 text-gray-800 leading-relaxed">
						{t('previewAnswer2')}
					</div>
				</div>
			</div>

			{/* Input simulado */}
			<div className="flex items-center gap-2 px-3 py-3 border-t border-gray-100">
				<div className="flex-1 bg-gray-50 border border-gray-200 rounded-full px-4 py-2 text-xs text-gray-400">
					{t('previewInputPlaceholder')}
				</div>
				<div className="w-7 h-7 flex items-center justify-center rounded-full bg-gradient-to-r from-orange-400 to-green-400 flex-shrink-0">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="white"
						className="w-3 h-3"
					>
						<path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
					</svg>
				</div>
			</div>
		</div>
	);
}
