import { NextRequest, NextResponse } from 'next/server';

const TRIPOSR_API_URL = process.env.TRIPOSR_API_URL;
const TRIPOSR_API_TOKEN = process.env.TRIPOSR_API_TOKEN;

const MAX_FILE_SIZE_BYTES = 4 * 1024 * 1024;

export const runtime = 'edge';

function validatePhoto(
  photo: unknown
): { valid: true; file: File } | { valid: false; message: string } {
  if (!(photo instanceof File)) {
    return { valid: false, message: 'No image file provided.' };
  }

  if (!photo.type.startsWith('image/')) {
    return {
      valid: false,
      message: 'Unsupported file type. Use an image file.',
    };
  }

  if (photo.size > MAX_FILE_SIZE_BYTES) {
    return { valid: false, message: 'Image exceeds 4MB limit.' };
  }

  return { valid: true, file: photo };
}

export async function POST(req: NextRequest) {
  try {
    if (!TRIPOSR_API_URL) {
      return NextResponse.json(
        { error: 'Missing TRIPOSR_API_URL server configuration. Point it to your local TripoSR service.' },
        { status: 500 }
      );
    }

    const formData = await req.formData();
    const validation = validatePhoto(formData.get('photo'));
    if (!validation.valid) {
      return NextResponse.json({ error: validation.message }, { status: 400 });
    }

    const uploadForm = new FormData();
    uploadForm.append('photo', validation.file);

    const headers: HeadersInit = {};
    if (TRIPOSR_API_TOKEN) {
      headers.Authorization = `Bearer ${TRIPOSR_API_TOKEN}`;
    }

    const response = await fetch(`${TRIPOSR_API_URL}/convert`, {
      method: 'POST',
      headers,
      body: uploadForm,
    });

    if (!response.ok) {
      const errText = await response.text();
      return NextResponse.json(
        { error: `TripoSR start failed: ${errText}` },
        { status: 500 }
      );
    }

    const data = (await response.json()) as {
      glbUrl?: string;
      taskId?: string;
      statusUrl?: string;
    };

    // Synchronous result — service already completed
    if (data.glbUrl) {
      return NextResponse.json({ success: true, glbUrl: data.glbUrl });
    }

    // Async task started — return identifiers for client-side polling
    const statusUrl =
      data.statusUrl ??
      (data.taskId ? `${TRIPOSR_API_URL}/task/${data.taskId}` : undefined);

    if (!statusUrl) {
      return NextResponse.json(
        { error: 'TripoSR did not return glbUrl, taskId, or statusUrl.' },
        { status: 502 }
      );
    }

    return NextResponse.json({ pending: true, statusUrl, taskId: data.taskId });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Unknown server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
