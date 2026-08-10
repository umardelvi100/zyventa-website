"use client";

import { useState } from "react";
import Image from "next/image";

export type GalleryPhoto = {
  src: string;
  label: string;
};

export function ProductGallery({
  photos,
  productName,
}: {
  photos: GalleryPhoto[];
  productName: string;
}) {
  const [active, setActive] = useState(0);

  return (
    <div className="flex flex-col gap-3">
      {/* Main image */}
      <div className="relative aspect-square w-full overflow-hidden rounded-3xl bg-neutral-100">
        <Image
          key={active}
          src={photos[active].src}
          alt={`${productName} — ${photos[active].label}`}
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover transition-opacity duration-300"
          priority={active === 0}
        />
        <span className="absolute bottom-4 left-4 rounded-full bg-black/50 px-3 py-1 text-xs font-medium text-white backdrop-blur">
          {photos[active].label}
        </span>
        <span className="absolute right-4 top-4 rounded-full bg-black/40 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur">
          {active + 1} / {photos.length}
        </span>
      </div>

      {/* Thumbnails */}
      <div className="grid grid-cols-6 gap-2">
        {photos.map((photo, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={`relative aspect-square overflow-hidden rounded-xl border-2 transition ${
              i === active
                ? "border-indigo-600 shadow-md shadow-indigo-200"
                : "border-transparent hover:border-slate-300"
            }`}
            title={photo.label}
          >
            <Image
              src={photo.src}
              alt={photo.label}
              fill
              sizes="80px"
              className="object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
