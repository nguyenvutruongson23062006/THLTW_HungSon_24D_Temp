"use client";

import { useState } from "react";
import Image from "next/image";

export default function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const [selected, setSelected] = useState(images[0]);

  return (
    <div>
      <div className="relative aspect-square overflow-hidden rounded-xl border bg-white">
        <Image src={selected} alt={name} fill priority sizes="(max-width: 768px) 100vw, 50vw" className="object-contain p-4" />
      </div>
      {images.length > 1 && (
        <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
          {images.map((src, index) => (
            <button
              key={src}
              type="button"
              onClick={() => setSelected(src)}
              aria-label={`Xem ảnh ${index + 1} của ${name}`}
              aria-pressed={selected === src}
              className={`relative h-20 w-24 shrink-0 overflow-hidden rounded-lg border-2 bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400 ${selected === src ? "border-blue-500" : "border-gray-200"}`}
            >
              <Image src={src} alt={`${name} - ảnh ${index + 1}`} fill sizes="96px" className="object-contain p-1" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
