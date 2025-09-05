'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

type Event = { id:string; title:string; starts_at:string; ends_at:string; location:string|null; details:string|null };

export default function EventDetail(){
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const qp = useSearchParams();
  const [evt,setEvt]=useState<Event|null>(null);
  const [going,setGoing]=useState<boolean>(false);
  const [loading,setLoading]=useState(true);
  const [msg,setMsg]=useState<string>('');

  useEffect(()=>{ (async ()=>{
    const { data: { user } } = await supabase.auth.getUser();
    if(!user){ window.location.href='/login'; return; }
    const { data: prof } = await supabase.from('profiles').select('id,onboarding_completed').eq('id', user.id).single();
    if(!prof?.onboarding_completed){ router.replace('/onboarding'); return; }
    const { data: ev } = await supabase.from('events').select('*').eq('id', id).single();
    setEvt(ev || null);
    const { data: reg } = await supabase.from('registrations').select('*').eq('event_id', id).maybeSingle();
    setGoing(!!reg && reg.status==='going');
    setLoading(false);
  })(); },[id, router]);

  useEffect(()=>{
    const r = qp.get('rsvp');
    if(r==='ok') setMsg('RSVP saved. See you there!');
    if(r==='failed') setMsg('Sorry, RSVP failed. Try again inside the app.');
  }, [qp]);

  async function rsvp(status: 'going'|'cancelled'){
    const { data: { user } } = await supabase.auth.getUser();
    if(!user) return;
    const { error } = await supabase.from('registrations').upsert({ event_id: id, user_id: user.id, status }, { onConflict: 'event_id,user_id' });
    if(error) alert(error.message);
    else { setGoing(status==='going'); setMsg('RSVP updated.'); }
  }

  if(loading) return <p>Loading…</p>;
  if(!evt) return <p>Event not found.</p>;
  return (
    <div className="card">
      {msg && <div style={{background:'#f0fdf4', border:'1px solid #86efac', padding:8, borderRadius:6, marginBottom:8}}>{msg}</div>}
      <h1>{evt.title}</h1>
      <div>{new Date(evt.starts_at).toLocaleString()} — {new Date(evt.ends_at).toLocaleTimeString()}</div>
      {evt.location && <div>{evt.location}</div>}
      {evt.details && <p>{evt.details}</p>}
      <div style={{display:'flex', gap:8, marginTop:12, alignItems:'center'}}>
        {!going ? <button className="btn primary" onClick={()=>rsvp('going')}>I’m attending</button>
                 : <button className="btn" onClick={()=>rsvp('cancelled')}>Cancel attendance</button>}
        <Link href="/onboarding" style={{marginLeft:8}}>Update my details</Link>
      </div>
    </div>
  );
}
