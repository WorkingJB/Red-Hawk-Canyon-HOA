/** Simple canyon-and-sun mark used in the header, footer, and favicon. */
export function Logo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true" focusable="false">
      <circle cx="16" cy="16" r="16" fill="currentColor" />
      <circle cx="16" cy="13" r="4.5" fill="#fde7c9" />
      <path d="M0 22 L8 15 L13 19 L19 12 L25 18 L32 14 V32 H0 Z" fill="#fde7c9" opacity="0.35" />
      <path d="M0 26 L7 21 L12 24 L18 19 L24 23 L32 20 V32 H0 Z" fill="#fde7c9" opacity="0.8" />
    </svg>
  );
}
