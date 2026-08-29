import Image from "next/image";

type BrandProps = {
  href?: string;
  /** Smaller lockup for tight headers */
  compact?: boolean;
};

export function BrandMark({ size = 40 }: { size?: number }) {
  return (
    <Image
      className="brand-mark"
      src="/logo.png"
      alt=""
      width={size}
      height={size}
      aria-hidden="true"
    />
  );
}

export function Brand({ href = "#top", compact = false }: BrandProps) {
  const height = compact ? 40 : 48;
  const width = Math.round(height * 2.4);

  return (
    <a className="brand" href={href} aria-label="Maktab AI home">
      <Image
        className="brand-logo"
        src="/logo.png"
        alt="Maktab AI — Your Voice. Your Opportunity."
        width={width}
        height={height}
        priority
      />
    </a>
  );
}
