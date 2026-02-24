import clsx from 'clsx';

import { useTranslations } from 'next-intl';

import Typography from '@/components/atoms/typography';
import BadgeCheck from '@/components/atoms/BadgeCheck';
import IconCircle from '@/components/atoms/icon/circle';

type RecomendationCardProps = {
	id?: string;
	name: string;
	address: string;
	rating: number | undefined;
	selected: boolean;
	applyRecommendation: () => void;
};

const RecomendationCard = ({
	id,
	name,
	address,
	rating,
	applyRecommendation,
	selected = false,
}: RecomendationCardProps) => {
	const t = useTranslations();

	const buttonStyles = clsx(
		{ 'border-primary-500 bg-primary-500 hover:bg-primary-500': selected },
		{ 'bg-white border-gray-100 hover:bg-secondary-100': !selected },
	);

	const nameStyle = clsx(
		{ 'text-white': selected },
		{ 'text-gray-900': !selected },
	);

	const addressStyle = clsx(
		{ 'text-white': selected },
		{ 'text-gray-500': !selected },
	);

	return (
		<button
			key={id}
			type="button"
			onClick={applyRecommendation}
			className={`w-full text-left rounded-xl p-3 hover:cursor-pointer transition-all ${buttonStyles}`}
		>
			<div className="flex items-start justify-between gap-2">
				<div className="flex flex-col gap-1 w-full">
					<div className="flex gap-2 items-center justify-between">
						<Typography
							size="sm"
							weight="medium"
							color={`${nameStyle}`}
						>
							<small className="mr-1 text-primary-500 py-0.5 px-1 rounded-md bg-primary-100">
								{typeof rating === 'number'
									? `★ ${rating.toFixed(1).toString()}`
									: ''}{' '}
							</small>
						</Typography>

						{selected ? (
							<BadgeCheck
								checked
								label={
									selected
										? t('recommendations.selected')
										: t('recommendations.use')
								}
							/>
						) : (
							<BadgeCheck
								checked={false}
								className="bg-white shrink-0 hover:bg-white"
								iconUnchecked={
									<span className="opacity-50">
										<IconCircle color="secondary" />
									</span>
								}
								label={
									selected
										? t('recommendations.selected')
										: t('recommendations.use')
								}
							/>
						)}
					</div>
					<Typography
						weight="medium"
						fontFamily="base"
						color={`${nameStyle} -mb-0.5`}
					>
						{name}
					</Typography>
					<Typography
						size="sm"
						weight="medium"
						color={`${addressStyle}`}
					>
						{address}
					</Typography>
				</div>
			</div>
		</button>
	);
};

export default RecomendationCard;
