import { NextResponse } from 'next/server';
import { serverSupabase } from '@/lib/serverSupabase';

export async function GET() {
  const supabase = serverSupabase();
  await supabase.auth.signOut();
  return NextResponse.redirect(new URL('/login', process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'));
}
