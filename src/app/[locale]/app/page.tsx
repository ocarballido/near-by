import { useTranslations } from 'next-intl';

import { TIPS } from '@/config/config-constants';

import AppContentTemplate from '@/components/templates/app-content';
import PropertyNumber from '@/components/molecules/property-number';
import ButtonLink from '@/components/molecules/button-link';

export default function DashboardContent() {
	const t = useTranslations();

	return (
		<AppContentTemplate>
			<div className="p-4 font-roboto flex flex-col grow justify-center items-center gap-4 bg-white rounded-lg overflow-hidden">
				<PropertyNumber />

				<ButtonLink
					href="/app/feedback/dashboard"
					label="Tienes una duda o comentario?"
				/>

				<div className="flex flex-wrap max-w-[1000px] p-4 rounded-2xl border-2 border-primary-100 mt-8">
					{TIPS.map((tip) => (
						<div
							key={tip.id}
							className="flex flex-col w-full md:w-full lg:w-1/2 xl:w-1/3 gap-1 p-4 items-center text-center"
						>
							<div className="flex justify-center items-center w-18 h-18 rounded-full bg-gradient-to-tr from-[#FF6B06]/10 to-[#31C48D]/10">
								<span className="flex justify-center items-center w-12 h-12 rounded-full bg-gradient-to-tr from-[#FF6B06] to-[#31C48D] font-bold text-white text-xl">
									{tip.id}
								</span>
							</div>
							<h3 className="text-md font-bold font-heading mt-1">
								{t(tip.title)}
							</h3>
							<p className="font-body text-sm font-medium opacity-70">
								{t(tip.subtitle)}
							</p>
						</div>
					))}
				</div>
			</div>
		</AppContentTemplate>
	);
}
