import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: Request) {
  try {
    const { clientId, clientSecret } = await req.json();

    if (!clientId || !clientSecret) {
      return NextResponse.json(
        { success: false, message: 'Client ID and Client Secret are required' },
        { status: 400 }
      );
    }

    const envPath = path.join(process.cwd(), '.env.local');
    let envContent = '';
    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, 'utf8');
    }

    // Update or append DISCORD_CLIENT_ID & DISCORD_CLIENT_SECRET
    const cleanId = clientId.trim();
    const cleanSecret = clientSecret.trim();

    process.env.DISCORD_CLIENT_ID = cleanId;
    process.env.DISCORD_CLIENT_SECRET = cleanSecret;

    const lines = envContent.split('\n').filter((l) => {
      const trimmed = l.trim();
      return !trimmed.startsWith('DISCORD_CLIENT_ID=') && !trimmed.startsWith('DISCORD_CLIENT_SECRET=');
    });

    lines.push(`DISCORD_CLIENT_ID=${cleanId}`);
    lines.push(`DISCORD_CLIENT_SECRET=${cleanSecret}`);

    fs.writeFileSync(envPath, lines.join('\n').trim() + '\n', 'utf8');

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const error = err as Error;
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
