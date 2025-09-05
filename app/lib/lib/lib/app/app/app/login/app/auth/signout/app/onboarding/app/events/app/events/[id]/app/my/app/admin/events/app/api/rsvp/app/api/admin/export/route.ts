import { NextRequest, NextResponse } from 'next/server';
import { serverSupabase } from '@/lib/serverSupabase';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const eventId = url.searchParams.get('event_id');
  if(!eventId) return new NextResponse('Missing event_id', { status: 400 });

  const supabase = serverSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if(!user) return new NextResponse('Unauthorized', { status: 401 });

  const { data: prof } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  if(!prof || prof.role !== 'admin') return new NextResponse('Forbidden', { status: 403 });

  const { data, error } = await supabase
    .from('registrations')
    .select('status, created_at, profiles(email,full_name,phone), events(title,starts_at,location)')
    .eq('event_id', eventId);

  if(error) return new NextResponse(error.message, { status: 500 });

  const rows = [['Email','Full Name','Phone','Event Title','Starts At','Location','Status','RSVP Time']];
  for(const r of (data||[])) {
    rows.push([
      r.profiles?.email || '',
      r.profiles?.full_name || '',
      r.profiles?.phone || '',
      r.events?.title || '',
      r.events?.starts_at || '',
      r.events?.location || '',
      r.status || '',
      r.created_at || ''
    ]);
  }
  const csv = rows.map(cols => cols.map(c => typeof c === 'string' && c.includes(',') ? `"${c.replace(/"/g,'""')}"` : c).join(',')).join('\n');
  return new NextResponse(csv, {
    headers: {
      'content-type': 'text/csv; charset=utf-8',
      'content-disposition': `attachment; filename="event_${eventId}_registrations.csv"`
    }
  });
}
