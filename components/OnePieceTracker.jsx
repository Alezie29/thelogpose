"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";

// Each character has a hand-picked palette: bg is a deep tinted dark, ink is the display colour,
// muted is for secondary text, and panel is the card surface tint.
const CREW = [
  { name: "Chopper",  title: "Doctor",        emoji: "🦌", quote: "I'm not happy you called me cute!",
    bg: "#0e0614", ink: "#E8A0C8", muted: "#8a6070", panel: "#1a0d1f", border: "#3d1f33" },
  { name: "Nami",     title: "Navigator",     emoji: "🗺️", quote: "Leave the navigation to me.",
    bg: "#120a00", ink: "#F0A04B", muted: "#7a5530", panel: "#1c1000", border: "#3d2800" },
  { name: "Usopp",   title: "Sniper",        emoji: "🎯", quote: "I am the great Captain Usopp!",
    bg: "#0a0518", ink: "#9B6FE8", muted: "#5a3f80", panel: "#120a22", border: "#2d1a55" },
  { name: "Robin",   title: "Archaeologist", emoji: "🌸", quote: "I want to live!",
    bg: "#020b14", ink: "#5B9EC9", muted: "#2f5570", panel: "#051420", border: "#0f3050" },
  { name: "Franky",  title: "Shipwright",    emoji: "🤖", quote: "SUPER!",
    bg: "#000e1a", ink: "#0EA5E9", muted: "#2a5570", panel: "#001828", border: "#003d5c" },
  { name: "Brook",   title: "Musician",      emoji: "💀", quote: "Yohohoho!",
    bg: "#001414", ink: "#7DD8D8", muted: "#2a6060", panel: "#001e1e", border: "#0a4040" },
  { name: "Jinbe",   title: "Helmsman",      emoji: "🐋", quote: "A crew that faces any hardship together will never fall.",
    bg: "#000814", ink: "#3B90C0", muted: "#1a4060", panel: "#001020", border: "#0a3050" },
  { name: "Sanji",   title: "Cook",          emoji: "🔥", quote: "A real cook never wastes food.",
    bg: "#120c00", ink: "#F5B800", muted: "#7a6000", panel: "#1c1400", border: "#4a3500" },
  { name: "Zoro",    title: "Swordsman",     emoji: "⚔️", quote: "Nothing happened.",
    bg: "#011408", ink: "#22C55E", muted: "#1a6030", panel: "#041c0c", border: "#0d4020" },
  { name: "Luffy",   title: "Captain",       emoji: "🍖", quote: "I'm gonna be King of the Pirates!",
    bg: "#140004", ink: "#EF4444", muted: "#7a1a1a", panel: "#1e0508", border: "#4a0f10" },
];

const DEFAULT_GOAL = 10;
const MIN_GOAL = 1;
const MAX_GOAL = 30;
const STORAGE_KEY = "op_tracker_v4";
const WINDOWS = [7, 14, 30];

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

