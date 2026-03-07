import { NextRequest, NextResponse } from 'next/server';

const TRIPOSR_API_URL = process.env.TRIPOSR_API_URL;
const TRIPOSR_API_TOKEN = process.env.TRIPOSR_API_TOKEN;

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const statusUrl = searchParams.get('statusUrl');
  const taskId = searchParams.get('taskId');

  const resolvedUrl =
    statusUrl ??
    (taskId && TRIPOSR_API_URL ? `${TRIPOSR_API_URL}/task/${taskId}` : null);

  if (!resolvedUrl) {
    return NextResponse.json(
      { error: 'statusUrl or taskId query param required.' },
      { status: 400 }
    );
  }

  // Validate that the status URL is on the expected TripoSR host to prevent SSRF
  if (TRIPOSR_API_URL && !resolvedUrl.startsWith(TRIPOSR_API_URL)) {
    return NextResponse.json(
      { error: 'statusUrl host does not match configured TRIPOSR_API_URL.' },
      { status: 400 }
    );
  }

  try {
    const headers: HeadersInit = {};
    if (TRIPOSR_API_TOKEN) {
      headers.Authorization = `Bearer ${TRIPOSR_API_TOKEN}`;
    }

    const response = await fetch(resolvedUrl, { method: 'GET', headers });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Status check failed: ${response.status}` },
        { status: 502 }
      );
    }

    const data = (await response.json()) as {
      status?: string;
      glbUrl?: string;
      output?: { glbUrl?: string };
    };

    if (data.status === 'FAILED') {
      return NextResponse.json({ status: 'FAILED', error: 'TripoSR conversion failed.' });
    }

    const glbUrl = data.glbUrl ?? data.output?.glbUrl;
    if ((data.status === 'SUCCEEDED' || data.status === 'SUCCESS') && glbUrl) {
      return NextResponse.json({ status: 'SUCCEEDED', glbUrl });
    }

    return NextResponse.json({ status: data.status ?? 'PENDING' });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
