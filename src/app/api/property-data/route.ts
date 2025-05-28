// app/api/property-data/by-subcategory/route.ts
import { NextResponse } from 'next/server';
import { getPropertyDataBySubCategory } from '@/utils/get-property-data-by-subcategory';

export async function POST(req: Request) {
	const body = await req.json();
	const { propertyId, subCategoryId } = body;

	if (!propertyId || !subCategoryId) {
		return NextResponse.json(
			{ error: 'Missing parameters' },
			{ status: 400 }
		);
	}

	const data = await getPropertyDataBySubCategory({
		propertyId,
		subCategoryId,
	});

	return NextResponse.json({ data });
}
