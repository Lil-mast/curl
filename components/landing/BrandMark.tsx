export function BrandMark({ size = 34 }: { size?: number }) {
  return (
    <svg
      className="brand-mark"
      width={size}
      height={size}
      viewBox="0 0 34 34"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="17" cy="17" r="17" fill="currentColor" />
      <rect x="11" y="13" width="2.2" height="8" rx="1.1" fill="#f6f1e8" />
      <rect x="15.9" y="10" width="2.2" height="14" rx="1.1" fill="#f6f1e8" />
      <rect x="20.8" y="13" width="2.2" height="8" rx="1.1" fill="#f6f1e8" />
    </svg>
  );
}

export function Brand({ withWordmark = true }: { withWordmark?: boolean }) {
  return (
    <a className="brand" href="#top" aria-label="Maktab AI home">
      <BrandMark />
      {withWordmark ? (
        <span className="brand-name">
          Maktab <span>AI</span>
        </span>
      ) : null}
    </a>
  );
}
