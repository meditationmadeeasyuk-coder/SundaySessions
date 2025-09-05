import { NextRequest, NextResponse } from 'next/server';
import { serverSupabase } from '@/lib/serverSupabase';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const e = url.searchParams.get('e');
  const t = url.searchParams.get('t');
  const s = url.searchParams.get('s') || 'going';
  if(!e || !t) return NextResponse.redirect(new URL('/events', url.origin));

  const supabase = serverSupabase();
  const { error } = await supabase.rpc('rsvp_with_token', { p_event: e, p_token: t, p_status: s });
  const to = new URL(`/events/${e}?rsvp=${error ? 'failed' : 'ok'}`, url.origin);
  return NextResponse.redirect(to);
}
