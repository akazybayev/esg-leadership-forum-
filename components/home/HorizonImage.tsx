"use client";

type HorizonImageProps = {
  src: string;
  alt: string;
  className?: string;
  zoom?: boolean;
};

export function HorizonImage({
  src,
  alt,
  className,
  zoom = false,
}: HorizonImageProps) {
  return (
    <span className={className ? `horizon-frame ${className}` : "horizon-frame"}>
      <img
        src={src}
        alt={alt}
        loading="eager"
        decoding="async"
        data-zoom={zoom ? "" : undefined}
        onError={(event) => {
          event.currentTarget.hidden = true;
        }}
      />
    </span>
  );
}
