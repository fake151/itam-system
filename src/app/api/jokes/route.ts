import { NextRequest, NextResponse } from 'next/server';

const JOKE_API_URL = 'https://api.api-ninjas.com/v1/jokes';

export async function GET(request: NextRequest) {
  try {
    const category = request.nextUrl.searchParams.get('category');

    let url = JOKE_API_URL;
    if (category) {
      url += `?category=${encodeURIComponent(category)}`;
    }

    const response = await fetch(url, {
      headers: {
        'X-Api-Key': process.env.API_NINJAS_KEY || '',
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch joke from external API' },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      data: Array.isArray(data) ? data[0] : data,
    });
  } catch (error) {
    console.error('Error fetching joke:', error);
    return NextResponse.json(
      { error: 'Failed to fetch joke' },
      { status: 500 }
    );
  }
}
