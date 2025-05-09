import clsx from 'clsx';

import { useTranslations } from 'next-intl';

import { SUBSCRIPTION_FEATURES } from '@/config/config-constants';

import IconNewRelease from '@/components/atoms/icon/new-releases';
import Button from '../button';

type SubscriptionCardProps = {
	active: boolean;
	className?: string;
	handleGetSubscription?: () => void;
	price: string;
	type: 'FREE' | 'PREMIUM' | 'PLATINUM';
};

const SubscriptionCard = ({
	active = false,
	className = '',
	handleGetSubscription,
	price = '0',
	type = 'FREE',
}: SubscriptionCardProps) => {
	const t = useTranslations();

	const cardStyles = clsx(
		{ 'bg-gray-100 text-gray-600': type === 'FREE' },
		// { 'bg-primary-600 text-white': type === 'PREMIUM' },
		{
			'bg-gradient-to-tr from-[#FF6B06] to-[#31C48D] text-white':
				type === 'PREMIUM' && active,
		},
		{ 'bg-gray-900 text-white': type === 'PLATINUM' }
	);

	const cardHeadingStyles = clsx(
		{ 'bg-gray-200 text-primary-500': type === 'FREE' && active },
		{ 'bg-white/20 text-white': type === 'PREMIUM' && active },
		{ 'bg-gray-800': type === 'PLATINUM' && active }
	);

	return (
		<div className={`${className}`}>
			<div
				className={`flex flex-col p-2 rounded-xl w-full ${cardStyles}`}
			>
				<div
					className={`flex p-4 rounded-lg items-center ${cardHeadingStyles}`}
				>
					<div className="mr-auto">
						<h2 className={`font-heading font-bold text-lg`}>
							{type}
						</h2>
						<p className="font-bold text-md">{price}</p>
					</div>
					{active && (
						<IconNewRelease
							color={
								type === 'FREE' || type === 'PLATINUM'
									? 'primary'
									: 'white'
							}
							size={30}
						/>
					)}
				</div>
				<table>
					<tbody>
						{SUBSCRIPTION_FEATURES[type].features.map(
							(row, index) => (
								<tr key={index}>
									<td className="py-4 pl-4 pr-2 font-bold w-full">
										{t(row.label)}
									</td>
									<td className="py-4 pr-4 pl-2 font-medium w-auto text-right">
										{t(row.value)}
									</td>
								</tr>
							)
						)}
					</tbody>
				</table>
				{(type === 'PREMIUM' || type === 'PLATINUM') && !active && (
					<Button
						label={t('Contratar suscripción')}
						iconLeft={<IconNewRelease />}
						color={type === 'PREMIUM' ? 'white' : 'primary'}
						onClick={handleGetSubscription}
						disabled
					/>
				)}
			</div>
		</div>
	);
};

export default SubscriptionCard;
