'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '../../../lib/supabase';
import { questions, keys, labels, Key } from '../../../lib/questions';

type Scores = Record<Key, number>;
const initial: Scores = { V: 0, A: 0, R: 0, K: 0 };

function StudentStyles() {
  return <style jsx global>{`
    .student-page{min-height:100vh;position:relative;overflow:hidden;display:flex;align-items:center;justify-content:center;padding:24px;background:radial-gradient(circle at 12% 18%,rgba(255,221,87,.48),transparent 25%),radial-gradient(circle at 88% 82%,rgba(103,232,249,.4),transparent 28%),linear-gradient(135deg,#f5f3ff 0%,#e9f8ff 48%,#fff6e8 100%);font-family:Arial,Helvetica,sans-serif;color:#252653}
    .student-page:before,.student-page:after{content:"";position:absolute;border-radius:50%;pointer-events:none}.student-page:before{width:300px;height:300px;top:-120px;right:-80px;background:rgba(255,124,178,.2)}.student-page:after{width:240px;height:240px;bottom:-110px;left:-60px;background:rgba(125,112,255,.18)}
    .doodle{position:absolute;font-weight:900;pointer-events:none;z-index:0}.doodle-one{top:10%;left:8%;font-size:42px;transform:rotate(-15deg);color:#7c6cff}.doodle-two{top:24%;right:8%;font-size:34px;color:#ff9f43}.doodle-three{bottom:12%;right:12%;font-size:38px;transform:rotate(18deg);color:#27b3a2}
    .student-card{position:relative;z-index:1;width:min(760px,100%);background:rgba(255,255,255,.97);border:3px solid rgba(255,255,255,.92);border-radius:34px;padding:36px;box-shadow:0 22px 70px rgba(48,42,100,.18);backdrop-filter:blur(8px)}
    .student-start{text-align:center;max-width:680px}.student-logo{width:70px;height:70px;margin:0 auto 14px;border-radius:22px;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#6c63ff,#45c7e8);color:#fff;font-size:42px;font-weight:900;box-shadow:0 10px 25px rgba(86,88,220,.3);transform:rotate(-4deg)}
    .student-badge{display:inline-block;padding:8px 14px;border-radius:999px;background:#f0edff;color:#5147c7;font-size:12px;font-weight:800;letter-spacing:.06em}.student-start h1{font-size:42px;line-height:1.08;margin:18px 0 10px}.student-start h1 em{font-style:normal;background:linear-gradient(90deg,#6c63ff,#13a9bd);-webkit-background-clip:text;background-clip:text;color:transparent}.student-subtitle{max-width:540px;margin:0 auto 26px;color:#667085;font-size:17px;line-height:1.55}
    .student-form{text-align:left;max-width:500px;margin:auto}.student-form label{display:block;font-weight:800;color:#33345e;margin:15px 0 8px}.student-form input{width:100%;padding:16px 18px;border:2px solid #e2e4f1;border-radius:16px;background:#fbfbff;outline:none;transition:.15s}.student-form input:focus{border-color:#766cff;box-shadow:0 0 0 4px rgba(118,108,255,.12)}.student-start-btn{width:100%;margin-top:22px;padding:17px 22px;border:0;border-radius:17px;background:linear-gradient(90deg,#665bea,#26b6c7);color:#fff;font-weight:900;font-size:18px;cursor:pointer;box-shadow:0 12px 24px rgba(86,91,220,.24);transition:.15s}.student-start-btn:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 16px 30px rgba(86,91,220,.3)}.student-start-btn:disabled{opacity:.45;cursor:not-allowed}.student-tip{margin-top:18px;padding:12px 15px;border-radius:14px;background:#fff7db;color:#67551d;font-size:13px;font-weight:700}
    .student-question-card{max-width:900px}.question-top{display:flex;justify-content:space-between;align-items:center;color:#5b57a6;font-size:13px;font-weight:900;letter-spacing:.08em}.question-top strong{font-size:20px;color:#24235a;letter-spacing:0}.question-top small{font-size:13px;color:#8b8ea5}.student-progress{height:10px;background:#ececf5;border-radius:99px;overflow:hidden;margin:14px 0 28px}.student-progress div{height:100%;border-radius:inherit;background:linear-gradient(90deg,#7064ef,#24bfd0);transition:width .25s ease}.question-number{display:inline-block;padding:7px 12px;border-radius:10px;background:#fff0a8;color:#6a5712;font-size:11px;font-weight:900;letter-spacing:.1em}.student-question{font-size:31px;line-height:1.2;color:#252653;margin:16px 0 26px;max-width:800px}.choices-grid{display:grid;grid-template-columns:1fr 1fr;gap:18px}.student-choice{min-height:150px;border:3px solid transparent;border-radius:24px;padding:20px;text-align:left;cursor:pointer;display:flex;align-items:flex-start;gap:16px;transition:transform .15s,box-shadow .15s,filter .15s;background:#fff}.student-choice:hover:not(:disabled){transform:translateY(-4px);box-shadow:0 14px 28px rgba(40,40,80,.14);filter:saturate(1.06)}.student-choice:active:not(:disabled){transform:scale(.98)}.student-choice:disabled{cursor:wait;opacity:.7}.choice-v{background:linear-gradient(135deg,#fff0a8,#ffe3d1);border-color:#ffd46b}.choice-a{background:linear-gradient(135deg,#dff7ff,#dfeaff);border-color:#81d9ed}.choice-r{background:linear-gradient(135deg,#eee8ff,#f8e1ff);border-color:#bca8ff}.choice-k{background:linear-gradient(135deg,#def8e9,#e4f4c7);border-color:#8bd7aa}.choice-letter{flex:0 0 48px;width:48px;height:48px;border-radius:15px;display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:900;color:#fff;box-shadow:0 5px 12px rgba(30,30,60,.16)}.choice-v .choice-letter{background:#f2a900}.choice-a .choice-letter{background:#1a9bb5}.choice-r .choice-letter{background:#7859d6}.choice-k .choice-letter{background:#299d65}.choice-text{font-size:16px;line-height:1.45;font-weight:700;color:#292b4f;padding-top:4px}.student-footer{display:flex;justify-content:space-between;gap:12px;margin-top:20px;color:#7b7e94;font-size:12px;font-weight:700}
    .student-result{text-align:center;max-width:620px}.student-bigemoji{font-size:64px;line-height:1;margin-bottom:16px}.student-result h1{font-size:38px;color:#252653;margin:16px 0 8px}.student-result p{color:#667085;font-size:17px}.result-pill{display:inline-block;margin:16px 0;padding:12px 20px;border-radius:999px;background:linear-gradient(90deg,#e8e3ff,#dff8ff);color:#40369d;font-weight:900}.student-note{padding:15px;border-radius:15px;background:#f7f7fc;color:#666b82;font-size:13px;line-height:1.5}.confetti{display:flex;justify-content:space-around;color:#6c63ff;font-size:24px;margin-bottom:4px}.student-loading{text-align:center}.student-orbit{font-size:48px;color:#6c63ff;animation:studentSpin 1.4s linear infinite}@keyframes studentSpin{to{transform:rotate(360deg)}}
    @media(max-width:700px){.student-page{padding:12px;align-items:flex-start}.student-card{padding:24px 16px;margin:10px 0;border-radius:25px}.student-start h1{font-size:31px}.student-subtitle{font-size:15px}.student-question{font-size:24px}.choices-grid{grid-template-columns:1fr;gap:12px}.student-choice{min-height:105px;padding:16px}.choice-text{font-size:15px}.choice-letter{width:44px;height:44px;flex-basis:44px}.student-footer{font-size:11px}.doodle-one{left:2%;top:6%;font-size:28px}.doodle-two{right:2%;top:20%;font-size:25px}.doodle-three{right:4%;bottom:7%;font-size:28px}}
  `}</style>;
}

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
      setScores(next); setAnswers(nextAnswers); setStep(step + 1); return;
    }
    setSaving(true); setError('');
    const max = Math.max(...keys.map((k) => next[k]));
    const dominant = keys.filter((k) => next[k] === max);
    const { error: e } = await supabase.from('vark_responses').insert({ session_id: session?.session_id, student_name: name.trim(), student_list_number: listNumber.trim(), class_name: session?.class_name, answers: nextAnswers, visual_score: next.V, aural_score: next.A, read_write_score: next.R, kinesthetic_score: next.K, dominant_preferences: dominant });
    if (e) { setError('We could not save your result. Please ask your teacher for help.'); setSaving(false); return; }
    setScores(next); setAnswers(nextAnswers); setSaving(false); setDone(true);
  };

  if (loading) return <main className="student-page"><StudentStyles/><section className="student-card student-loading"><div className="student-orbit">✦</div><p>Loading your challenge…</p></section></main>;
  if (error) return <main className="student-page"><StudentStyles/><section className="student-card student-result"><div className="student-bigemoji">⚠️</div><span className="student-badge">VARK • STUDENT CHALLENGE</span><h1>Oops!</h1><p>{error}</p></section></main>;

  if (done) {
    const max = Math.max(...keys.map((k) => scores[k]));
    const dominant = keys.filter((k) => scores[k] === max);
    return <main className="student-page"><StudentStyles/><section className="student-card student-result"><div className="confetti" aria-hidden="true"><span>✦</span><span>★</span><span>✦</span><span>◆</span></div><div className="student-bigemoji">🎉</div><span className="student-badge">EBIS • VARK CHALLENGE</span><h1>Great job, {name}!</h1><p>Your learning preferences have been recorded.</p><div className="result-pill">{dominant.map((k) => labels[k]).join(' + ')}</div><div className="student-note">Your result helps your teacher understand how you prefer to learn. It is a preference, not a fixed learning type.</div></section></main>;
  }

  if (step === 0) return <main className="student-page"><StudentStyles/><div className="doodle doodle-one">✦</div><div className="doodle doodle-two">●</div><div className="doodle doodle-three">◆</div><section className="student-card student-start"><div className="student-logo"><span>V</span></div><span className="student-badge">EBIS • {session?.class_name} • VARK</span><h1>Ready for the<br /><em>VARK Challenge?</em></h1><p className="student-subtitle">Let’s discover how you like to learn! There are no right or wrong answers.</p><div className="student-form"><label htmlFor="student-name">Your full name</label><input id="student-name" autoFocus value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Ahmed Mohamed Hassan" /><label htmlFor="list-number">Your list number</label><input id="list-number" inputMode="numeric" value={listNumber} onChange={(e) => setListNumber(e.target.value.replace(/\D/g, ''))} placeholder="e.g. 12" /><button className="student-start-btn" disabled={!name.trim() || !listNumber.trim()} onClick={() => setStep(1)}>Let’s Go! <span>→</span></button></div><div className="student-tip">💡 Pick the answer that sounds most like you.</div></section></main>;

  const q = questions[step - 1];
  const progress = (step / questions.length) * 100;
  const optionLetters = ['A', 'B', 'C', 'D'];
  const optionClasses = ['choice-v', 'choice-a', 'choice-r', 'choice-k'];
  return <main className="student-page"><StudentStyles/><div className="doodle doodle-one">✦</div><div className="doodle doodle-two">●</div><div className="doodle doodle-three">◆</div><section className="student-card student-question-card"><div className="question-top"><span>VARK CHALLENGE</span><strong>{step} <small>/ {questions.length}</small></strong></div><div className="student-progress"><div style={{ width: `${progress}%` }} /></div><div className="question-number">QUESTION {step}</div><h1 className="student-question">{q[0]}</h1><div className="choices-grid">{q[1].map((text, i) => <button className={`student-choice ${optionClasses[i]}`} key={text} onClick={() => choose(i)} disabled={saving}><span className="choice-letter">{optionLetters[i]}</span><span className="choice-text">{text}</span></button>)}</div><div className="student-footer"><span>Choose one answer</span><span>{Math.round(progress)}% complete</span></div>{error && <div className="error">{error}</div>}</section></main>;
}
