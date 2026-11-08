import React, { useEffect, useMemo, useState } from 'react';
import { api } from './api.js';

function Login({ onLogin }) {
  const [username, setUsername] = useState('reviewer-a');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setBusy(true); setError('');
    try {
      await api('/api/auth/login', { method: 'POST', body: JSON.stringify({ username, password }) });
      await onLogin();
    } catch (e) { setError(e.message); }
    finally { setBusy(false); }
  }

  return <main className="login-shell">
    <section className="login-card">
      <div className="brand-mark">C</div>
      <p className="eyebrow">SAMPLE COLLEGE · DEMONSTRATION</p>
      <h1>Clearance Staff Portal</h1>
      <p className="muted">Sign in as an office reviewer to view and process your assigned items.</p>
      <form onSubmit={submit} className="form-stack">
        <label>Username<input autoComplete="username" value={username} onChange={e=>setUsername(e.target.value)} required /></label>
        <label>Password<input type="password" autoComplete="current-password" value={password} onChange={e=>setPassword(e.target.value)} required /></label>
        {error && <div className="notice error">{error}</div>}
        <button className="primary" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</button>
      </form>
      <p className="tiny">Demo accounts are created by the local seed command. The generated password is printed once in that terminal.</p>
    </section>
  </main>;
}

function Header({ user, onLogout }) {
  return <header className="topbar">
    <div className="brand"><span className="brand-mark small">C</span><div><b>CDCMS</b><small>Staff Portal</small></div></div>
    <div className="user-area"><span>{user.displayName}</span><button className="quiet" onClick={onLogout}>Sign out</button></div>
  </header>;
}

function ReviewItem({ item, onDecision, busy }) {
  const [remark, setRemark] = useState('');
  const [showReject, setShowReject] = useState(false);
  return <article className="item-card">
    <div className="item-top">
      <div><span className="code">{item.requirement_code}</span><h3>{item.requirement_name}</h3></div>
      <span className={`status ${item.status.toLowerCase()}`}>{item.status}</span>
    </div>
    <div className="item-meta">
      <span><small>Student</small><b>{item.student_name}</b><small>{item.student_number} · {item.program_name}</small></span>
      <span><small>Responsible office</small><b>{item.office_name}</b></span>
      <span><small>Requirement type</small><b>{item.is_mandatory ? 'Mandatory' : 'Optional'}</b></span>
    </div>
    {item.status === 'Pending' && <div className="decision-area">
      {showReject ? <div className="reject-box">
        <label>Remark {item.remark_required_on_reject === 'REQUIRED' ? '(required)' : '(optional)'}
          <textarea rows="2" value={remark} onChange={e=>setRemark(e.target.value)} placeholder="Explain the rejection for the student…" />
        </label>
        <div className="button-row"><button className="danger" disabled={busy} onClick={()=>onDecision(item.record_id,'Rejected',remark)}>Confirm rejection</button><button className="secondary" onClick={()=>setShowReject(false)}>Cancel</button></div>
      </div> : <div className="button-row"><button className="approve" disabled={busy} onClick={()=>onDecision(item.record_id,'Approved')}>Approve</button><button className="secondary" disabled={busy} onClick={()=>setShowReject(true)}>Reject</button></div>}
    </div>}
  </article>;
}

function StaffDashboard({ user }) {
  const [filter, setFilter] = useState('Pending');
  const [items, setItems] = useState([]);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  async function load() {
    setBusy(true); setError('');
    try { const result = await api(`/api/staff/review-items?status=${filter}`); setItems(result.items); }
    catch (e) { setError(e.message); }
    finally { setBusy(false); }
  }
  useEffect(()=>{load();},[filter]);

  async function decide(recordId, decision, remark) {
    setBusy(true); setMessage(''); setError('');
    try {
      await api(`/api/staff/review-items/${recordId}/decision`, {method:'POST',body:JSON.stringify({decision,remark})});
      setMessage(`Requirement ${decision.toLowerCase()} successfully.`);
      await load();
    } catch (e) { setError(e.message); }
    finally { setBusy(false); }
  }

  const pendingCount = useMemo(()=>items.filter(x=>x.status==='Pending').length,[items]);
  return <>
    <Header user={user} onLogout={async()=>{await api('/api/auth/logout',{method:'POST'});window.location.reload();}} />
    <main className="page-wrap">
      <div className="page-heading"><div><p className="eyebrow">OFFICE REVIEW WORKSPACE</p><h1>Review requirements</h1><p className="muted">Only items assigned to your active office assignment are shown.</p></div><div className="counter"><strong>{pendingCount}</strong><span>{filter==='Pending'?'Pending in this view':'Pending shown'}</span></div></div>
      <div className="toolbar"><label className="filter-label">Show<select value={filter} onChange={e=>setFilter(e.target.value)}><option>Pending</option><option>Approved</option><option>Rejected</option><option>All</option></select></label><button className="secondary" onClick={load} disabled={busy}>Refresh</button></div>
      {message && <div className="notice success">{message}</div>}
      {error && <div className="notice error">{error}</div>}
      {busy && <p className="muted">Loading…</p>}
      {!busy && items.length===0 && <div className="empty"><div className="empty-icon">✓</div><h2>No {filter==='All'?'review':filter.toLowerCase()} items</h2><p className="muted">There are no items matching this filter for your office assignment.</p></div>}
      <section className="item-list">{items.map(item=><ReviewItem key={item.record_id} item={item} onDecision={decide} busy={busy} />)}</section>
    </main>
  </>;
}

