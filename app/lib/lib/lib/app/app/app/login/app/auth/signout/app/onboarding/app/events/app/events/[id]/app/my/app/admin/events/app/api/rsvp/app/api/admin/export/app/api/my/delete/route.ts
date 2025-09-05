import { NextResponse } from 'next/server';
import { serverSupabase } from '@/lib/serverSupabase';

export async function POST() {
  const supabase = serverSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if(!user) return new NextResponse('Unauthorized', { status: 401 });
  const { error } = await supabase.rpc('delete_my_profile');
  if(error) return new NextResponse(error.message, { status: 500 });
  await supabase.auth.signOut();
  return NextResponse.json({ ok: true });
}