export default function OnePieceTracker() {
  const [state, setState] = useState(() => {
    const s = loadState(); const today = getToday();
    if (s && s.date === today) return { goal: DEFAULT_GOAL, ...s };
    const yd = new Date(); yd.setDate(yd.getDate() - 1);
    const carried = s && s.date === yd.toISOString().split("T")[0] && s.todayCount >= (s.goal || DEFAULT_GOAL);
    return { date: today, todayCount: 0, streak: carried ? (s?.streak || 0) : 0, totalWatched: s?.totalWatched || 0, history: s?.history || [], goal: s?.goal || DEFAULT_GOAL };
  });

  const [animating, setAnimating] = useState(false);
  const [popAnim, setPopAnim] = useState(false);
  const [charTransition, setCharTransition] = useState(false);
  const [prevCharIdx, setPrevCharIdx] = useState(0);
  const [aiMsg, setAiMsg] = useState("");
  const [loadingAI, setLoadingAI] = useState(false);
  const [toast, setToast] = useState("");
  const [flash, setFlash] = useState(false);
  const [chartWindow, setChartWindow] = useState(7);
  const [showChart, setShowChart] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const [showGoalEdit, setShowGoalEdit] = useState(false);
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
      setPrevCharIdx(CREW.indexOf(curChar));
      setCharTransition(true);
      setTimeout(() => setCharTransition(false), 400);
    }

    // Emoji pop
    setTimeout(() => setPopAnim(true), 50);
    setTimeout(() => setPopAnim(false), 500);

    setState(s => {
      const existing = s.history.find(h => h.date === today);
      const newHistory = existing
        ? s.history.map(h => h.date === today ? { ...h, count: n } : h)
        : [...s.history, { date: today, count: n }];
      return { ...s, todayCount: n, totalWatched: s.totalWatched + 1, streak: hitGoal ? s.streak + 1 : s.streak, history: newHistory.slice(-60) };
    });

    if (hitGoal) { setFlash(true); setTimeout(() => setFlash(false), 900); }
    prevCount.current = n;
    fetchAI(n, nextChar, goal);
    setTimeout(() => setAnimating(false), 300);
  };

  const changeGoal = (delta) => {
    setState(s => ({ ...s, goal: Math.min(MAX_GOAL, Math.max(MIN_GOAL, (s.goal || DEFAULT_GOAL) + delta)) }));
  };

  const doReset = () => {
    setState(s => ({ ...s, todayCount: 0 }));
    setAiMsg("");
    setConfirmReset(false);
    setPipAnims({});
  };

  const share = async () => {
    const t = `🏴‍☠️ The Log Pose\n📅 ${mounted ? fmtDate(state.date) : ""}\n📺 Today: ${state.todayCount}/${goal} eps\n🔥 Streak: ${state.streak} days\n📊 Total: ${state.totalWatched} episodes`;
    try { await navigator.share({ text: t }); }
    catch { try { await navigator.clipboard.writeText(t); setToast("Copied to clipboard"); setTimeout(() => setToast(""), 2000); } catch {} }
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    const eps = payload[0]?.value;
    return (
      <div style={{ background: char.panel, border: `1px solid ${char.border}`, borderRadius: 10, padding: "8px 14px", fontSize: 12 }}>
        <div style={{ color: char.muted, marginBottom: 2 }}>{label}</div>
        <div style={{ color: char.ink, fontWeight: 700 }}>{eps} ep{eps !== 1 ? "s" : ""}</div>
        {eps >= goal && <div style={{ color: char.muted, fontSize: 10, marginTop: 2 }}>Goal hit ✓</div>}
      </div>
    );
  };

  if (!mounted) return <div style={{ minHeight: "100vh", background: "#0a0a0a" }} />;

  return (
    <div style={{ minHeight: "100vh", background: char.bg, color: "#e8e8e8", fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif", transition: "background 0.5s ease", position: "relative", overflowX: "hidden" }}>

      {/* Subtle corner vignette — no center glow */}
      <div style={{ position: "fixed", inset: 0, background: `radial-gradient(ellipse at top left, ${char.ink}0a 0%, transparent 60%), radial-gradient(ellipse at bottom right, ${char.ink}08 0%, transparent 55%)`, pointerEvents: "none", transition: "background 0.5s", zIndex: 0 }} />

      {/* Goal flash */}
      {flash && <div style={{ position: "fixed", inset: 0, zIndex: 200, pointerEvents: "none", background: char.ink + "18", animation: "flashOut 0.9s ease forwards" }} />}

      <div style={{ maxWidth: 420, margin: "0 auto", padding: "32px 20px 80px", position: "relative", zIndex: 1 }}>

        {/* ── HEADER ── */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 32 }}>
          <div>
            <div style={{ fontSize: 10, letterSpacing: 5, color: char.muted, textTransform: "uppercase", marginBottom: 6, transition: "color 0.4s" }}>The Log Pose</div>
            <div style={{ fontSize: 11, color: char.muted, transition: "color 0.4s" }}>{mounted ? fmtDate(state.date) : ""}</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 9, color: char.muted, letterSpacing: 3, textTransform: "uppercase", marginBottom: 4, transition: "color 0.4s" }}>Streak</div>
            <div style={{ fontSize: 40, fontWeight: 900, color: char.ink, lineHeight: 1, letterSpacing: -2, transition: "color 0.4s", fontVariantNumeric: "tabular-nums" }}>
              {state.streak}
              <span style={{ fontSize: 12, fontWeight: 400, color: char.muted, marginLeft: 4, letterSpacing: 0 }}>days</span>
            </div>
          </div>
        </div>

        {/* ── CHARACTER CARD ── */}
        <div style={{
          background: char.panel,
          border: `1px solid ${char.border}`,
          borderRadius: 24,
          padding: "32px 24px 28px",
          marginBottom: 14,
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
          transition: "background 0.4s, border-color 0.4s",
          opacity: charTransition ? 0 : 1,
          transform: charTransition ? "translateX(8px)" : "translateX(0)",
          transitionProperty: "background, border-color, opacity, transform",
          transitionDuration: "0.4s",
        }}>
          {/* Large watermark initial behind emoji */}
          <div style={{
            position: "absolute", top: "50%", left: "50%",
            transform: "translate(-50%, -54%)",
            fontSize: 220, fontWeight: 900, color: char.ink,
            opacity: 0.04, lineHeight: 1, pointerEvents: "none",
            letterSpacing: -10, userSelect: "none",
            transition: "color 0.4s, opacity 0.4s",
          }}>
            {char.name[0]}
          </div>

          {/* Thin accent line top */}
          <div style={{ position: "absolute", top: 0, left: "20%", right: "20%", height: 2, background: `linear-gradient(90deg, transparent, ${char.ink}88, transparent)`, borderRadius: 2, transition: "background 0.4s" }} />

          {/* Emoji */}
          <div style={{
            fontSize: 88, lineHeight: 1, marginBottom: 20,
            display: "inline-block", position: "relative", zIndex: 1,
            transform: popAnim ? "scale(1.25) rotate(-8deg)" : goalReached ? "scale(1.05)" : "scale(1)",
            transition: popAnim ? "transform 0.15s cubic-bezier(0.34,1.8,0.64,1)" : "transform 0.3s ease",
            filter: goalReached ? `drop-shadow(0 0 18px ${char.ink}88)` : "none",
          }}>
            {char.emoji}
          </div>

          <div style={{ fontSize: 10, letterSpacing: 4, color: char.muted, textTransform: "uppercase", marginBottom: 6, transition: "color 0.4s" }}>{char.title}</div>
          <div style={{ fontSize: 32, fontWeight: 800, color: char.ink, marginBottom: 18, letterSpacing: -0.5, transition: "color 0.4s" }}>{char.name}</div>

          {/* AI quote */}
          <div style={{ minHeight: 44, fontSize: 13, color: char.muted, fontStyle: "italic", lineHeight: 1.65, padding: "0 8px", transition: "color 0.4s", position: "relative", zIndex: 1 }}>
            {loadingAI
              ? <span style={{ letterSpacing: 8, opacity: 0.4, animation: "pulse 1.2s ease infinite" }}>· · ·</span>
              : aiMsg
              ? `"${aiMsg}"`
              : <span style={{ opacity: 0.35 }}>Watch an episode to hear from the crew</span>}
          </div>
        </div>

        {/* ── PROGRESS CARD ── */}
        <div style={{ background: char.panel, border: `1px solid ${char.border}`, borderRadius: 20, padding: "18px 18px 16px", marginBottom: 14, transition: "background 0.4s, border-color 0.4s" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 12 }}>
            <span style={{ fontSize: 10, color: char.muted, letterSpacing: 3, textTransform: "uppercase", transition: "color 0.4s" }}>Today</span>
            <span style={{ fontSize: 40, fontWeight: 900, color: goalReached ? char.ink : "#e8e8e8", lineHeight: 1, letterSpacing: -2, transition: "color 0.4s", fontVariantNumeric: "tabular-nums" }}>
              {state.todayCount}
              <span onClick={() => setShowGoalEdit(v => !v)} title="Change daily goal" style={{ fontSize: 16, fontWeight: 400, color: showGoalEdit ? char.ink : char.muted, letterSpacing: 0, cursor: "pointer", transition: "color 0.2s", userSelect: "none" }}>/{goal} ✎</span>
            </span>
          </div>

          {/* Goal editor */}
          <div style={{ maxHeight: showGoalEdit ? 60 : 0, overflow: "hidden", transition: "max-height 0.3s cubic-bezier(0.4,0,0.2,1)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, padding: "10px 12px", borderRadius: 12, border: `1px solid ${char.border}`, background: char.ink + "08" }}>
              <span style={{ fontSize: 10, color: char.muted, letterSpacing: 3, textTransform: "uppercase" }}>Daily Goal</span>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <button onClick={() => changeGoal(-1)} disabled={goal <= MIN_GOAL} style={{
                  width: 26, height: 26, borderRadius: "50%", border: `1px solid ${goal <= MIN_GOAL ? char.border : char.ink}`,
                  background: "transparent", color: goal <= MIN_GOAL ? char.muted : char.ink,
                  fontSize: 14, fontWeight: 700, cursor: goal <= MIN_GOAL ? "default" : "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", lineHeight: 1, transition: "all 0.2s",
                }}>−</button>
                <span style={{ fontSize: 18, fontWeight: 900, color: char.ink, minWidth: 28, textAlign: "center", fontVariantNumeric: "tabular-nums" }}>{goal}</span>
                <button onClick={() => changeGoal(1)} disabled={goal >= MAX_GOAL} style={{
                  width: 26, height: 26, borderRadius: "50%", border: `1px solid ${goal >= MAX_GOAL ? char.border : char.ink}`,
                  background: "transparent", color: goal >= MAX_GOAL ? char.muted : char.ink,
                  fontSize: 14, fontWeight: 700, cursor: goal >= MAX_GOAL ? "default" : "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", lineHeight: 1, transition: "all 0.2s",
                }}>+</button>
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div style={{ height: 4, background: char.border, borderRadius: 4, overflow: "hidden", marginBottom: 14 }}>
            <div style={{
              height: "100%", width: `${prog * 100}%`,
              background: goalReached ? char.ink : `linear-gradient(90deg, ${char.ink}66, ${char.ink})`,
              borderRadius: 4,
              transition: "width 0.5s cubic-bezier(0.34,1.4,0.64,1), background 0.4s",
              boxShadow: goalReached ? `0 0 10px ${char.ink}99` : "none",
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
                  width: 26, height: 26, borderRadius: "50%",
                  background: unlocked ? c.ink + "22" : char.border,
                  border: isActive ? `2px solid ${c.ink}` : `1px solid ${unlocked ? c.ink + "55" : "transparent"}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 11, flexShrink: 0,
                  transition: "all 0.3s",
                  transform: isNew ? "scale(1.4)" : isActive ? "scale(1.1)" : "scale(1)",
                  boxShadow: isActive ? `0 0 8px ${c.ink}77` : "none",
                }}>
                  {unlocked ? c.emoji : null}
                </div>
              );
            })}
          </div>
        </div>

        {/* ── CHART ── */}
        <div style={{ background: char.panel, border: `1px solid ${char.border}`, borderRadius: 20, marginBottom: 14, overflow: "hidden", transition: "background 0.4s, border-color 0.4s" }}>
          <div onClick={() => setShowChart(v => !v)} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 18px", cursor: "pointer", userSelect: "none" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 10, letterSpacing: 3, color: char.muted, textTransform: "uppercase" }}>Watch History</span>
              {state.history.length > 0 && (
                <span style={{ fontSize: 10, color: char.ink, fontWeight: 700 }}>
                  {state.history.filter(h => h.count >= goal).length} goal days
                </span>
              )}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {showChart && WINDOWS.map(w => (
                <button key={w} onClick={e => { e.stopPropagation(); setChartWindow(w); }} style={{
                  padding: "3px 10px", borderRadius: 20, border: `1px solid ${chartWindow === w ? char.ink : char.border}`,
                  background: chartWindow === w ? char.ink + "22" : "transparent",
                  color: chartWindow === w ? char.ink : char.muted,
                  fontSize: 10, fontWeight: 700, cursor: "pointer", transition: "all 0.2s",
                }}>{w}d</button>
              ))}
              <span style={{ color: char.muted, fontSize: 12, display: "inline-block", transform: showChart ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.3s" }}>▾</span>
            </div>
          </div>
          <div style={{ maxHeight: showChart ? 200 : 0, overflow: "hidden", transition: "max-height 0.4s cubic-bezier(0.4,0,0.2,1)" }}>
            {state.history.length === 0 ? (
              <div style={{ textAlign: "center", padding: "24px", color: char.muted, fontSize: 13 }}>Start logging to build your history</div>
            ) : (
              <div style={{ padding: "0 8px 16px" }}>
                <ResponsiveContainer width="100%" height={160}>
                  <LineChart data={chartData} margin={{ top: 8, right: 12, bottom: 0, left: -28 }}>
                    <XAxis dataKey="label" tick={{ fill: char.muted, fontSize: 9 }} axisLine={false} tickLine={false} interval={chartWindow === 7 ? 0 : chartWindow === 14 ? 1 : 4} />
                    <YAxis tick={{ fill: char.muted, fontSize: 9 }} axisLine={false} tickLine={false} domain={[0, "auto"]} />
                    <Tooltip content={<CustomTooltip />} />
                    <ReferenceLine y={goal} stroke={char.ink + "44"} strokeDasharray="4 3" />
                    <Line type="monotone" dataKey="eps" stroke={char.ink} strokeWidth={2}
                      dot={({ cx, cy, payload }) => <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={payload.hit ? 5 : 3} fill={payload.hit ? char.ink : char.ink + "66"} />}
                      activeDot={{ r: 6, fill: char.ink, stroke: char.panel, strokeWidth: 2 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>

        {/* ── LOG BUTTON ── */}
        <button onClick={logEp} disabled={animating} style={{
          width: "100%", padding: "20px",
          borderRadius: 16, border: `1px solid ${char.ink}55`,
          background: goalReached ? char.ink : char.ink + "18",
          color: goalReached ? char.bg : char.ink,
          fontSize: 16, fontWeight: 700, cursor: "pointer",
          letterSpacing: 0.3,
          transition: "all 0.25s",
          transform: animating ? "scale(0.97)" : "scale(1)",
          boxShadow: goalReached ? `0 4px 24px ${char.ink}44` : "none",
          marginBottom: 10,
        }}>
          {goalReached ? `⭐ Goal smashed — log another?` : state.todayCount === 0 ? `Set sail — Log Episode 1` : `+ Log Episode ${state.todayCount + 1}`}
        </button>

        {/* ── SECONDARY ACTIONS ── */}
        <div style={{ display: "flex", gap: 10, marginBottom: 28 }}>
          <button onClick={share} style={{
            flex: 1, padding: "13px", borderRadius: 14,
            border: `1px solid ${char.border}`, background: "transparent",
            color: char.ink, fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all 0.3s",
          }}>Share 🏴‍☠️</button>

          {!confirmReset ? (
            <button onClick={() => setConfirmReset(true)} style={{
              flex: 1, padding: "13px", borderRadius: 14,
              border: `1px solid ${char.border}`, background: "transparent",
              color: char.muted, fontSize: 13, cursor: "pointer", transition: "all 0.3s",
            }}>Reset day</button>
          ) : (
            <button onClick={doReset} style={{
              flex: 1, padding: "13px", borderRadius: 14,
              border: `1px solid #ef444455`, background: "#ef444415",
              color: "#ef4444", fontSize: 13, fontWeight: 700, cursor: "pointer", transition: "all 0.15s",
              animation: "shake 0.3s ease",
            }}>Confirm reset</button>
          )}
        </div>

        {/* ── STATS ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 28 }}>
          {[{ l: "Total Watched", v: state.totalWatched }, { l: "Best Streak", v: `${state.streak}` }].map(s => (
            <div key={s.l} style={{ background: char.panel, border: `1px solid ${char.border}`, borderRadius: 16, padding: "16px", textAlign: "center", transition: "background 0.4s, border-color 0.4s" }}>
              <div style={{ fontSize: 28, fontWeight: 900, color: char.ink, transition: "color 0.4s", fontVariantNumeric: "tabular-nums", letterSpacing: -1 }}>{s.v}</div>
              <div style={{ fontSize: 9, color: char.muted, letterSpacing: 2, textTransform: "uppercase", marginTop: 4 }}>{s.l}</div>
            </div>
          ))}
        </div>

        {/* ── CREW ROSTER ── */}
        <div>
          <div style={{ fontSize: 9, letterSpacing: 4, color: char.muted, textTransform: "uppercase", marginBottom: 12, transition: "color 0.4s" }}>Crew Unlocks</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {CREW.map((c, i) => {
              const unlocked = i < state.todayCount;
              return (
                <div key={c.name} style={{
                  display: "flex", alignItems: "center", gap: 14,
                  padding: "10px 14px", borderRadius: 14,
                  background: unlocked ? c.ink + "0c" : "transparent",
                  border: `1px solid ${unlocked ? c.ink + "33" : char.border}`,
                  opacity: unlocked ? 1 : 0.3,
                  transform: unlocked ? "translateX(0)" : "translateX(-4px)",
                  transition: "all 0.4s",
                }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: "50%",
                    background: unlocked ? c.ink + "18" : char.border,
                    border: `1px solid ${unlocked ? c.ink + "44" : "transparent"}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 18, flexShrink: 0, transition: "all 0.4s",
                  }}>{c.emoji}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: unlocked ? c.ink : "#e8e8e8", transition: "color 0.4s" }}>{c.name}</div>
                    <div style={{ fontSize: 10, color: char.muted, marginTop: 1 }}>{c.title} · Ep {i + 1}</div>
                  </div>
                  {unlocked && <div style={{ fontSize: 11, color: c.ink, fontWeight: 800, transition: "color 0.4s" }}>✓</div>}
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
          color: "#e8e8e8", padding: "12px 24px", borderRadius: 12,
          fontSize: 13, zIndex: 300, whiteSpace: "nowrap",
          animation: "slideUp 0.3s ease",
        }}>{toast}</div>
      )}

      <style>{`
        @keyframes flashOut  { 0% { opacity: 1 } 100% { opacity: 0 } }
        @keyframes pulse     { 0%,100% { opacity: 0.4 } 50% { opacity: 1 } }
        @keyframes slideUp   { from { opacity: 0; transform: translateX(-50%) translateY(8px) } to { opacity: 1; transform: translateX(-50%) translateY(0) } }
        @keyframes shake     { 0%,100% { transform: translateX(0) } 25% { transform: translateX(-4px) } 75% { transform: translateX(4px) } }
        button:hover:not(:disabled) { opacity: 0.85; }
      `}</style>
    </div>
  );
}