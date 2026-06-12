"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import ParticleSphere from "./ParticleSphere";

const PIPELINE = [
  { id: "01", name: "Problem Analyst",     desc: "Breaks down your challenge into pain points, stakeholders, and success metrics." },
  { id: "02", name: "Opportunity Planner", desc: "Maps market gaps, target segments, and competitive angles." },
  { id: "03", name: "Idea Generator",      desc: "Produces 10 distinct, scored hackathon concepts." },
  { id: "04", name: "Idea Validator",      desc: "Scores each idea across 5 dimensions with AI critique." },
  { id: "05", name: "Idea Selection",      desc: "You review and choose the winning concept.", isYou: true },
  { id: "06", name: "Solution Architect",  desc: "Creates a full technical blueprint and PRD." },
  { id: "07", name: "Presentation Agent",  desc: "Generates a 10-slide pitch deck with speaker notes." },
  { id: "08", name: "Pitch Agent",         desc: "Writes three pitch scripts: 30s, 2min, 5min." },
  { id: "09", name: "Report Generator",    desc: "Assembles the complete strategy document." },
];

const STATS = [
  { num: "10", label: "AI Agents",     color: "var(--pastel-pink)" },
  { num: "10", label: "Ranked Ideas",  color: "var(--pastel-purple)" },
  { num: "3",  label: "Pitch Scripts", color: "var(--pastel-blue)" },
  { num: "∞",  label: "Hackathons",    color: "var(--text-2)" },
];

const TERMINAL_LINES = [
  { cls: "term-dim",  text: "# exHacker v3 — initialising pipeline" },
  { cls: "term-key",  text: "» session: hackathon-2025-06-10" },
  { cls: "",          text: "" },
  { cls: "term-run",  text: "▶  [01] Problem Analyst        running…" },
  { cls: "term-done", text: "✔  [01] Problem Analyst        done  (4.1s)" },
  { cls: "term-run",  text: "▶  [02] Opportunity Planner    running…" },
  { cls: "term-done", text: "✔  [02] Opportunity Planner    done  (3.8s)" },
  { cls: "term-run",  text: "▶  [03] Idea Generator         running…" },
  { cls: "term-done", text: "✔  [03] Idea Generator         done  (6.2s)" },
  { cls: "term-val",  text: "   → 10 ideas generated · avg score 7.6/10" },
  { cls: "term-dim",  text: "⏸  [05] Idea Selection         YOUR TURN" },
];

function Terminal() {
  const [count, setCount] = useState(0);
  const [blink, setBlink] = useState(true);
  useEffect(() => {
    const t = setInterval(() => setCount(n => n < TERMINAL_LINES.length ? n + 1 : n), 280);
    const b = setInterval(() => setBlink(v => !v), 530);
    return () => { clearInterval(t); clearInterval(b); };
  }, []);
  const visible = TERMINAL_LINES.slice(0, count);
  return (
    <div className="term-window anim-fade-up-3">
      <div className="term-bar">
        <div className="term-dot term-dot-r" /><div className="term-dot term-dot-y" /><div className="term-dot term-dot-g" />
        <span style={{ marginLeft: "auto", fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--text-3)", letterSpacing: "0.05em" }}>
          exhacker · agent-pipeline
        </span>
      </div>
      <div className="term-body" style={{ minHeight: "220px" }}>
        {visible.map((l, i) => (
          <div key={i} className={l.cls || ""} style={{ minHeight: "1.9em" }}>{l.text}</div>
        ))}
        {count < TERMINAL_LINES.length && (
          <span style={{ color: "var(--pastel-purple)", borderRight: `1px solid ${blink ? "var(--pastel-purple)" : "transparent"}`, paddingRight: "1px" }}>&nbsp;</span>
        )}
      </div>
    </div>
  );
}

function FeatureCard({ num, title, desc, color }: { num: string; title: string; desc: string; color: string }) {
  return (
    <div style={{ padding: "22px 0", borderBottom: "1px solid var(--border)", display: "flex", gap: "22px", alignItems: "flex-start" }}>
      <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--text-3)", minWidth: "24px", paddingTop: "5px" }}>{num}</span>
      <div style={{ flex: 1 }}>
        <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "15px", color, marginBottom: "6px", letterSpacing: "-0.01em" }}>{title}</p>
        <p style={{ fontSize: "12px", color: "var(--text-2)", lineHeight: 1.65 }}>{desc}</p>
      </div>
    </div>
  );
}

