// app/api/generate-itinerary/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getPrompt } from '@/config/prompt';

type POI = {
	name: string;
	type: string;
	lat: number;
	lng: number;
	description: string;
	estimated_duration: number;
	start_time?: string;
};

export async function POST(req: NextRequest) {
	try {
		const body = await req.json();

		const {
			location,
			preferences,
			duration,
			transport,
			poiList,
			locale,
		}: {
			location: string;
			preferences: string[];
			duration: string;
			transport: string;
			poiList: POI[];
			locale: string;
		} = body;

		const prompt = getPrompt(locale, {
			location,
			duration,
			preferences,
			transport,
			poiList,
		});

		const response = await fetch(
			'https://api.openai.com/v1/chat/completions',
			{
				method: 'POST',
				headers: {
					Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					model: 'gpt-3.5-turbo',
					temperature: 0.9,
					max_tokens: 700,
					messages: [
						{
							role: 'system',
							content:
								'You are a helpful travel assistant that generates friendly, practical, and clear itinerary suggestions for travelers.',
						},
						{
							role: 'user',
							content: prompt,
						},
					],
				}),
			}
		);

		if (!response.ok) {
			const error = await response.text();
			console.error('OpenAI API error:', error);
			return NextResponse.json(
				{ success: false, error: 'OpenAI API error' },
				{ status: 500 }
			);
		}

		const data = await response.json();
		const itinerary = data.choices[0].message.content;

		return NextResponse.json({ success: true, itinerary });
	} catch (error) {
		console.error('Itinerary generation error:', error);
		return NextResponse.json(
			{
				success: false,
				error: 'Internal server error generating itinerary',
			},
			{ status: 500 }
		);
	}
}
