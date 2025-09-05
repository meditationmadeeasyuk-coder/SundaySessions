'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';

type Row = { events: { id:string; title:string; starts_at:string }, status: string };

export default function MyPage(){
  const [rows,setRows]=useState<Row[]>([]);
  const [msg,setMsg]=useState<string>('');

  useEffect(()=>{ (async ()=>{
    const { data: { user } } = await supabase.auth.getUser();
    if(!user){ window.location.href='/login'; return; }
    const { data, error } = await supabase.from('registrations')
      .select('status, created_at, events(id,title,starts_at)')
      .order('created_at', { ascending: false });
    if(error) alert(error.message);
    else setRows(data||[]);
  })(); },[]);

  async function deleteMe(){
    if(!confirm('This will remove all your data and sign you out. Continue?')) return;
    const res = await fetch('/api/my/delete', { method: 'POST' });
    if(res.ok){
      setMsg('Your data was deleted. Goodbye.');
      setTimeout(()=> { window.location.href = '/login'; }, 1500);
    } else {
      const t = await res.text();
      alert('Failed: ' + t);
    }
  }

  return (
    <div>
      <h1>My RSVPs</h1>
      {msg && <div style={{background:'#f0fdf4', border:'1px solid #86efac', padding:8, borderRadius:6, marginBottom:8}}>{msg}</div>}
      {rows.map((r,i)=>(
        <div className="card" key={i}>
          <div><strong>{r.events.title}</strong> — {new Date(r.events.starts_at).toLocaleString()}</div>
          <div>Status: {r.status}</div>
          <Link href={`/events/${r.events.id}`}>View</Link>
        </div>
      ))}
      {rows.length===0 && <p>No RSVPs yet.</p>}
      <div className="card">
        <h3>Danger zone</h3>
        <p>Delete my data and sign me out.</p>
        <button className="btn" onClick={deleteMe}>Delete my data</button>
      </div>
    </div>
  );
}
