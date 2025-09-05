'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function AdminEvents(){
  const [title,setTitle]=useState('');
  const [starts,setStarts]=useState('');
  const [ends,setEnds]=useState('');
  const [location,setLocation]=useState('');
  const [details,setDetails]=useState('');
  const [events,setEvents]=useState<any[]>([]);
  const [site,setSite]=useState('');

  useEffect(()=>{ (async ()=>{
    const { data: { user } } = await supabase.auth.getUser();
    if(!user){ window.location.href='/login'; return; }
    const { data: prof } = await supabase.from('profiles').select('role').eq('id', user.id).single();
    if(!prof || prof.role!=='admin'){ alert('Admins only'); window.location.href='/events'; return; }
    const { data } = await supabase.from('events').select('*').order('starts_at',{ascending:false});
    setEvents(data||[]);
    setSite(window.location.origin);
  })(); },[]);

  async function createEvent(e:any){
    e.preventDefault();
    const { error } = await supabase.from('events').insert({
      title, starts_at: starts, ends_at: ends, location, details
    });
    if(error) alert(error.message);
    else { setTitle(''); setStarts(''); setEnds(''); setLocation(''); setDetails(''); location.reload(); }
  }

  return (
    <div>
      <h1>Admin: Events</h1>
      <form onSubmit={createEvent} className="card">
        <label>Title</label><input value={title} onChange={e=>setTitle(e.target.value)} required />
        <label>Starts at</label><input type="datetime-local" value={starts} onChange={e=>setStarts(e.target.value)} required />
        <label>Ends at</label><input type="datetime-local" value={ends} onChange={e=>setEnds(e.target.value)} required />
        <label>Location</label><input value={location} onChange={e=>setLocation(e.target.value)} />
        <label>Details</label><textarea value={details} onChange={e=>setDetails(e.target.value)} />
        <button className="btn primary" style={{marginTop:8}}>Create event</button>
      </form>
      {events.map(e=> (
        <div className="card" key={e.id}>
          <strong>{e.title}</strong> — {new Date(e.starts_at).toLocaleString()}
          <div style={{marginTop:8}}>
            <a className="btn" href={`${site}/api/admin/export?event_id=${e.id}`} target="_blank" rel="noreferrer">Download CSV</a>
          </div>
        </div>
      ))}
    </div>
  );
}
