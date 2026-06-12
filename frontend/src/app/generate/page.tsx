"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import { startWorkflow } from "../../lib/api";
import { CompletedStep } from "../../types/project";

// ─── Loading screen ───────────────────────────────────────────────────────────
function LoadingScreen() {
  return (
    <>
      <Navbar />
      <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--black)", paddingTop: "60px" }}>
        <div style={{ textAlign: "center" }}>
          <div className="spinner" style={{ margin: "0 auto 28px" }} />
          <div style={{ width: "32px", height: "1px", background: "var(--pastel-purple)", margin: "0 auto 20px", opacity: 0.6 }} />
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "16px", fontWeight: 700, letterSpacing: "-0.01em", color: "var(--text-1)", marginBottom: "8px" }}>
            Analysing <span style={{ color: "var(--pastel-purple)" }}>Challenge</span>
          </h2>
          <p style={{ fontSize: "12px", color: "var(--text-3)", letterSpacing: "0.05em" }}>
            Problem Analyst is running · ~15 seconds
          </p>
          <div style={{ display: "flex", gap: "6px", justifyContent: "center", marginTop: "20px" }}>
            {[0,1,2].map(i => (
              <div key={i} style={{ width: "4px", height: "4px", borderRadius: "50%", background: "var(--pastel-purple)", animation: `pulse 1.4s ${i*0.22}s ease-in-out infinite` }} />
            ))}
          </div>
        </div>
      </main>
    </>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function GeneratePage() {
  const router = useRouter();
  const [challenge, setChallenge] = useState("");
  const [hackathon, setHackathon] = useState("");
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState<string|null>(null);

  async function handleSubmit() {
    if (!challenge.trim()) { setError("Please enter a challenge statement."); return; }
    setError(null);
    setLoading(true);
    try {
      const firstStep = await startWorkflow({
        challenge_statement: challenge,
        hackathon_name: hackathon,
        sponsors: [],
        tracks: [],
      });
      sessionStorage.setItem("exhacker_session_id", firstStep.session_id);
      sessionStorage.setItem("exhacker_workflow_steps", JSON.stringify([
        { step: firstStep.completed_step, label: firstStep.completed_step_label, output: firstStep.output } satisfies CompletedStep,
      ]));
      sessionStorage.setItem("exhacker_workflow_meta", JSON.stringify({
        currentStep: firstStep.next_step,
        nextIsSelectStep: firstStep.next_is_select_step,
        done: firstStep.done,
      }));
      sessionStorage.setItem("exhacker_challenge_info", JSON.stringify({
        challenge_statement: challenge, hackathon_name: hackathon,
      }));
      router.push("/workflow");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setLoading(false);
    }
  }

  if (loading) return <LoadingScreen />;

  return (
    <>
      <Navbar />
      <main style={{ minHeight: "100vh", background: "transparent", paddingTop: "60px" }}>

        {/* ══ HERO SECTION ══════════════════════════════════════════════════ */}
        <section style={{ padding: "72px 0 56px", borderBottom: "1px solid var(--border)", position: "relative", overflow: "hidden", background: "transparent" }}>
          {/* Bg glow */}
          <div style={{ position: "absolute", top: "-100px", right: "0", width: "500px", height: "500px", background: "radial-gradient(circle, rgba(200,182,240,0.07) 0%, transparent 70%)", pointerEvents: "none", borderRadius: "50%" }} />

          <div className="container">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "80px", alignItems: "center" }}>

              {/* Left */}
              <div className="anim-fade-up">
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "24px" }}>
                  <span className="badge badge-lime">
                    <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: "var(--pastel-pink)" }} />
                    New Project
                  </span>
                </div>
                <h1 className="d2" style={{ color: "var(--text-1)", marginBottom: "8px" }}>
                  Describe Your
                </h1>
                <h1 className="d2" style={{ marginBottom: "24px" }}>
                  <span style={{ color: "var(--pastel-pink)" }}>Challenge.</span>
                </h1>
                <p className="body-md" style={{ maxWidth: "380px", marginBottom: "36px" }}>
                   Ten specialised AI agents run one at a time. You review, edit,
                  and approve each output before the next begins.
                </p>
                {/* Stats */}
                <div style={{ display: "flex", gap: "28px", paddingTop: "24px", borderTop: "1px solid var(--border)" }}>
                  {[{ num:"10", label:"AI Agents" }, { num:"10", label:"Ideas" }, { num:"3", label:"Pitch Scripts" }].map(s => (
                    <div key={s.label}>
                      <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "24px", color: "var(--pastel-purple)", letterSpacing: "-0.02em", lineHeight: 1, marginBottom: "3px" }}>{s.num}</div>
                      <div style={{ fontSize: "9px", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-3)", fontWeight: 500 }}>{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: Project Name + Problem Statement */}
              <div className="anim-fade-up-2" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "11px", fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-3)", marginBottom: "8px" }}>
                    Project Name <span style={{ color: "var(--pastel-purple)" }}>*</span>
                  </label>
                  <input
                    type="text"
                    className="field"
                    placeholder="e.g. FoodWise, EcoTrack, HealthBridge..."
                    value={hackathon}
                    onChange={e => setHackathon(e.target.value)}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "11px", fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-3)", marginBottom: "8px" }}>
                    Problem Statement <span style={{ color: "var(--pastel-purple)" }}>*</span>
                  </label>
                  <textarea
                    className="field"
                    placeholder="Describe the problem you're solving, the target users, and the impact..."
                    style={{ height: "180px" }}
                    value={challenge}
                    onChange={e => setChallenge(e.target.value)}
                  />
                </div>

                {/* Error + Submit */}
                {error && (
                  <div style={{ marginBottom: "16px", padding: "12px 16px", background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.2)", color: "#fca5a5", fontSize: "13px", display: "flex", gap: "8px", alignItems: "center", borderRadius: "4px" }}>
                    <span>⚠</span><span>{error}</span>
                  </div>
                )}
                <button id="generate-btn" onClick={handleSubmit} disabled={!challenge.trim()} className="btn btn-primary" style={{ width: "100%", padding: "14px", fontSize: "13px", justifyContent: "center" }}>
                  <span>◆</span> Begin Step-by-Step Analysis
                </button>
                <p style={{ textAlign: "center", marginTop: "12px", fontSize: "10px", color: "var(--text-3)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                  10 Agents · You Control Each Step · Full Strategy
                </p>
              </div>
            </div>
          </div>
        </section>

      </main>
    </>
  );
}
