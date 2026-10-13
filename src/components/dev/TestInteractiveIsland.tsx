import { useState } from 'react';

/**
 * Isolated development-only test fixture verifying React 19 island hydration,
 * keyboard accessibility, and semantic fallback under Astro 5.
 * Excluded from production builds.
 */
export default function TestInteractiveIsland() {
  const [clickCount, setClickCount] = useState(0);

  return (
    <div
      data-testid="test-react-island"
      className="p-5 rounded-[var(--radius-card)] bg-[var(--color-surface)] border border-[var(--color-border-strong)]"
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-mono text-[var(--color-accent)] uppercase tracking-wider">
          React 19 Island // Hydration Test
        </span>
        <span
          data-testid="hydration-status"
          className="text-xs font-mono px-2 py-0.5 rounded-[var(--radius-tag)] bg-[var(--color-surface-alt)] text-[var(--color-fg)]"
        >
          {clickCount === 0 ? 'Hydration Ready' : `Hydrated (${clickCount} clicks)`}
        </span>
      </div>

      <p className="text-sm text-[var(--color-muted)] mb-4 leading-relaxed">
        This island verifies selective client hydration (`client:idle`). The initial markup is
        rendered as accessible server HTML by Astro.
      </p>

      <button
        type="button"
        data-testid="island-increment-btn"
        onClick={() => setClickCount((prev) => prev + 1)}
        className="focus-ring px-4 py-2 rounded-[var(--radius-button)] bg-[var(--color-accent)] text-[var(--color-bg)] font-semibold text-xs transition-colors duration-150 cursor-pointer"
      >
        Click to Verify Hydration State (+1)
      </button>
    </div>
  );
}
