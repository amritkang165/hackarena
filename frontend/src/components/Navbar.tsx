"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function Navbar() {
  const path = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <nav className="navbar">
      <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none" }}>
          <div style={{
            width: "28px", height: "28px",
            background: "var(--pastel-purple)",
            borderRadius: "4px",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 0 12px rgba(200, 182, 240, 0.3)",
          }}>
            <span style={{ fontSize: "12px", fontWeight: 800, color: "#fff", fontFamily: "var(--font-display)" }}>ex</span>
          </div>
          <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "15px", letterSpacing: "-0.02em", color: "var(--text-1)" }}>
            Hacker
          </span>
        </Link>

        <div className="hide-mobile" style={{ display: "flex", alignItems: "center", gap: "2px" }}>
          {[
            { href: "/", label: "Home" },
            { href: "/generate", label: "New Project" },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              style={{
                padding: "6px 14px",
                fontSize: "13px",
                fontWeight: 500,
                color: path === href ? "var(--text-1)" : "var(--text-3)",
                textDecoration: "none",
                borderRadius: "4px",
                background: path === href ? "var(--surface-2)" : "transparent",
                transition: "all 0.15s",
              }}
            >
              {label}
            </Link>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <button
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            aria-label="Toggle theme"
            className="btn-ghost"
            style={{
              padding: "6px 10px",
              fontSize: "14px",
              lineHeight: 1,
              border: "1px solid var(--border-mid)",
              background: "transparent",
              color: "var(--text-2)",
              cursor: "pointer",
              borderRadius: "var(--r-sm)",
              transition: "all 0.15s",
            }}
          >
            {mounted && theme === "light" ? "🌙" : "☀️"}
          </button>
          <Link href="/generate" className="btn btn-primary" style={{ textDecoration: "none", padding: "8px 18px", fontSize: "12px" }}>
            <span style={{ fontSize: "10px" }}>◆</span>
            New Project
          </Link>
        </div>
      </div>
    </nav>
  );
}
