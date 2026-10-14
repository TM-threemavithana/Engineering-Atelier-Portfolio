import { useState, useCallback } from 'react';

export interface CopyEmailProps {
  email: string;
  className?: string;
}

type CopyStatus = 'idle' | 'copied' | 'error';

export default function CopyEmail({ email, className = '' }: CopyEmailProps) {
  const [status, setStatus] = useState<CopyStatus>('idle');

  const handleCopy = useCallback(async () => {
    if (!email) return;

    try {
      if (
        typeof navigator !== 'undefined' &&
        navigator.clipboard &&
        typeof navigator.clipboard.writeText === 'function'
      ) {
        await navigator.clipboard.writeText(email);
        setStatus('copied');
        setTimeout(() => setStatus('idle'), 2500);
        return;
      }

      // Clipboard API unavailable in this context (e.g. non-HTTPS, restricted iframe)
      setStatus('error');
      setTimeout(() => setStatus('idle'), 4000);
    } catch {
      // Permission denied or clipboard write rejected
      setStatus('error');
      setTimeout(() => setStatus('idle'), 4000);
    }
  }, [email]);

  return (
    <div className={`relative inline-flex items-center ${className}`}>
      <button
        type="button"
        onClick={handleCopy}
        aria-label={
          status === 'copied'
            ? 'Email address copied to clipboard'
            : status === 'error'
              ? 'Clipboard copy unavailable. Please use direct Send Email or copy manually.'
              : `Copy email address ${email} to clipboard`
        }
        className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-[var(--radius-button)] font-medium text-sm select-none min-h-[44px] min-w-[44px] transition-all duration-150 motion-reduce:transition-none bg-[var(--color-surface-alt)] border border-[var(--color-border)] text-[var(--color-fg)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[var(--color-focus)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)] cursor-pointer"
      >
        {status === 'copied' ? (
          <>
            <svg
              className="w-4 h-4 text-[var(--color-accent)] shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span className="font-['Space_Grotesk'] text-[var(--color-accent)] font-semibold">
              Copied to Clipboard!
            </span>
          </>
        ) : status === 'error' ? (
          <>
            <svg
              className="w-4 h-4 text-[var(--color-warning)] shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span className="font-['Space_Grotesk'] text-[var(--color-warning)] text-xs font-medium">
              Copy Unavailable
            </span>
          </>
        ) : (
          <>
            <svg
              className="w-4 h-4 text-[var(--color-muted)] shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
              <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
            </svg>
            <span className="font-['Space_Grotesk']">Copy Email Address</span>
          </>
        )}
      </button>

      {/* Screen Reader Live Region */}
      <div role="status" aria-live="polite" className="sr-only">
        {status === 'copied' && 'Email address copied to clipboard.'}
        {status === 'error' &&
          'Clipboard access unavailable. Please use the direct Send Email button or copy manually from the displayed address.'}
      </div>
    </div>
  );
}
