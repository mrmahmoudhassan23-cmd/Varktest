'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';

type C = { id: string; name: string };

const years = Array.from({ length: 9 }, (_, i) => String(i + 1));
const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export default function TeacherPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState({ display_name: '', title: 'Mr', subject: '' });
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [title, setTitle] = useState('Mr');
  const [subject, setSubject] = useState('');
  const [signup, setSignup] = useState(false);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [classes, setClasses] = useState<C[]>([]);
  const [year, setYear] = useState('7');
  const [letter, setLetter] = useState('A');

  const load = async (id: string) => {
    const { data: c } = await supabase
      .from('classes')
      .select('id,name')
      .eq('teacher_id', id)
      .order('name');
    setClasses(c || []);

    const { data: p } = await supabase
      .from('teacher_profiles')
      .select('display_name,title,subject')
      .eq('id', id)
      .maybeSingle();
    if (p) setProfile(p);
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const currentUser = data.session?.user || null;
      setUser(currentUser);
      if (currentUser) load(currentUser.id);
      setLoading(false);
    });

    const { data: authData } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user || null;
      setUser(currentUser);
      if (currentUser) load(currentUser.id);
    });

    return () => authData.subscription.unsubscribe();
  }, []);

  const auth = async () => {
    setBusy(true);
    setError('');
    setMessage('');

    if (signup) {
      if (!name.trim() || !subject.trim()) {
        setError('Please enter your name and subject.');
        setBusy(false);
        return;
      }

      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
      });

      if (signUpError) {
        setError(signUpError.message);
      } else {
        if (data.user) {
          const { error: profileError } = await supabase.from('teacher_profiles').upsert({
            id: data.user.id,
            email: data.user.email,
            display_name: name.trim(),
            title,
            subject: subject.trim(),
          });
          if (profileError) setError(profileError.message);
        }
        if (!error) {
          setSignup(false);
          setMessage('Account created. Please sign in.');
        }
      }
    } else {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (signInError) setError(signInError.message);
    }

    setBusy(false);
  };

  const addClass = async () => {
    if (!user) return;
    const className = `${year}${letter}`;

    if (classes.some((c) => c.name === className)) {
      setError(`${className} already exists.`);
      return;
    }

    setBusy(true);
    setError('');
    const { data, error: insertError } = await supabase
      .from('classes')
      .insert({ teacher_id: user.id, name: className })
      .select('id,name')
      .single();

    if (insertError) setError(insertError.message);
    else if (data) setClasses((v) => [...v, data].sort((a, b) => a.name.localeCompare(b.name)));

    setBusy(false);
  };

  if (loading) {
    return (
      <main className="shell">
        <section className="card"><p>Loading…</p></section>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="shell">
        <section className="card">
          <div className="brand">
            <span className="badge">EBIS • TEACHER PORTAL</span>
            <h1>VARK Learning Profile</h1>
            <p className="muted">Teacher access only.</p>
          </div>

          {signup && (
            <>
              <div className="field">
                <label>Title</label>
                <select value={title} onChange={(e) => setTitle(e.target.value)}>
                  <option>Mr</option>
                  <option>Miss</option>
                  <option>Mrs</option>
                </select>
              </div>
              <div className="field">
                <label>Full name</label>
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Mahmoud Hassan" />
              </div>
              <div className="field">
                <label>Subject</label>
                <input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Mathematics" />
              </div>
            </>
          )}

          <div className="field">
            <label>School email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="field">
            <label>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>

          <button className="primary" disabled={busy || !email || !password} onClick={auth}>
            {busy ? 'Please wait…' : signup ? 'Create Account' : 'Sign In'}
          </button>
          {error && <div className="error">{error}</div>}
          {message && <div className="success">{message}</div>}
          <button
            className="linkbtn"
            onClick={() => {
              setSignup(!signup);
              setError('');
              setMessage('');
            }}
          >
            {signup ? 'Already have an account? Sign in' : 'New teacher? Create an account'}
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="dashboard">
      <header className="dashhead">
        <div>
          <span className="badge">EBIS • TEACHER PORTAL</span>
          <h1>Welcome, {profile.title} {profile.display_name}</h1>
          <p className="muted">My Dashboard{profile.subject ? <> • {profile.subject}</> : null}</p>
        </div>
        <button className="secondary" onClick={() => supabase.auth.signOut()}>Sign out</button>
      </header>

      <section className="card createclass">
        <h2>Create New Class</h2>
        <div className="addclass">
          <div>
            <span>Year</span>
            <select value={year} onChange={(e) => setYear(e.target.value)}>
              {years.map((y) => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
          <div>
            <span>Class</span>
            <select value={letter} onChange={(e) => setLetter(e.target.value)}>
              {letters.map((l) => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
          <button className="primary small" onClick={addClass} disabled={busy}>Create</button>
        </div>
        {error && <div className="error">{error}</div>}
      </section>

      <section>
        <div className="classes-title">
          <h2>My Classes</h2>
          <span>{classes.length} {classes.length === 1 ? 'class' : 'classes'}</span>
        </div>

        {!classes.length ? (
          <div className="emptyclasses card">
            <div className="emptyicon">＋</div>
            <h3>No classes yet</h3>
            <p className="muted">Choose a Year and Class above to create your first class.</p>
          </div>
        ) : (
          <div className="classcards">
            {classes.map((c) => (
              <button key={c.id} className="classcard" onClick={() => router.push(`/teacher/class/${c.id}`)}>
                <span className="classlabel">Class</span>
                <strong>{c.name}</strong>
                <span className="classopen">Open class →</span>
              </button>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
