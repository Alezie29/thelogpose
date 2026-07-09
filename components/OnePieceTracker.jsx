"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { BarChart, Bar, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { PixelAvatar } from "./PixelCrew";

// Each character has a hand-picked palette: bg is a deep tinted dark, ink is the display colour,
// muted is for secondary text, and panel is the card surface tint.
const CREW = [
  { name: "Chopper",  title: "Doctor",        quote: "I'm not happy you called me cute!",
    bg: "#0e0614", ink: "#E8A0C8", muted: "#8a6070", panel: "#1a0d1f", border: "#3d1f33" },
  { name: "Nami",     title: "Navigator",     quote: "Leave the navigation to me.",
    bg: "#120a00", ink: "#F0A04B", muted: "#7a5530", panel: "#1c1000", border: "#3d2800" },
  { name: "Usopp",   title: "Sniper",        quote: "I am the great Captain Usopp!",
    bg: "#0a0518", ink: "#9B6FE8", muted: "#5a3f80", panel: "#120a22", border: "#2d1a55" },
  { name: "Robin",   title: "Archaeologist", quote: "I want to live!",
    bg: "#020b14", ink: "#5B9EC9", muted: "#2f5570", panel: "#051420", border: "#0f3050" },
  { name: "Franky",  title: "Shipwright",    quote: "SUPER!",
    bg: "#000e1a", ink: "#0EA5E9", muted: "#2a5570", panel: "#001828", border: "#003d5c" },
  { name: "Brook",   title: "Musician",      quote: "Yohohoho!",
    bg: "#001414", ink: "#7DD8D8", muted: "#2a6060", panel: "#001e1e", border: "#0a4040" },
  { name: "Jinbe",   title: "Helmsman",      quote: "A crew that faces any hardship together will never fall.",
    bg: "#000814", ink: "#3B90C0", muted: "#1a4060", panel: "#001020", border: "#0a3050" },
  { name: "Sanji",   title: "Cook",          quote: "A real cook never wastes food.",
    bg: "#120c00", ink: "#F5B800", muted: "#7a6000", panel: "#1c1400", border: "#4a3500" },
  { name: "Zoro",    title: "Swordsman",     quote: "Nothing happened.",
    bg: "#011408", ink: "#22C55E", muted: "#1a6030", panel: "#041c0c", border: "#0d4020" },
  { name: "Luffy",   title: "Captain",       quote: "I'm gonna be King of the Pirates!",
    bg: "#140004", ink: "#EF4444", muted: "#7a1a1a", panel: "#1e0508", border: "#4a0f10" },
];

const DEFAULT_GOAL = 10;
const MIN_GOAL = 1;
const MAX_GOAL = 30;
// One Piece episode count as of mid-2026; editable in the Voyage card.
const TOTAL_EPISODES = 1168;
const STORAGE_KEY = "op_tracker_v4";
const WINDOWS = [7, 14, 30];

const MONO = "var(--font-mono), 'SF Mono', ui-monospace, monospace";
const SERIF = "var(--font-serif), Georgia, serif";
const INK_HI = "#e8e6e1";

function getToday() { return new Date().toISOString().split("T")[0]; }

function fmtDate(d) {
  const dt = new Date(d + "T12:00:00");
  return dt.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" });
}
function fmtShort(d) {
  const dt = new Date(d + "T12:00:00");
  return dt.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

function loadState() {
  try { const r = localStorage.getItem(STORAGE_KEY); return r ? JSON.parse(r) : null; } catch { return null; }
}

function getChar(count) {
  if (count <= 0) return CREW[0];
  return CREW[Math.min(count, CREW.length) - 1];
}

function buildChartData(history, w, goal) {
  const days = [];
  for (let i = w - 1; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate() - i);
    const key = d.toISOString().split("T")[0];
    const entry = history.find(h => h.date === key);
    days.push({ label: fmtShort(key), eps: entry ? entry.count : 0, hit: entry ? entry.count >= goal : false });
  }
  return days;
}