export default function Hero() {
  const [scrollY, setScrollY] = useState(0);
  useEffect(() => {
    const fn = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <>
      <Navbar />
      <main style={{ background: "transparent" }}>

        {/* ══ HERO ══════════════════════════════════════════════════════════ */}
        <section style={{ minHeight: "100vh", display: "flex", flexDirection: "column", paddingTop: "56px", position: "relative", overflow: "hidden", background: "transparent" }}>

          {/* Particle sphere — fixed decoration */}
          <div className="hide-mobile" style={{ position: "fixed", right: "30px", top: "50%", transform: "translateY(-50%)", zIndex: 50, pointerEvents: "none" }}>
            <ParticleSphere scrollY={scrollY} />
          </div>

          <div className="container" style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "80px 40px 80px", textAlign: "center" }}>

            {/* Badge row */}
            <div className="anim-fade-up" style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "36px", flexWrap: "wrap", justifyContent: "center" }}>
              <span className="badge badge-pink">
                <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: "var(--pastel-pink)", animation: "pulse 1.8s infinite" }} />
                Multi-Agent Pipeline
              </span>
              <span className="badge">10 Agents · Human-in-the-Loop</span>
            </div>

            {/* Main headline */}
            <div className="anim-fade-up-1 hero-headline" style={{ marginBottom: "28px" }}>
              <h1 className="d1 pastel-glow" style={{ color: "var(--text-1)", marginBottom: "0" }}>
                WIN YOUR
              </h1>
              <h1 className="d1" style={{ marginBottom: "0" }}>
                <span className="grad-pink pastel-glow">HACKATHON</span>
              </h1>
              <h1 className="d1 pastel-glow" style={{ color: "var(--text-1)" }}>
                IN MINUTES.
              </h1>
            </div>

            <p className="body-lg anim-fade-up-2" style={{ maxWidth: "480px", marginBottom: "40px" }}>
              Paste your challenge. Ten specialised AI agents build your complete strategy —
              ideas, blueprint, deck, and pitch scripts — while you stay in control.
            </p>

            {/* CTAs */}
            <div className="anim-fade-up-3" style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap", justifyContent: "center", marginBottom: "60px" }}>
              <Link href="/generate" className="btn btn-primary" style={{ textDecoration: "none", padding: "14px 30px", fontSize: "13px" }}>
                Start Free — No Signup
                <span style={{ fontSize: "11px" }}>→</span>
              </Link>
              <Link href="#how" className="btn btn-ghost" style={{ textDecoration: "none" }}>
                See How It Works
              </Link>
            </div>

            {/* Stats row */}
            <div className="anim-fade-up-4" style={{ display: "flex", gap: "0", borderTop: "1px solid var(--border)", justifyContent: "center" }}>
              {STATS.map((s, i) => (
                <div key={s.label} style={{
                  padding: "18px 0",
                  paddingRight: "36px",
                  marginRight: "36px",
                  borderRight: i < STATS.length - 1 ? "1px solid var(--border)" : "none",
                }}>
                  <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "24px", color: s.color, letterSpacing: "-0.02em", lineHeight: 1, marginBottom: "4px" }}>{s.num}</div>
                  <div style={{ fontSize: "9px", color: "var(--text-3)", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 500 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ HOW IT WORKS ══════════════════════════════════════════════════ */}
        <section id="how" style={{ borderTop: "1px solid var(--border)", padding: "80px 0" }}>
          <div className="container">

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "60px", alignItems: "center", marginBottom: "60px" }}>
              <div>
                <span className="sec-num">[ 01 ] — PROCESS</span>
                <h2 className="d3" style={{ color: "var(--text-1)", marginBottom: "14px" }}>
                  Ten agents.<br />
                  <span className="grad-pink">One winning strategy.</span>
                </h2>
                <p className="body-md" style={{ maxWidth: "340px" }}>
                  Each agent specialises in one task. They run sequentially. You review and approve
                  each output before the next agent begins.
                </p>
              </div>
              <Terminal />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1px", background: "var(--border)" }}>
              {PIPELINE.map(s => (
                <div key={s.id} style={{
                  background: s.isYou ? "var(--pink-dim)" : "var(--surface-0)",
                  padding: "24px 22px",
                  borderLeft: s.isYou ? "2px solid var(--pastel-pink)" : "2px solid transparent",
                  transition: "background 0.2s",
                  cursor: "default",
                }}
                  onMouseEnter={e => (e.currentTarget.style.background = s.isYou ? "var(--pink-dim)" : "var(--surface-1)")}
                  onMouseLeave={e => (e.currentTarget.style.background = s.isYou ? "var(--pink-dim)" : "var(--surface-0)")}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: "9px", color: s.isYou ? "var(--pastel-pink)" : "var(--text-3)", letterSpacing: "0.05em" }}>{s.id}</span>
                    {s.isYou && <span className="badge badge-pink" style={{ fontSize: "8px", padding: "2px 8px" }}>YOU</span>}
                  </div>
                  <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "13px", color: s.isYou ? "var(--text-1)" : "var(--text-1)", marginBottom: "6px", letterSpacing: "-0.01em" }}>{s.name}</p>
                  <p style={{ fontSize: "11px", color: "var(--text-2)", lineHeight: 1.6 }}>{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ WHAT YOU GET ══════════════════════════════════════════════════ */}
        <section style={{ padding: "80px 0", borderTop: "1px solid var(--border)" }}>
          <div className="container">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "60px", alignItems: "start" }}>

              <div>
                <span className="sec-num">[ 02 ] — OUTPUTS</span>
                <h2 className="d3" style={{ color: "var(--text-1)", marginBottom: "14px" }}>
                  Everything you need<br />
                  <span className="grad-purple">to win.</span>
                </h2>
                <p className="body-md" style={{ marginBottom: "36px", maxWidth: "320px" }}>
                  From problem analysis to a battle-ready pitch, every deliverable is generated,
                  structured, and downloadable as Markdown.
                </p>
                <Link href="/generate" className="btn btn-purple" style={{ textDecoration: "none" }}>
                  Get Started Now
                  <span>→</span>
                </Link>
              </div>

              <div style={{ borderTop: "1px solid var(--border)" }}>
                {[
                  { num: "→", title: "10 Ranked Ideas", desc: "Each scored across feasibility, innovation, market potential, and hackathon fit.", color: "var(--pastel-pink)" },
                  { num: "→", title: "Solution Blueprint", desc: "Full architecture, tech stack, database schema, API design, and implementation roadmap.", color: "var(--pastel-purple)" },
                  { num: "→", title: "10-Slide Deck", desc: "Ready-to-present slides with speaker notes and visual suggestions.", color: "var(--pastel-blue)" },
                  { num: "→", title: "3 Pitch Scripts", desc: "30-second elevator, 2-minute demo, and 5-minute investor pitch — all adapted to your idea.", color: "var(--pastel-pink)" },
                  { num: "→", title: "PRD + Vision Doc", desc: "Downloadable product requirements and vision documents for your team.", color: "var(--pastel-purple)" },
                ].map((f, i) => (
                  <FeatureCard key={i} num={f.num} title={f.title} desc={f.desc} color={f.color} />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ══ FINAL CTA ═════════════════════════════════════════════════════ */}
        <section style={{ padding: "80px 0 100px", borderTop: "1px solid var(--border)", textAlign: "center", position: "relative", overflow: "hidden" }}>
          <div className="container" style={{ position: "relative", zIndex: 1 }}>
            <span className="sec-num" style={{ display: "block", textAlign: "center", marginBottom: "20px" }}>[ 03 ] — GET STARTED</span>
            <h2 className="d2 pastel-glow" style={{ color: "var(--text-1)", marginBottom: "16px" }}>
              Your next hackathon
            </h2>
            <h2 className="d2" style={{ marginBottom: "28px" }}>
              <span className="grad-pink pastel-glow">starts here.</span>
            </h2>
            <p className="body-md" style={{ marginBottom: "36px", maxWidth: "420px", margin: "0 auto 36px" }}>
              No account needed. Paste your challenge and let the agents work.
              You'll have a complete strategy in under 3 minutes.
            </p>
            <div style={{ display: "flex", gap: "10px", justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/generate" className="btn btn-primary" style={{ textDecoration: "none", padding: "14px 36px", fontSize: "13px", fontWeight: 700 }}>
                Build My Strategy Now
                <span>→</span>
              </Link>
            </div>
          </div>
        </section>

        {/* ══ Footer ════════════════════════════════════════════════════════ */}
        <footer style={{ borderTop: "1px solid var(--border)", padding: "24px 0" }}>
          <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "center", flexWrap: "wrap", gap: "12px" }}>
            <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "12px", color: "var(--text-3)" }}>exHacker</span>
            <span style={{ fontSize: "10px", color: "var(--text-3)" }}>AI-Powered Hackathon Strategy · Built with 10 Agents</span>
          </div>
        </footer>

      </main>
    </>
  );
}
