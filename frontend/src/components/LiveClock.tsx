"use client";

import { useEffect, useState } from "react";

interface LiveClockProps {
  className?: string;
  /** "light" for white text (TopNav), "dark" for gray text (card headers) */
  variant?: "light" | "dark";
}

export function LiveClock({ className = "", variant = "light" }: LiveClockProps) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  if (!now) return null;

  const dateStr = now.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const timeStr = now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const textColor =
    variant === "light"
      ? "rgba(255,255,255,0.85)"
      : "var(--color-text-mid, #6b7280)";

  return (
    <div
      className={`flex flex-col items-end leading-tight select-none ${className}`}
      style={{ fontSize: "12px", color: textColor, fontFamily: "Inter, sans-serif" }}
    >
      <span style={{ fontWeight: 600 }}>{timeStr}</span>
      <span style={{ opacity: 0.75 }}>{dateStr}</span>
    </div>
  );
}