// Micro-typography helpers: every label in the app goes through these two styles.
const label = (c, size = 10) => ({
  fontFamily: MONO, fontSize: size, letterSpacing: 3, color: c,
  textTransform: "uppercase", transition: "color 0.4s",
});
const bigNum = (c, size = 38) => ({
  fontFamily: MONO, fontSize: size, fontWeight: 700, color: c,
  lineHeight: 1, letterSpacing: -1, transition: "color 0.4s", fontVariantNumeric: "tabular-nums",
});

export default function OnePieceTracker() {
  const [state, setState] = useState(() => {
    const s = loadState(); const today = getToday();
    if (s && s.date === today) return { goal: DEFAULT_GOAL, currentEp: null, totalEps: TOTAL_EPISODES, ...s };
    const yd = new Date(); yd.setDate(yd.getDate() - 1);
    const carried = s && s.date === yd.toISOString().split("T")[0] && s.todayCount >= (s.goal || DEFAULT_GOAL);
    return {
      date: today, todayCount: 0, streak: carried ? (s?.streak || 0) : 0,
      totalWatched: s?.totalWatched || 0, history: s?.history || [], goal: s?.goal || DEFAULT_GOAL,
      currentEp: s?.currentEp ?? null, totalEps: s?.totalEps ?? TOTAL_EPISODES,
    };
  });

  const [animating, setAnimating] = useState(false);
  const [popAnim, setPopAnim] = useState(false);
  const [charTransition, setCharTransition] = useState(false);
  const [aiMsg, setAiMsg] = useState("");
  const [loadingAI, setLoadingAI] = useState(false);
  const [toast, setToast] = useState("");
  const [flash, setFlash] = useState(false);
  const [chartWindow, setChartWindow] = useState(7);
  const [showChart, setShowChart] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const [showGoalEdit, setShowGoalEdit] = useState(false);
  const [showVoyageEdit, setShowVoyageEdit] = useState(false);
  const [epDraft, setEpDraft] = useState("");
  const [totalDraft, setTotalDraft] = useState("");
  const [mounted, setMounted] = useState(false);
  const [pipAnims, setPipAnims] = useState({});
  const prevCount = useRef(0);

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => { if (mounted) localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }, [state, mounted]);

  const char = getChar(state.todayCount);
  const goal = state.goal || DEFAULT_GOAL;
  const goalReached = state.todayCount >= goal;
  const prog = Math.min(state.todayCount / goal, 1);
  const chartData = buildChartData(state.history, chartWindow, goal);
  const voyagePct = state.currentEp != null && state.totalEps > 0
    ? Math.min((state.currentEp / state.totalEps) * 100, 100)
    : null;

  const fetchAI = useCallback(async (count, c, g) => {
    setLoadingAI(true); setAiMsg("");
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6", max_tokens: 80,
          messages: [{ role: "user", content: `You are ${c.name} from One Piece. The fan just watched episode ${count} today (daily goal: ${g}). Give a short in-character reaction (1-2 sentences). Stay true to ${c.name}'s personality. No hashtags, asterisks, or emojis.` }]
        })
      });
      const d = await res.json();
      setAiMsg(d?.content?.find(b => b.type === "text")?.text || c.quote);
    } catch { setAiMsg(c.quote); }
    setLoadingAI(false);
  }, []);

  const logEp = () => {
    if (animating) return;
    setConfirmReset(false);
    setAnimating(true);
    setPopAnim(false);

    const n = state.todayCount + 1;
    const hitGoal = n === goal;
    const today = getToday();
    const nextChar = getChar(n);
    const curChar = getChar(state.todayCount);

    // Trigger pip animation for newly unlocked pip
    setPipAnims(p => ({ ...p, [n - 1]: true }));
    setTimeout(() => setPipAnims(p => ({ ...p, [n - 1]: false })), 600);

    // Character change transition
    if (nextChar.name !== curChar.name) {
      setCharTransition(true);
      setTimeout(() => setCharTransition(false), 400);
    }

    // Avatar pop
    setTimeout(() => setPopAnim(true), 50);
    setTimeout(() => setPopAnim(false), 500);

    setState(s => {
      const existing = s.history.find(h => h.date === today);
      const newHistory = existing
        ? s.history.map(h => h.date === today ? { ...h, count: n } : h)
        : [...s.history, { date: today, count: n }];
      return {
        ...s, todayCount: n, totalWatched: s.totalWatched + 1,
        streak: hitGoal ? s.streak + 1 : s.streak, history: newHistory.slice(-60),
        // Logging an episode advances your place in the voyage, if it's set
        currentEp: s.currentEp != null ? Math.min(s.currentEp + 1, s.totalEps) : null,
      };
    });

    if (hitGoal) { setFlash(true); setTimeout(() => setFlash(false), 900); }
    prevCount.current = n;
    fetchAI(n, nextChar, goal);
    setTimeout(() => setAnimating(false), 300);
  };

  const changeGoal = (delta) => {
    setState(s => ({ ...s, goal: Math.min(MAX_GOAL, Math.max(MIN_GOAL, (s.goal || DEFAULT_GOAL) + delta)) }));
  };

  const openVoyageEdit = () => {
    setEpDraft(state.currentEp != null ? String(state.currentEp) : "");
    setTotalDraft(String(state.totalEps));
    setShowVoyageEdit(true);
  };

  const saveVoyage = () => {
    const ep = parseInt(epDraft, 10);
    const total = parseInt(totalDraft, 10);
    setState(s => {
      const newTotal = Number.isFinite(total) && total > 0 ? total : s.totalEps;
      const newEp = Number.isFinite(ep) ? Math.max(0, Math.min(ep, newTotal)) : s.currentEp;
      return { ...s, currentEp: newEp, totalEps: newTotal };
    });
    setShowVoyageEdit(false);
  };

  const doReset = () => {
    setState(s => ({ ...s, todayCount: 0 }));
    setAiMsg("");
    setConfirmReset(false);
    setPipAnims({});
  };

  const share = async () => {
    const lines = [
      `THE LOG POSE — ${mounted ? fmtDate(state.date) : ""}`,
      `Today: ${state.todayCount}/${goal} · Streak: ${state.streak} days`,
    ];
    if (state.currentEp != null) lines.push(`Voyage: ep ${state.currentEp}/${state.totalEps} (${voyagePct.toFixed(1)}%)`);
    lines.push(`Total logged: ${state.totalWatched}`);
    const t = lines.join("\n");
    try { await navigator.share({ text: t }); }
    catch { try { await navigator.clipboard.writeText(t); setToast("Copied to clipboard"); setTimeout(() => setToast(""), 2000); } catch {} }
  };

  const CustomTooltip = ({ active, payload, label: tipLabel }) => {
    if (!active || !payload?.length) return null;
    const eps = payload[0]?.value;
    return (
      <div style={{ background: char.panel, border: `1px solid ${char.border}`, borderRadius: 8, padding: "8px 12px", fontFamily: MONO, fontSize: 11 }}>
        <div style={{ color: char.muted, marginBottom: 2 }}>{tipLabel}</div>
        <div style={{ color: INK_HI, fontWeight: 700 }}>{eps} ep{eps !== 1 ? "s" : ""}</div>
        {eps >= goal && <div style={{ color: char.muted, fontSize: 10, marginTop: 2 }}>goal hit ✓</div>}
      </div>
    );
  };

  if (!mounted) return <div style={{ minHeight: "100vh", background: "#0a0a0a" }} />;

  const inputStyle = {
    fontFamily: MONO, fontSize: 13, color: INK_HI, background: "transparent",
    border: `1px solid ${char.border}`, borderRadius: 6, padding: "7px 10px",
    width: 72, outline: "none", fontVariantNumeric: "tabular-nums",
  };

  return (
    <div style={{ minHeight: "100vh", background: char.bg, color: INK_HI, fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif", transition: "background 0.5s ease", position: "relative", overflowX: "hidden" }}>

      {/* Subtle corner vignette — no center glow */}
      <div style={{ position: "fixed", inset: 0, background: `radial-gradient(ellipse at top left, ${char.ink}0a 0%, transparent 60%), radial-gradient(ellipse at bottom right, ${char.ink}08 0%, transparent 55%)`, pointerEvents: "none", transition: "background 0.5s", zIndex: 0 }} />

      {/* Goal flash */}
      {flash && <div style={{ position: "fixed", inset: 0, zIndex: 200, pointerEvents: "none", background: char.ink + "14", animation: "flashOut 0.9s ease forwards" }} />}

      <div style={{ maxWidth: 420, margin: "0 auto", padding: "36px 20px 80px", position: "relative", zIndex: 1 }}>

        {/* ── HEADER ── */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 32 }}>
          <div>
            <div style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 26, color: INK_HI, lineHeight: 1, marginBottom: 8 }}>The Log Pose</div>
            <div style={label(char.muted, 9)}>{mounted ? fmtDate(state.date) : ""}</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ ...label(char.muted, 9), marginBottom: 6 }}>Streak</div>
            <div style={bigNum(char.ink)}>
              {state.streak}
              <span style={{ fontSize: 11, fontWeight: 400, color: char.muted, marginLeft: 5, letterSpacing: 0 }}>days</span>
            </div>
          </div>
        </div>

        {/* ── CHARACTER CARD ── */}
        <div style={{
          background: char.panel,
          border: `1px solid ${char.border}`,
          borderRadius: 10,
          padding: "32px 24px 28px",
          marginBottom: 12,
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
          opacity: charTransition ? 0 : 1,
          transform: charTransition ? "translateX(8px)" : "translateX(0)",
          transitionProperty: "background, border-color, opacity, transform",
          transitionDuration: "0.4s",
        }}>
          {/* Large watermark initial behind the portrait */}
          <div style={{
            position: "absolute", top: "50%", left: "50%",
            transform: "translate(-50%, -54%)",
            fontFamily: SERIF, fontStyle: "italic",
            fontSize: 240, color: char.ink,
            opacity: 0.05, lineHeight: 1, pointerEvents: "none",
            userSelect: "none",
            transition: "color 0.4s, opacity 0.4s",
          }}>
            {char.name[0]}
          </div>

          {/* Thin accent line top */}
          <div style={{ position: "absolute", top: 0, left: "20%", right: "20%", height: 2, background: `linear-gradient(90deg, transparent, ${char.ink}88, transparent)`, transition: "background 0.4s" }} />

          {/* Pixel portrait */}
          <div style={{
            display: "inline-block", position: "relative", zIndex: 1, marginBottom: 18,
            transform: popAnim ? "scale(1.18) rotate(-4deg)" : goalReached ? "scale(1.04)" : "scale(1)",
            transition: popAnim ? "transform 0.15s cubic-bezier(0.34,1.8,0.64,1)" : "transform 0.3s ease",
            filter: goalReached ? `drop-shadow(0 0 14px ${char.ink}66)` : "none",
          }}>
            <PixelAvatar name={char.name} size={104} />
          </div>

          <div style={{ ...label(char.muted), marginBottom: 8 }}>{char.title}</div>
          <div style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 36, color: char.ink, marginBottom: 16, lineHeight: 1, transition: "color 0.4s" }}>{char.name}</div>

          {/* AI quote */}
          <div style={{ minHeight: 44, fontFamily: SERIF, fontSize: 15, color: char.muted, fontStyle: "italic", lineHeight: 1.6, padding: "0 8px", transition: "color 0.4s", position: "relative", zIndex: 1 }}>
            {loadingAI
              ? <span style={{ letterSpacing: 8, opacity: 0.4, animation: "pulse 1.2s ease infinite" }}>· · ·</span>
              : aiMsg
              ? `“${aiMsg}”`
              : <span style={{ opacity: 0.4 }}>Watch an episode to hear from the crew</span>}
          </div>
        </div>

        {/* ── PROGRESS CARD ── */}
        <div style={{ background: char.panel, border: `1px solid ${char.border}`, borderRadius: 10, padding: "18px 18px 16px", marginBottom: 12, transition: "background 0.4s, border-color 0.4s" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 12 }}>
            <span style={label(char.muted)}>Today</span>
            <span style={bigNum(goalReached ? char.ink : INK_HI, 34)}>
              {state.todayCount}
              <span onClick={() => setShowGoalEdit(v => !v)} title="Change daily goal" style={{ fontFamily: MONO, fontSize: 14, fontWeight: 400, color: showGoalEdit ? char.ink : char.muted, letterSpacing: 0, cursor: "pointer", transition: "color 0.2s", userSelect: "none", borderBottom: `1px dotted ${char.muted}` }}>/{goal}</span>
            </span>
          </div>

          {/* Goal editor */}
          <div style={{ maxHeight: showGoalEdit ? 60 : 0, overflow: "hidden", transition: "max-height 0.3s cubic-bezier(0.4,0,0.2,1)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, padding: "10px 12px", borderRadius: 8, border: `1px solid ${char.border}`, background: char.ink + "08" }}>
              <span style={label(char.muted)}>Daily Goal</span>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <button onClick={() => changeGoal(-1)} disabled={goal <= MIN_GOAL} style={{
                  width: 26, height: 26, borderRadius: 6, border: `1px solid ${goal <= MIN_GOAL ? char.border : char.ink}`,
                  background: "transparent", color: goal <= MIN_GOAL ? char.muted : char.ink,
                  fontFamily: MONO, fontSize: 14, fontWeight: 700, cursor: goal <= MIN_GOAL ? "default" : "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", lineHeight: 1, transition: "all 0.2s",
                }}>−</button>
                <span style={{ ...bigNum(char.ink, 17), minWidth: 28, textAlign: "center" }}>{goal}</span>
                <button onClick={() => changeGoal(1)} disabled={goal >= MAX_GOAL} style={{
                  width: 26, height: 26, borderRadius: 6, border: `1px solid ${goal >= MAX_GOAL ? char.border : char.ink}`,
                  background: "transparent", color: goal >= MAX_GOAL ? char.muted : char.ink,
                  fontFamily: MONO, fontSize: 14, fontWeight: 700, cursor: goal >= MAX_GOAL ? "default" : "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", lineHeight: 1, transition: "all 0.2s",
                }}>+</button>
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div style={{ height: 3, background: char.border, borderRadius: 3, overflow: "hidden", marginBottom: 14 }}>
            <div style={{
              height: "100%", width: `${prog * 100}%`,
              background: char.ink,
              transition: "width 0.5s cubic-bezier(0.34,1.4,0.64,1), background 0.4s",
            }} />
          </div>

          {/* Crew pips */}
          <div style={{ display: "flex", gap: 5, justifyContent: "center" }}>
            {CREW.map((c, i) => {
              const unlocked = i < state.todayCount;
              const isActive = i === state.todayCount - 1;
              const isNew = pipAnims[i];
              return (
                <div key={c.name} title={`${c.name} · Ep ${i + 1}`} style={{
                  width: 26, height: 26, borderRadius: 5,
                  background: unlocked ? c.ink + "14" : "transparent",
                  border: isActive ? `1px solid ${c.ink}` : `1px solid ${unlocked ? c.ink + "44" : char.border}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0,
                  transition: "all 0.3s",
                  transform: isNew ? "scale(1.35)" : "scale(1)",
                }}>
                  {unlocked ? <PixelAvatar name={c.name} size={20} /> : null}
                </div>
              );
            })}
          </div>
        </div>

        {/* ── VOYAGE CARD ── */}
        <div style={{ background: char.panel, border: `1px solid ${char.border}`, borderRadius: 10, padding: "18px 18px 16px", marginBottom: 12, transition: "background 0.4s, border-color 0.4s" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: state.currentEp != null || showVoyageEdit ? 12 : 0 }}>
            <span style={label(char.muted)}>Voyage</span>
            {voyagePct != null
              ? <span style={{ fontFamily: MONO, fontSize: 13, fontWeight: 700, color: char.ink, fontVariantNumeric: "tabular-nums", transition: "color 0.4s" }}>{voyagePct.toFixed(1)}%</span>
              : !showVoyageEdit && (
                <button onClick={openVoyageEdit} style={{
                  fontFamily: MONO, fontSize: 10, letterSpacing: 2, textTransform: "uppercase",
                  padding: "6px 12px", borderRadius: 6, border: `1px solid ${char.border}`,
                  background: "transparent", color: char.ink, cursor: "pointer", transition: "all 0.2s",
                }}>Set current episode</button>
              )}
          </div>

          {state.currentEp != null && !showVoyageEdit && (
            <>
              <div onClick={openVoyageEdit} title="Set current episode" style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 12, cursor: "pointer", userSelect: "none" }}>
                <span style={bigNum(INK_HI, 34)}>{state.currentEp}</span>
                <span style={{ fontFamily: MONO, fontSize: 13, color: char.muted, fontVariantNumeric: "tabular-nums" }}>of {state.totalEps} episodes</span>
                <span style={{ fontFamily: MONO, fontSize: 10, color: char.muted, marginLeft: "auto", borderBottom: `1px dotted ${char.muted}` }}>edit</span>
              </div>
              <div style={{ height: 3, background: char.border, borderRadius: 3, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${voyagePct}%`, background: char.ink, transition: "width 0.5s cubic-bezier(0.34,1.4,0.64,1), background 0.4s" }} />
              </div>
            </>
          )}

          {showVoyageEdit && (
            <div style={{ display: "flex", alignItems: "flex-end", gap: 10, flexWrap: "wrap" }}>
              <div>
                <div style={{ ...label(char.muted, 9), marginBottom: 6 }}>Current Ep</div>
                <input type="number" min="0" value={epDraft} autoFocus
                  onChange={e => setEpDraft(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && saveVoyage()}
                  style={inputStyle} />
              </div>
              <div>
                <div style={{ ...label(char.muted, 9), marginBottom: 6 }}>Total Eps</div>
                <input type="number" min="1" value={totalDraft}
                  onChange={e => setTotalDraft(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && saveVoyage()}
                  style={inputStyle} />
              </div>
              <button onClick={saveVoyage} style={{
                fontFamily: MONO, fontSize: 10, letterSpacing: 2, textTransform: "uppercase",
                padding: "9px 16px", borderRadius: 6, border: `1px solid ${char.ink}`,
                background: char.ink + "14", color: char.ink, cursor: "pointer", transition: "all 0.2s",
              }}>Save</button>
              <button onClick={() => setShowVoyageEdit(false)} style={{
                fontFamily: MONO, fontSize: 10, letterSpacing: 2, textTransform: "uppercase",
                padding: "9px 12px", borderRadius: 6, border: `1px solid ${char.border}`,
                background: "transparent", color: char.muted, cursor: "pointer", transition: "all 0.2s",
              }}>Cancel</button>
            </div>
          )}

          {state.currentEp == null && !showVoyageEdit && (
            <div style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 13, color: char.muted, marginTop: 10 }}>
              Track your place in the Grand Line
            </div>
          )}
        </div>

        {/* ── CHART ── */}
        <div style={{ background: char.panel, border: `1px solid ${char.border}`, borderRadius: 10, marginBottom: 12, overflow: "hidden", transition: "background 0.4s, border-color 0.4s" }}>
          <div onClick={() => setShowChart(v => !v)} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 18px", cursor: "pointer", userSelect: "none" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={label(char.muted)}>Watch History</span>
              {state.history.length > 0 && (
                <span style={{ fontFamily: MONO, fontSize: 10, color: char.ink, fontWeight: 700 }}>
                  {state.history.filter(h => h.count >= goal).length} goal days
                </span>
              )}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {showChart && WINDOWS.map(w => (
                <button key={w} onClick={e => { e.stopPropagation(); setChartWindow(w); }} style={{
                  padding: "3px 9px", borderRadius: 5, border: `1px solid ${chartWindow === w ? char.ink : char.border}`,
                  background: chartWindow === w ? char.ink + "1c" : "transparent",
                  color: chartWindow === w ? char.ink : char.muted,
                  fontFamily: MONO, fontSize: 10, fontWeight: 700, cursor: "pointer", transition: "all 0.2s",
                }}>{w}d</button>
              ))}
              <span style={{ color: char.muted, fontSize: 12, display: "inline-block", transform: showChart ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.3s" }}>▾</span>
            </div>
          </div>
          <div style={{ maxHeight: showChart ? 200 : 0, overflow: "hidden", transition: "max-height 0.4s cubic-bezier(0.4,0,0.2,1)" }}>
            {state.history.length === 0 ? (
              <div style={{ textAlign: "center", padding: "24px", color: char.muted, fontFamily: SERIF, fontStyle: "italic", fontSize: 14 }}>Start logging to build your history</div>
            ) : (
              <div style={{ padding: "0 8px 16px" }}>
                <ResponsiveContainer width="100%" height={160}>
                  <BarChart data={chartData} margin={{ top: 8, right: 12, bottom: 0, left: -28 }}>
                    <XAxis dataKey="label" tick={{ fill: char.muted, fontSize: 9, fontFamily: "monospace" }} axisLine={false} tickLine={false} interval={chartWindow === 7 ? 0 : chartWindow === 14 ? 1 : 4} />
                    <YAxis tick={{ fill: char.muted, fontSize: 9, fontFamily: "monospace" }} axisLine={false} tickLine={false} domain={[0, "auto"]} allowDecimals={false} />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: "#ffffff0a" }} />
                    <ReferenceLine y={goal} stroke={char.ink + "44"} strokeDasharray="4 3" />
                    <Bar dataKey="eps" maxBarSize={16} radius={[3, 3, 0, 0]}>
                      {chartData.map((d, i) => <Cell key={i} fill={d.hit ? char.ink : char.ink + "55"} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>

        {/* ── LOG BUTTON ── */}
        <button onClick={logEp} disabled={animating} style={{
          width: "100%", padding: "19px",
          borderRadius: 8, border: `1px solid ${char.ink}55`,
          background: goalReached ? char.ink : char.ink + "16",
          color: goalReached ? char.bg : char.ink,
          fontFamily: MONO, fontSize: 12, fontWeight: 700, cursor: "pointer",
          letterSpacing: 3, textTransform: "uppercase",
          transition: "all 0.25s",
          transform: animating ? "scale(0.98)" : "scale(1)",
          marginBottom: 10,
        }}>
          {goalReached
            ? "Goal reached — log another"
            : state.currentEp != null
            ? `Log episode ${state.currentEp + 1}`
            : state.todayCount === 0
            ? "Set sail — log episode 1"
            : `Log episode ${state.todayCount + 1}`}
        </button>

        {/* ── SECONDARY ACTIONS ── */}
        <div style={{ display: "flex", gap: 10, marginBottom: 28 }}>
          <button onClick={share} style={{
            flex: 1, padding: "13px", borderRadius: 8,
            border: `1px solid ${char.border}`, background: "transparent",
            color: char.ink, fontFamily: MONO, fontSize: 10, letterSpacing: 2, textTransform: "uppercase", fontWeight: 600, cursor: "pointer", transition: "all 0.3s",
          }}>Share log</button>

          {!confirmReset ? (
            <button onClick={() => setConfirmReset(true)} style={{
              flex: 1, padding: "13px", borderRadius: 8,
              border: `1px solid ${char.border}`, background: "transparent",
              color: char.muted, fontFamily: MONO, fontSize: 10, letterSpacing: 2, textTransform: "uppercase", cursor: "pointer", transition: "all 0.3s",
            }}>Reset day</button>
          ) : (
            <button onClick={doReset} style={{
              flex: 1, padding: "13px", borderRadius: 8,
              border: `1px solid #ef444455`, background: "#ef444415",
              color: "#ef4444", fontFamily: MONO, fontSize: 10, letterSpacing: 2, textTransform: "uppercase", fontWeight: 700, cursor: "pointer", transition: "all 0.15s",
              animation: "shake 0.3s ease",
            }}>Confirm reset</button>
          )}
        </div>

        {/* ── STATS ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 28 }}>
          {[{ l: "Total Watched", v: state.totalWatched }, { l: "Best Streak", v: `${state.streak}` }].map(s => (
            <div key={s.l} style={{ background: char.panel, border: `1px solid ${char.border}`, borderRadius: 10, padding: "16px", textAlign: "center", transition: "background 0.4s, border-color 0.4s" }}>
              <div style={bigNum(char.ink, 26)}>{s.v}</div>
              <div style={{ ...label(char.muted, 9), marginTop: 6 }}>{s.l}</div>
            </div>
          ))}
        </div>

        {/* ── CREW ROSTER ── */}
        <div>
          <div style={{ ...label(char.muted, 9), marginBottom: 12 }}>Crew Unlocks</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {CREW.map((c, i) => {
              const unlocked = i < state.todayCount;
              return (
                <div key={c.name} style={{
                  display: "flex", alignItems: "center", gap: 14,
                  padding: "10px 14px", borderRadius: 8,
                  background: unlocked ? c.ink + "0c" : "transparent",
                  border: `1px solid ${unlocked ? c.ink + "33" : char.border}`,
                  opacity: unlocked ? 1 : 0.4,
                  transition: "all 0.4s",
                }}>
                  <div style={{
                    width: 38, height: 38, borderRadius: 6,
                    background: unlocked ? c.ink + "14" : "transparent",
                    border: `1px solid ${unlocked ? c.ink + "44" : char.border}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0, transition: "all 0.4s",
                  }}>
                    <PixelAvatar name={c.name} size={30} style={{ filter: unlocked ? "none" : "grayscale(1) brightness(0.6)", transition: "filter 0.4s" }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 16, color: unlocked ? c.ink : INK_HI, transition: "color 0.4s" }}>{c.name}</div>
                    <div style={{ fontFamily: MONO, fontSize: 9, letterSpacing: 1.5, textTransform: "uppercase", color: char.muted, marginTop: 2 }}>{c.title} · Ep {i + 1}</div>
                  </div>
                  {unlocked && <div style={{ fontFamily: MONO, fontSize: 11, color: c.ink, fontWeight: 800, transition: "color 0.4s" }}>✓</div>}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div style={{
          position: "fixed", bottom: 32, left: "50%", transform: "translateX(-50%)",
          background: char.panel, border: `1px solid ${char.border}`,
          color: INK_HI, padding: "12px 24px", borderRadius: 8,
          fontFamily: MONO, fontSize: 11, letterSpacing: 1, zIndex: 300, whiteSpace: "nowrap",
          animation: "slideUp 0.3s ease",
        }}>{toast}</div>
      )}

      <style>{`
        @keyframes flashOut  { 0% { opacity: 1 } 100% { opacity: 0 } }
        @keyframes pulse     { 0%,100% { opacity: 0.4 } 50% { opacity: 1 } }
        @keyframes slideUp   { from { opacity: 0; transform: translateX(-50%) translateY(8px) } to { opacity: 1; transform: translateX(-50%) translateY(0) } }
        @keyframes shake     { 0%,100% { transform: translateX(0) } 25% { transform: translateX(-4px) } 75% { transform: translateX(4px) } }
        button:hover:not(:disabled) { opacity: 0.85; }
        input[type=number]::-webkit-inner-spin-button, input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
        input[type=number] { -moz-appearance: textfield; }
      `}</style>
    </div>
  );
}
