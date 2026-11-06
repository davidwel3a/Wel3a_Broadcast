import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAuthUser } from '@/lib/auth';
import { mockTemplates } from '@/lib/mock-data';

const templateSchema = z.object({
  name: z.string().min(1, 'Template name is required'),
  content: z.string().optional().default(''),
  embed: z.any().optional().nullable(),
});

export async function GET() {
  try {
    await requireAuthUser();
    return NextResponse.json([]);
  } catch (err: unknown) {
    const error = err as Error;
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}

export async function POST(req: Request) {
  try {
    await requireAuthUser();
    const body = await req.json();
    const payload = templateSchema.parse(body);

    const newTemplate = {
      id: `tpl_${Date.now()}`,
      name: payload.name,
      content: payload.content || null,
      embed: payload.embed || null,
      imageUrl: null,
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json(newTemplate);
  } catch (err: unknown) {
    const error = err as Error;
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}