function StudentDashboard({ user }) {
  const [requests,setRequests] = useState([]);
  const [error,setError] = useState('');
  const [busy,setBusy] = useState(true);
  async function load() {
    setBusy(true);setError('');
    try { const result=await api('/api/student/clearance-requests');setRequests(result.requests); }
    catch(e){setError(e.message);} finally{setBusy(false);}
  }
  useEffect(()=>{load();},[]);
  return <>
    <Header user={user} onLogout={async()=>{await api('/api/auth/logout',{method:'POST'});window.location.reload();}} />
    <main className="page-wrap">
      <div className="page-heading"><div><p className="eyebrow">STUDENT WORKSPACE</p><h1>My clearance</h1><p className="muted">Your assigned requirements and current progress.</p></div><button className="secondary" onClick={load}>Refresh</button></div>
      {error && <div className="notice error">{error}</div>}
      {busy && <p className="muted">Loading your clearance…</p>}
      {!busy && requests.length===0 && <div className="empty"><h2>No clearance request found</h2><p className="muted">Ask your administrator to assign a clearance template.</p></div>}
      <section className="student-requests">{requests.map(request=><article className="request-card" key={request.requestId}>
        <div className="request-heading"><div><span className="eyebrow">{request.academicPeriod}</span><h2>Clearance #{request.requestId}</h2></div><span className={`status ${request.completion.isComplete?'approved':'pending'}`}>{request.completion.displayLabel}</span></div>
        <div className="progress-line"><span style={{width:`${request.completion.mandatoryTotal ? request.completion.mandatoryApproved/request.completion.mandatoryTotal*100 : 0}%`}} /></div>
        <p className="muted small-text">{request.completion.mandatoryApproved} of {request.completion.mandatoryTotal} mandatory requirements approved</p>
        {request.requirements.map(item=><div className="student-item" key={item.recordId}><div><b>{item.requirementName}</b><small>{item.requirementCode}{item.isMandatory?' · Mandatory':' · Optional'}</small>{item.remark && <small className="remark">Reviewer remark: {item.remark}</small>}</div><span className={`status ${item.status.toLowerCase()}`}>{item.status}</span></div>)}
      </article>)}</section>
    </main>
  </>;
}

export default function App() {
  const [user,setUser] = useState(null);
  const [checking,setChecking] = useState(true);
  const [loadError,setLoadError] = useState('');
  async function loadUser() {
    try { const result=await api('/api/me');setUser(result.user);setLoadError(''); }
    catch(e){ if(e.status!==401) setLoadError(e.message); setUser(null); }
    finally{setChecking(false);}
  }
  useEffect(()=>{loadUser();},[]);
  if(checking) return <main className="loading">Connecting to CDCMS…</main>;
  if(!user) return <><Login onLogin={loadUser}/>{loadError&&<div className="floating-error">{loadError}</div>}</>;
  if(user.roles.includes('Administrative Office Personnel')) return <StaffDashboard user={user}/>;
  if(user.roles.includes('Student')) return <StudentDashboard user={user}/>;
  return <><Header user={user} onLogout={async()=>{await api('/api/auth/logout',{method:'POST'});window.location.reload();}}/><main className="page-wrap"><div className="notice">This first slice provides the office reviewer and student workflows. The administrator configuration interface is planned for a later increment.</div></main></>;
}
