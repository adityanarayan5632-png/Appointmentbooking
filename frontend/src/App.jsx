import { useState, useEffect } from "react";
import axios from "axios";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400;1,500&family=DM+Sans:wght@300;400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body { background: #080b10; }

  .shell {
    min-height: 100vh;
    background: #080b10;
    font-family: 'DM Sans', sans-serif;
    position: relative;
  }

  /* ── ambient glow ── */
  .shell::before {
    content: '';
    position: fixed; top: -20%; left: 50%;
    transform: translateX(-50%);
    width: 800px; height: 400px;
    background: radial-gradient(ellipse, rgba(196,160,100,0.06) 0%, transparent 70%);
    pointer-events: none; z-index: 0;
  }

  /* ════════ TOPBAR ════════ */
  .topbar {
    position: sticky; top: 0; z-index: 100;
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 48px;
    height: 62px;
    background: rgba(8,11,16,0.8);
    backdrop-filter: blur(16px);
    border-bottom: 1px solid rgba(255,255,255,0.05);
  }

  .topbar-brand {
    display: flex; align-items: center; gap: 10px;
  }

  .brand-gem {
    width: 28px; height: 28px;
    border: 1.5px solid rgba(196,160,100,0.4);
    border-radius: 7px;
    display: flex; align-items: center; justify-content: center;
  }

  .brand-gem-inner {
    width: 9px; height: 9px;
    background: #c4a064; border-radius: 2px;
    animation: gemPulse 3s ease-in-out infinite;
  }

  @keyframes gemPulse {
    0%,100% { opacity:1; transform:scale(1); }
    50% { opacity:0.4; transform:scale(0.8); }
  }

  .brand-text {
    font-family: 'Cormorant Garamond', serif;
    font-size: 17px; font-weight: 500;
    color: rgba(240,235,224,0.7);
    letter-spacing: 0.05em;
  }

  .tabs {
    display: flex; gap: 2px;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 100px; padding: 3px;
  }

  .tab {
    padding: 7px 22px;
    border-radius: 100px;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px; font-weight: 400;
    color: rgba(240,235,224,0.35);
    cursor: pointer; border: none;
    background: transparent;
    transition: color 0.2s, background 0.2s;
    letter-spacing: 0.02em;
    display: flex; align-items: center; gap: 7px;
  }

  .tab:hover { color: rgba(240,235,224,0.65); }

  .tab.active {
    background: rgba(196,160,100,0.12);
    color: #c4a064;
    font-weight: 500;
  }

  .tab-dot {
    width: 5px; height: 5px;
    background: #c4a064; border-radius: 50%;
    animation: gemPulse 2s ease-in-out infinite;
    display: none;
  }

  .tab.active .tab-dot { display: block; }

  .topbar-right {
    font-size: 12px; font-weight: 300;
    color: rgba(240,235,224,0.2);
    letter-spacing: 0.03em;
    min-width: 120px; text-align: right;
  }

  /* ════════ PAGE ════════ */
  .page {
    max-width: 640px;
    margin: 0 auto;
    padding: 64px 24px 80px;
    position: relative; z-index: 1;
    animation: pageIn 0.45s cubic-bezier(0.22,1,0.36,1) both;
  }

  @keyframes pageIn {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* ════════ BOOK PAGE ════════ */
  .book-eyebrow {
    font-size: 10px; font-weight: 500;
    letter-spacing: 0.15em; text-transform: uppercase;
    color: #c4a064; margin-bottom: 12px;
  }

  .book-heading {
    font-family: 'Cormorant Garamond', serif;
    font-size: 48px; font-weight: 500;
    color: #f0ebe0; line-height: 1.08;
    margin-bottom: 10px;
  }

  .book-heading em { font-style: italic; color: rgba(240,235,224,0.45); }

  .book-sub {
    font-size: 14px; font-weight: 300;
    color: rgba(240,235,224,0.3);
    line-height: 1.7; margin-bottom: 48px;
  }

  .book-form { display: flex; flex-direction: column; gap: 20px; }

  .field { display: flex; flex-direction: column; gap: 8px; }

  .field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }

  .field-label {
    font-size: 10px; font-weight: 500;
    letter-spacing: 0.12em; text-transform: uppercase;
    color: rgba(240,235,224,0.28);
    display: flex; align-items: center; gap: 8px;
  }

  .field-label::after {
    content: ''; flex: 1;
    height: 1px; background: rgba(255,255,255,0.05);
  }

  .field-input {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 12px;
    padding: 14px 18px;
    font-family: 'DM Sans', sans-serif;
    font-size: 15px; font-weight: 400;
    color: #f0ebe0; outline: none; width: 100%;
    transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
    -webkit-appearance: none; appearance: none;
  }

  .field-input::placeholder { color: rgba(240,235,224,0.13); }

  .field-input:hover {
    border-color: rgba(255,255,255,0.11);
    background: rgba(255,255,255,0.04);
  }

  .field-input:focus {
    border-color: rgba(196,160,100,0.4);
    background: rgba(196,160,100,0.025);
    box-shadow: 0 0 0 3px rgba(196,160,100,0.06);
  }

  .field-input::-webkit-calendar-picker-indicator {
    filter: invert(0.3) sepia(1) saturate(2) hue-rotate(5deg);
    cursor: pointer; opacity: 0.45;
  }

  .btn-book {
    margin-top: 8px; padding: 16px 32px;
    background: linear-gradient(135deg, #c4a064 0%, #9e7a38 100%);
    border: none; border-radius: 14px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px; font-weight: 500;
    color: #160e02; cursor: pointer;
    letter-spacing: 0.05em;
    transition: transform 0.18s, box-shadow 0.18s;
    display: flex; align-items: center; justify-content: center; gap: 8px;
    position: relative; overflow: hidden;
  }

  .btn-book::after {
    content: '';
    position: absolute; inset: 0;
    background: linear-gradient(180deg, rgba(255,255,255,0.13) 0%, transparent 55%);
    pointer-events: none;
  }

  .btn-book:hover { transform: translateY(-2px); box-shadow: 0 12px 36px rgba(196,160,100,0.25); }
  .btn-book:active { transform: translateY(0); box-shadow: none; }
  .btn-book:disabled { opacity: 0.45; cursor: not-allowed; transform: none; box-shadow: none; }

  .spinner {
    width: 15px; height: 15px;
    border: 2px solid rgba(22,14,2,0.3);
    border-top-color: #160e02; border-radius: 50%;
    animation: spin 0.7s linear infinite; flex-shrink: 0;
  }

  @keyframes spin { to { transform: rotate(360deg); } }

  .book-note {
    margin-top: 20px; text-align: center;
    font-size: 11px; font-weight: 300;
    color: rgba(240,235,224,0.13); letter-spacing: 0.04em;
  }

  /* ════════ DASHBOARD PAGE ════════ */
  .dash-header {
    display: flex; align-items: flex-end;
    justify-content: space-between; gap: 16px;
    margin-bottom: 36px;
  }

  .dash-heading {
    font-family: 'Cormorant Garamond', serif;
    font-size: 42px; font-weight: 500;
    color: #f0ebe0; line-height: 1.1;
  }

  .dash-heading em { font-style: italic; color: rgba(240,235,224,0.38); }

  .btn-refresh {
    display: flex; align-items: center; gap: 6px;
    padding: 9px 18px;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 100px;
    font-family: 'DM Sans', sans-serif;
    font-size: 12px; color: rgba(240,235,224,0.35);
    cursor: pointer; transition: all 0.2s;
    flex-shrink: 0; margin-bottom: 6px;
  }

  .btn-refresh:hover { color: #c4a064; border-color: rgba(196,160,100,0.28); background: rgba(196,160,100,0.04); }
  .btn-refresh:disabled { opacity: 0.35; cursor: not-allowed; }

  .r-icon { font-size: 14px; display: inline-block; }
  .r-icon.spin { animation: spin 0.6s linear; }

  /* stats */
  .stats {
    display: grid; grid-template-columns: repeat(3,1fr);
    gap: 12px; margin-bottom: 32px;
  }

  .stat {
    background: rgba(255,255,255,0.025);
    border: 1px solid rgba(255,255,255,0.055);
    border-radius: 16px; padding: 20px 22px;
    transition: border-color 0.2s;
  }

  .stat:hover { border-color: rgba(196,160,100,0.15); }

  .stat-label {
    font-size: 10px; font-weight: 500;
    letter-spacing: 0.1em; text-transform: uppercase;
    color: rgba(240,235,224,0.24); margin-bottom: 8px;
  }

  .stat-num {
    font-family: 'Cormorant Garamond', serif;
    font-size: 34px; font-weight: 500;
    color: #f0ebe0; line-height: 1;
  }

  .stat-num.gold { color: #c4a064; }

  /* table */
  .table-wrap {
    background: rgba(255,255,255,0.018);
    border: 1px solid rgba(255,255,255,0.055);
    border-radius: 18px; overflow: hidden;
  }

  .table-head {
    display: grid;
    grid-template-columns: 2fr 1.4fr 1fr 1fr;
    padding: 12px 22px;
    border-bottom: 1px solid rgba(255,255,255,0.05);
    background: rgba(255,255,255,0.02);
  }

  .th {
    font-size: 10px; font-weight: 500;
    letter-spacing: 0.1em; text-transform: uppercase;
    color: rgba(240,235,224,0.2);
  }

  .table-body { }

  .row {
    display: grid;
    grid-template-columns: 2fr 1.4fr 1fr 1fr;
    align-items: center;
    padding: 15px 22px;
    border-bottom: 1px solid rgba(255,255,255,0.035);
    transition: background 0.15s;
  }

  .row:last-child { border-bottom: none; }
  .row:hover { background: rgba(196,160,100,0.03); }

  .row-name {
    display: flex; align-items: center; gap: 12px;
  }

  .avatar {
    width: 32px; height: 32px; border-radius: 50%;
    background: rgba(196,160,100,0.1);
    border: 1px solid rgba(196,160,100,0.18);
    display: flex; align-items: center; justify-content: center;
    font-size: 11px; font-weight: 500; color: #c4a064;
    flex-shrink: 0;
  }

  .name-text { font-size: 13px; font-weight: 500; color: #f0ebe0; }

  .phone-text { font-size: 13px; color: rgba(240,235,224,0.4); }

  .date-pill {
    display: inline-flex; align-items: center;
    padding: 4px 10px;
    background: rgba(90,120,200,0.08);
    border: 1px solid rgba(90,120,200,0.18);
    border-radius: 100px;
    font-size: 11px; color: rgba(150,180,240,0.7);
  }

  .time-pill {
    display: inline-flex; align-items: center;
    padding: 4px 10px;
    background: rgba(196,160,100,0.07);
    border: 1px solid rgba(196,160,100,0.18);
    border-radius: 100px;
    font-size: 11px; color: rgba(196,160,100,0.7);
  }

  /* skeleton */
  .skel {
    height: 12px; border-radius: 6px;
    background: linear-gradient(90deg,
      rgba(255,255,255,0.035) 25%,
      rgba(255,255,255,0.065) 50%,
      rgba(255,255,255,0.035) 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
  }

  @keyframes shimmer { to { background-position: -200% 0; } }

  .empty {
    padding: 64px 20px; text-align: center;
    color: rgba(240,235,224,0.15);
  }

  .empty-icon { font-size: 28px; margin-bottom: 10px; }
  .empty-text { font-size: 13px; font-weight: 300; }

  /* ── toast ── */
  .toast {
    position: fixed; bottom: 28px; left: 50%;
    transform: translateX(-50%) translateY(64px);
    background: #13191f;
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 12px; padding: 11px 20px;
    display: flex; align-items: center; gap: 10px;
    font-size: 13px; font-family: 'DM Sans', sans-serif;
    color: #f0ebe0; z-index: 9999;
    transition: transform 0.38s cubic-bezier(0.22,1,0.36,1), opacity 0.38s;
    opacity: 0; white-space: nowrap; pointer-events: none;
  }

  .toast.show { transform: translateX(-50%) translateY(0); opacity: 1; }

  .toast-icon {
    width: 20px; height: 20px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 11px; flex-shrink: 0;
  }

  .toast-icon.success { background: rgba(52,199,89,0.13); color: #34c759; }
  .toast-icon.error   { background: rgba(255,69,58,0.13);  color: #ff453a; }
`;

function getInitials(name = "") {
  return name.split(" ").slice(0, 2).map(w => w[0]?.toUpperCase() ?? "").join("");
}

function fmtDate(d) {
  if (!d) return "—";
  return new Date(d + "T00:00:00").toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function fmtTime(t) {
  if (!t) return "—";
  const [h, m] = t.split(":").map(Number);
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`;
}

function Toast({ message, type, visible }) {
  return (
    <div className={`toast ${visible ? "show" : ""}`}>
      <div className={`toast-icon ${type}`}>{type === "success" ? "✓" : "✕"}</div>
      {message}
    </div>
  );
}

export default function App() {
  const [tab, setTab] = useState("book");
  const [formData, setFormData] = useState({ name: "", phone: "", date: "", time: "" });
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [refreshSpin, setRefreshSpin] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: "", type: "success" });

  const showToast = (message, type = "success") => {
    setToast({ visible: true, message, type });
    setTimeout(() => setToast(t => ({ ...t, visible: false })), 3500);
  };

  const fetchAppointments = async (isRefresh = false) => {
    if (isRefresh) setRefreshSpin(true);
    else setFetching(true);
    try {
      const res = await axios.get("http://localhost:5000/appointments");
      setAppointments(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setFetching(false);
      if (isRefresh) setTimeout(() => setRefreshSpin(false), 600);
    }
  };

  useEffect(() => { fetchAppointments(); }, []);

  const handleChange = e =>
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async () => {
    if (!formData.name || !formData.phone || !formData.date || !formData.time) {
      showToast("Please fill in all fields.", "error"); return;
    }
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/appointments", formData);
      console.log(res.data);
      showToast("Appointment booked successfully!");
      setFormData({ name: "", phone: "", date: "", time: "" });
      fetchAppointments();
    } catch (err) {
      console.error(err);
      showToast("Failed to create appointment.", "error");
    } finally {
      setLoading(false);
    }
  };

  const todayStr = new Date().toISOString().slice(0, 10);
  const todayCount = appointments.filter(a => a.date === todayStr).length;
  const upcomingCount = appointments.filter(a => new Date(a.date + "T00:00:00") >= new Date()).length;

  return (
    <>
      <style>{styles}</style>
      <div className="shell">

        {/* ── top nav ── */}
        <div className="topbar">
          <div className="topbar-brand">
            <div className="brand-gem"><div className="brand-gem-inner" /></div>
            <span className="brand-text">MediBook</span>
          </div>

          <div className="tabs">
            <button className={`tab ${tab === "book" ? "active" : ""}`} onClick={() => setTab("book")}>
              <span className="tab-dot" /> Book
            </button>
            <button className={`tab ${tab === "dashboard" ? "active" : ""}`} onClick={() => setTab("dashboard")}>
              <span className="tab-dot" /> Dashboard
            </button>
          </div>

          <div className="topbar-right">
            {appointments.length > 0 && `${appointments.length} appointment${appointments.length !== 1 ? "s" : ""}`}
          </div>
        </div>

        {/* ── BOOK tab ── */}
        {tab === "book" && (
          <div className="page">
            <div className="book-eyebrow">New Appointment</div>
            <h1 className="book-heading">Reserve your<br /><em>slot</em> with us</h1>
            <p className="book-sub">Fill in the details below and your appointment will be confirmed instantly.</p>

            <div className="book-form">
              <div className="field">
                <label className="field-label">Full Name</label>
                <input className="field-input" type="text" name="name"
                  placeholder="e.g. Aryan Sharma" value={formData.name} onChange={handleChange} />
              </div>

              <div className="field">
                <label className="field-label">Phone Number</label>
                <input className="field-input" type="tel" name="phone"
                  placeholder="e.g. +91 98765 43210" value={formData.phone} onChange={handleChange} />
              </div>

              <div className="field-row">
                <div className="field">
                  <label className="field-label">Date</label>
                  <input className="field-input" type="date" name="date"
                    value={formData.date} onChange={handleChange} />
                </div>
                <div className="field">
                  <label className="field-label">Time</label>
                  <input className="field-input" type="time" name="time"
                    value={formData.time} onChange={handleChange} />
                </div>
              </div>

              <button className="btn-book" onClick={handleSubmit} disabled={loading}>
                {loading ? <><div className="spinner" />Processing…</> : <>Confirm Appointment &rarr;</>}
              </button>
            </div>

            <p className="book-note">Your information is kept private and secure.</p>
          </div>
        )}

        {/* ── DASHBOARD tab ── */}
        {tab === "dashboard" && (
          <div className="page">
            <div className="dash-header">
              <div>
                <h2 className="dash-heading">All <em>Appointments</em></h2>
              </div>
              <button className="btn-refresh" onClick={() => fetchAppointments(true)} disabled={fetching || refreshSpin}>
                <span className={`r-icon ${refreshSpin ? "spin" : ""}`}>↻</span>
                {refreshSpin ? "Refreshing" : "Refresh"}
              </button>
            </div>

            <div className="stats">
              <div className="stat">
                <div className="stat-label">Total Booked</div>
                <div className="stat-num gold">{fetching ? "—" : appointments.length}</div>
              </div>
              <div className="stat">
                <div className="stat-label">Today</div>
                <div className="stat-num">{fetching ? "—" : todayCount}</div>
              </div>
              <div className="stat">
                <div className="stat-label">Upcoming</div>
                <div className="stat-num">{fetching ? "—" : upcomingCount}</div>
              </div>
            </div>

            <div className="table-wrap">
              <div className="table-head">
                <div className="th">Patient</div>
                <div className="th">Phone</div>
                <div className="th">Date</div>
                <div className="th">Time</div>
              </div>
              <div className="table-body">
                {fetching ? (
                  [1,2,3,4].map(i => (
                    <div className="row" key={i}>
                      <div><div className="skel" style={{width:"55%"}} /></div>
                      <div><div className="skel" style={{width:"60%"}} /></div>
                      <div><div className="skel" style={{width:"70%"}} /></div>
                      <div><div className="skel" style={{width:"50%"}} /></div>
                    </div>
                  ))
                ) : appointments.length === 0 ? (
                  <div className="empty">
                    <div className="empty-icon">📋</div>
                    <div className="empty-text">No appointments booked yet.</div>
                  </div>
                ) : (
                  appointments.map((a, i) => (
                    <div className="row" key={a._id || a.id || i}>
                      <div className="row-name">
                        <div className="avatar">{getInitials(a.name)}</div>
                        <span className="name-text">{a.name}</span>
                      </div>
                      <div className="phone-text">{a.phone}</div>
                      <div><span className="date-pill">{fmtDate(a.date)}</span></div>
                      <div><span className="time-pill">{fmtTime(a.time)}</span></div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

      </div>

      <Toast message={toast.message} type={toast.type} visible={toast.visible} />
    </>
  );
}