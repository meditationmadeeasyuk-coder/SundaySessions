'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function OnboardingPage(){
  const [loading, setLoading] = useState(true);
  const [email,setEmail] = useState('');
  const [full_name,setFullName] = useState('');
  const [arts_role,setArtsRole] = useState('');
  const [new_to_meditation,setNewTo] = useState<string>('');
  const [goals,setGoals] = useState('');
  const [how_hear,setHowHear] = useState('');
  const [comments,setComments] = useState('');
  const [whatsapp_opt_in,setWhatsApp] = useState<string>('');
  const [phone,setPhone] = useState('');
  const [consent,setConsent] = useState(false);
  const router = useRouter();

  useEffect(()=>{ (async ()=>{
    const { data: { user } } = await supabase.auth.getUser();
    if(!user){ window.location.href='/login'; return; }
    const { data: prof } = await supabase.from('profiles').select('*').eq('id', user.id).single();
    if (prof?.onboarding_completed) { router.replace('/events'); return; }
    setEmail(prof?.email || '');
    setFullName(prof?.full_name || '');
    setLoading(false);
  })(); },[router]);

  async function onSubmit(e:any){
    e.preventDefault();
    const { data: { user } } = await supabase.auth.getUser();
    if(!user) return;
    if(!consent){ alert('Please tick consent to continue.'); return; }
    const payload = {
      full_name, arts_role, new_to_meditation: new_to_meditation === 'yes',
      goals, how_hear, comments, whatsapp_opt_in: whatsapp_opt_in === 'yes',
      phone, consent: true, onboarding_completed: true
    };
    const { error } = await supabase.from('profiles').update(payload).eq('id', user.id);
    if(error){ alert(error.message); return; }
    router.replace('/events');
  }

  if(loading) return <p>Loading…</p>;
  return (
    <div className="card">
      <h1>One-time Registration</h1>
      <p>You'll only do this once. After this, it's just one tap to RSVP each month.</p>
      <form onSubmit={onSubmit} className="grid">
        <div><label>Email *</label><input value={email} disabled /></div>
        <div><label>Full Name *</label><input value={full_name} onChange={e=>setFullName(e.target.value)} required /></div>
        <div><label>In what capacity do you work in the Arts? *</label><input value={arts_role} onChange={e=>setArtsRole(e.target.value)} required /></div>
        <div>
          <label>Are you new to meditation? *</label>
          <select value={new_to_meditation} onChange={e=>setNewTo(e.target.value)} required>
            <option value="" disabled>Choose…</option>
            <option value="yes">Yes</option><option value="no">No</option>
          </select>
        </div>
        <div><label>What would you like to gain from meditation?</label><textarea value={goals} onChange={e=>setGoals(e.target.value)} /></div>
        <div><label>How did you hear about this event? *</label><input value={how_hear} onChange={e=>setHowHear(e.target.value)} required /></div>
        <div><label>Other comments, questions, queries</label><textarea value={comments} onChange={e=>setComments(e.target.value)} /></div>
        <div>
          <label>Would you like to join my WhatsApp group? *</label>
          <select value={whatsapp_opt_in} onChange={e=>setWhatsApp(e.target.value)} required>
            <option value="" disabled>Choose…</option>
            <option value="yes">Yes</option><option value="no">No</option>
          </select>
        </div>
        <div><label>Mobile Number (Put N/A if you'd rather not leave your number) *</label><input value={phone} onChange={e=>setPhone(e.target.value)} required /></div>
        <div style={{display:'flex', gap:8, alignItems:'center'}}>
          <input type="checkbox" checked={consent} onChange={e=>setConsent(e.target.checked)} id="consent" />
          <label htmlFor="consent">I consent to the use of my data for managing my registration and attendance.</label>
        </div>
        <button className="btn primary" style={{marginTop:8}}>Save and continue</button>
      </form>
    </div>
  );
}
