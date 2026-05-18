"use client";

export default function Glyph({ type }) {
  if (type === "actividad" || type === "actividades") {
    return (
      <svg viewBox="0 0 64 64" fill="none">
        <rect x="6" y="22" width="22" height="22" rx="4" fill="#fff" stroke="#1f150b" strokeWidth="2.5" />
        <rect x="20" y="8" width="22" height="22" rx="4" fill="#F397C1" stroke="#1f150b" strokeWidth="2.5" />
        <rect x="34" y="22" width="22" height="22" rx="4" fill="#fff" stroke="#1f150b" strokeWidth="2.5" />
        <rect x="20" y="36" width="22" height="22" rx="4" fill="#fff" stroke="#1f150b" strokeWidth="2.5" />
      </svg>
    );
  }
  if (type === "documento" || type === "documents") {
    return (
      <svg viewBox="0 0 64 64" fill="none">
        <path d="M14 8 H40 L52 20 V56 H14 Z" fill="#fff" stroke="#1f150b" strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M40 8 V20 H52" fill="none" stroke="#1f150b" strokeWidth="2.5" strokeLinejoin="round" />
        <line x1="22" y1="32" x2="44" y2="32" stroke="#1f150b" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="22" y1="40" x2="44" y2="40" stroke="#1f150b" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="22" y1="48" x2="36" y2="48" stroke="#1f150b" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 64 64" fill="none">
      <rect x="6" y="10" width="52" height="44" rx="8" fill="#fff" stroke="#1f150b" strokeWidth="2.5" />
      <path d="M26 22 L42 32 L26 42 Z" fill="#1f150b" />
    </svg>
  );
}
