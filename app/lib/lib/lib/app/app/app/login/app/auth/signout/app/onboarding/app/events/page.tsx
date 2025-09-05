'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type Event = { id:string; title:string; starts_at:string; ends_at:string; location:string|null; details:string|null };

export default function EventsPage(){
  const [events,setEvents]=useState<Event[]>([]);
  const router = useRouter();
  useEffect(()=>{ (async ()=>{
    const { data: { user } } = await supabase.auth.getUser();
    if(!user){ window.location.href='/login'; return; }
    const { data: prof } = await supabase.from('profiles').select('onboarding_completed').eq('id', user.id).single();
    if(!prof?.onboarding_completed){ router.replace('/onboarding'); return; }
    const { data, error } = await supabase.from('events').select('*').order('starts_at',{ascending:true});
    if(error) alert(error.message);
    else setEvents(data||[]);
  })(); },[router]);
  return (
    <div>
      <h1>Upcoming Events</h1>
      {events.map(e=> (
        <div className="card" key={e.id}>
          <h3><Link href={`/events/${e.id}`}>{e.title}</Link></h3>
          <div>{new Date(e.starts_at).toLocaleString()} — {new Date(e.ends_at).toLocaleTimeString()}</div>
          {e.location && <div>{e.location}</div>}
          {e.details && <p>{e.details}</p>}
        </div>
      ))}
      {events.length===0 && <p>No events yet.</p>}
    </div>
  );
}
