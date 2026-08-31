'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '../../../lib/supabase';
import { questions, keys, labels, Key } from '../../../lib/questions';

type Scores = Record<Key, number>;
const initial: Scores = { V: 0, A: 0, R: 0, K: 0 };

export default function StudentTest() {
  const params = useParams<{ token: string }>();
  const token = params.token;
  const [session, setSession] = useState<{ session_id: string; class_id: string; class_name: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [listNumber, setListNumber] = useState('');
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [scores, setScores] = useState<Scores>(initial);
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) return;
    (async () => {
      const { data, error: e } = await supabase.rpc('get_public_session', { p_token: token });
      if (e || !data?.length) setError('This QR code is no longer active. Please ask your teacher for a new one.');
      else setSession(data[0]);
      setLoading(false);
    })();
  }, [token]);

  const choose = async (i: number) => {
    const key = keys[i];
    const next = { ...scores, [key]: scores[key] + 1 };
    const nextAnswers = [...answers, i];
    if (step + 1 < questions.length) {
      setScores(next);
      setAnswers(nextAnswers);
      setStep(step + 1);
      return;
    }
    setSaving(true);
    setError('');
    const max = Math.max(...keys.map((k) => next[k]));
    const dominant = keys.filter((k) => next[k] === max);
    const { error: e } = await supabase.from('vark_responses').insert({
      session_id: session?.session_id,
      student_name: name.trim(),
      student_list_number: listNumber.trim(),
      class_name: session?.class_name,
      answers: nextAnswers,
      visual_score: next.V,
      aural_score: next.A,
      read_write_score: next.R,
      kinesthetic_score: next.K,
      dominant_preferences: dominant,
    });
    if (e) {
      setError('We could not save your result. Please ask your teacher for help.');
      setSaving(false);
      return;
    }
    setScores(next);
    setAnswers(nextAnswers);
    setSaving(false);
    setDone(true);
  };

  if (loading) return <main className="student-page"><section className="student-card student-loading"><div className="student-orbit">✦</div><p>Loading your challenge…</p></section></main>;
  if (error) return <main className="student-page"><section className="student-card student-result"><div className="student-bigemoji">⚠️</div><span className="student-badge">VARK • STUDENT CHALLENGE</span><h1>Oops!</h1><p>{error}</p></section></main>;

  if (done) {
    const max = Math.max(...keys.map((k) => scores[k]));
    const dominant = keys.filter((k) => scores[k] === max);
    return <main className="student-page"><section className="student-card student-result"><div className="confetti" aria-hidden="true"><span>✦</span><span>★</span><span>✦</span><span>◆</span></div><div className="student-bigemoji">🎉</div><span className="student-badge">EBIS • VARK CHALLENGE</span><h1>Great job, {name}!</h1><p>Your learning preferences have been recorded.</p><div className="result-pill">{dominant.map((k) => labels[k]).join(' + ')}</div><div className="student-note">Your result helps your teacher understand how you prefer to learn. It is a preference, not a fixed learning type.</div></section></main>;
  }

  if (step === 0) return <main className="student-page"><div className="doodle doodle-one">✦</div><div className="doodle doodle-two">●</div><div className="doodle doodle-three">◆</div><section className="student-card student-start"><div className="student-logo"><span>V</span></div><span className="student-badge">EBIS • {session?.class_name} • VARK</span><h1>Ready for the<br /><em>VARK Challenge?</em></h1><p className="student-subtitle">Let’s discover how you like to learn! There are no right or wrong answers.</p><div className="student-form"><label htmlFor="student-name">Your full name</label><input id="student-name" autoFocus value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Ahmed Mohamed Hassan" /><label htmlFor="list-number">Your list number</label><input id="list-number" inputMode="numeric" value={listNumber} onChange={(e) => setListNumber(e.target.value.replace(/\D/g, ''))} placeholder="e.g. 12" /><button className="student-start-btn" disabled={!name.trim() || !listNumber.trim()} onClick={() => setStep(1)}>Let’s Go! <span>→</span></button></div><div className="student-tip"><span>💡</span> Pick the answer that sounds most like you.</div></section></main>;

  const q = questions[step - 1];
  const progress = (step / questions.length) * 100;
  const optionLetters = ['A', 'B', 'C', 'D'];
  const optionClasses = ['choice-v', 'choice-a', 'choice-r', 'choice-k'];

  return <main className="student-page"><div className="doodle doodle-one">✦</div><div className="doodle doodle-two">●</div><div className="doodle doodle-three">◆</div><section className="student-card student-question-card"><div className="question-top"><span>VARK CHALLENGE</span><strong>{step} <small>/ {questions.length}</small></strong></div><div className="student-progress"><div style={{ width: `${progress}%` }} /></div><div className="question-number">QUESTION {step}</div><h1 className="student-question">{q[0]}</h1><div className="choices-grid">{q[1].map((text, i) => <button className={`student-choice ${optionClasses[i]}`} key={text} onClick={() => choose(i)} disabled={saving}><span className="choice-letter">{optionLetters[i]}</span><span className="choice-text">{text}</span></button>)}</div><div className="student-footer"><span>Choose one answer</span><span>{Math.round(progress)}% complete</span></div>{error && <div className="error">{error}</div>}</section></main>;
}
