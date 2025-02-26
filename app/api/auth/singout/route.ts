import { NextResponse } from 'next/server';
import { signOutUser } from '@/lib/actions/user.actions';

export async function POST() {
  const result = await signOutUser();

  if (!result.success) {
    return NextResponse.json({ error: result.success }, { status: 500 });
  }

  // Redirect manually after logout
  return NextResponse.redirect(new URL('/', process.env.NEXT_PUBLIC_SERVER_URL));
}