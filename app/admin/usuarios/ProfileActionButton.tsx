"use client";

export default function ProfileActionButton({ label, confirmMessage }: { label: string; confirmMessage: string }) {
  return <button type="submit" onClick={(event) => { if (!window.confirm(confirmMessage)) event.preventDefault(); }} style={{ border: "1px solid #d6a29d", color: "#8c1d18", background: "#fff", padding: "10px 12px", fontWeight: 700, cursor: "pointer" }}>{label}</button>;
}
