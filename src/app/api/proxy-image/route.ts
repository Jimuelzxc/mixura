import {NextRequest, NextResponse} from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { imageUrl } = await req.json();

    if (!imageUrl || typeof imageUrl !== 'string') {
      return NextResponse.json({ error: 'imageUrl is required' }, { status: 400 });
    }

    // Use a generic user-agent to avoid being blocked
    const response = await fetch(imageUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      }
    });
    
    if (!response.ok) {
        let errorBody = 'Failed to fetch image.';
        try {
            errorBody = await response.text();
        } catch (e) { /* ignore */ }
      return NextResponse.json({ error: `Failed to fetch image. Status: ${response.status}. Body: ${errorBody}` }, { status: response.status });
    }

    const contentType = response.headers.get('content-type') || 'application/octet-stream';
    const buffer = await response.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');
    const dataUri = `data:${contentType};base64,${base64}`;

    return NextResponse.json({ dataUri });

  } catch (error: any) {
    console.error('Image proxy error:', error);
    return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
  }
}
