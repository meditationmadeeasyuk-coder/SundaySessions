'use client';
import { supabase } from '@/lib/supabaseClient';
import { useState } from 'react';

export default function LoginPage(){
  const [email,setEmail]=useState('');
  const [sent,setSent]=useState(false);

  async function onSubmit(e: any){
    e.preventDefault();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin }
    });
    if(!error) setSent(true);
    else alert(error.message);
  }
  return (
    <div className="card">
      <h1>Sign in</h1>
      {!sent ? (
        <form onSubmit={onSubmit} className="grid">
          <div>
            <label>Email</label>
            <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required placeholder="you@example.com" />
          </div>
          <button className="btn primary">Send magic link</button>
        </form>
      ) : <p>Check your email for the magic link.</p>}
    </div>
  )
}
