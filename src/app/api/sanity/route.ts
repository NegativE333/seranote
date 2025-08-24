import { NextResponse } from 'next/server';
import { client } from '@/lib/sanity';

export async function GET() {
  try {
    const query = `
      *[_type == 'songs' && category == "throwbacktunes"] {
        title,
        artist,
        category,
        album,
        "currentSlug": slug.current,
        cover,
        audioLink,
        audioDur
      }`;

    const data = await client.fetch(query);
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching songs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch songs' },
      { status: 500 }
    );
  }
}