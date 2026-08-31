'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '../../../lib/supabase';
import { questions, keys, labels, Key } from '../../../lib/questions';

type Scores=Record<Key,number>;
const initial:Scores={V:0,A:0,R:0,K:0};

export default function StudentTest(){
 const params=useParams<{token:string}>(); const token=params.token;
 const [session,setSession]=useState<{session_id:string;class_id:string;class_name:string}|null>(null);
 const [loading,setLoading]=useState(true); const [name,setName]=useState(''); const [step,setStep]=useState(0); const [answers,setAnswers]=useState<number[]>([]); const [scores,setScores]=useState<Scores>(initial); const [saving,setSaving]=useState(false); const [done,setDone]=useState(false); const [error,setError]=useState('');
 useEffect(()=>{if(!token)return;(async()=>{const {data,error:e}=await supabase.rpc('get_public_session',{p_token:token});if(e||!data?.length)setError('This QR code is no longer active. Please ask your teacher for a new one.');else setSession(data[0]);setLoading(false)})()},[token]);
 const choose=async(i:number)=>{const key=keys[i];const next={...scores,[key]:scores[key]+1};const nextAnswers=[...answers,i];if(step+1<questions.length){setScores(next);setAnswers(nextAnswers);setStep(step+1);return;}setSaving(true);setError('');const max=Math.max(...keys.map(k=>next[k]));const dominant=keys.filter(k=>next[k]===max);const {error:e}=await supabase.from('vark_responses').insert({session_id:session?.session_id,student_name:name.trim(),class_name:session?.class_name,answers:nextAnswers,visual_score:next.V,aural_score:next.A,read_write_score:next.R,kinesthetic_score:next.K,dominant_preferences:dominant});if(e){setError('We could not save your result. Please ask your teacher for help.');setSaving(false);return;}setScores(next);setAnswers(nextAnswers);setSaving(false);setDone(true)};
 if(loading)return <main className="shell"><section className="card"><p>Loading your test…</p></section></main>;
 if(error)return <main className="shell"><section className="card result"><div className="emoji">⚠️</div><h1>Oops!</h1><p className="muted">{error}</p></section></main>;
 if(done){const max=Math.max(...keys.map(k=>scores[k]));const dominant=keys.filter(k=>scores[k]===max);return <main className="shell"><section className="card result"><div className="emoji">🎉</div><span className="badge">EBIS • Year 7</span><h1>All done, {name}!</h1><p className="muted">Your learning preferences have been recorded.</p><h2>{dominant.map(k=>labels[k]).join(' + ')}</h2><div className="notice">Your result is for your teacher's analysis. It is a preference, not a fixed learning type.</div></section></main>}
 if(step===0)return <main className="shell"><section className="card"><div className="brand"><span className="badge">EBIS • YEAR 7 • {session?.class_name}</span><h1>How Do You Learn?</h1><p className="muted">Answer each question with the option that sounds most like you. There are no right or wrong answers.</p></div><div className="field"><label>Your first name</label><input autoFocus value={name} onChange={e=>setName(e.target.value)} placeholder="Enter your name"/><p className="muted" style={{fontSize:13}}>Only your first name is needed.</p></div><button className="primary" disabled={!name.trim()} onClick={()=>setStep(1)}>Start the challenge →</button></section></main>;
 const q=questions[step-1];return <main className="shell"><section className="card"><div className="top"><b>Question {step} of {questions.length}</b><span className="muted">{Math.round(step/questions.length*100)}%</span></div><div className="progress"><div style={{width:`${step/questions.length*100}%`}}/></div><h1 className="question">{q[0]}</h1>{q[1].map((text,i)=><button className="option" key={text} onClick={()=>choose(i)} disabled={saving}><b>{String.fromCharCode(65+i)}</b>{text}</button>)}{error&&<div className="error">{error}</div>}</section></main>;
}
