import { getTranslations } from 'next-intl/server';

import { fetchWeather } from '@/components/templates/weather-widget/_data';
import Image from 'next/image';

const WEEKDAY_KEYS = [
	'weatherSun',
	'weatherMon',
	'weatherTue',
	'weatherWed',
	'weatherThu',
	'weatherFri',
	'weatherSat',
] as const;

type Props = {
	lat: number;
	lng: number;
};

export default async function WeatherWidget({ lat, lng }: Props) {
	const t = await getTranslations();

	const weather = await fetchWeather(lat, lng);

	if (!weather) return null;

	return (
		<div className="flex flex-col gap-3 rounded-xl bg-white p-1.5 shadow-xs">
			<div className="flex justify-between gap-1">
				{weather.days.map((day, index) => {
					const isToday = index === 0;

					return (
						<div
							key={day.date}
							className={`flex flex-col items-center gap-1 flex-1 py-2 px-1 transition-colors ${
								isToday ? 'bg-primary-50 rounded-lg' : ''
							}`}
						>
							<span
								className={`text-xs font-semibold uppercase ${
									isToday
										? 'text-primary-500'
										: 'text-muted-foreground'
								}`}
							>
								{isToday
									? t('weatherToday')
									: t(WEEKDAY_KEYS[day.weekdayIndex])}
							</span>
							<Image
								src={`/static/icons/weather/${day.icon}.svg`}
								alt={day.icon}
								width={32}
								height={32}
							/>
							<span
								className={`text-xs font-semibold ${
									isToday ? 'text-primary-500' : ''
								}`}
							>
								{day.maxTemp}°
							</span>
							<span className="text-xs text-muted-foreground">
								{day.minTemp}°
							</span>
							<span className="text-xs text-blue-500">
								{day.precipitationProbability}%
							</span>
						</div>
					);
				})}
			</div>
		</div>
	);
}
