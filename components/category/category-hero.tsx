"use client";

import Image from "next/image";
import { MotionDiv } from "@/components/providers/motion-provider";

interface CategoryHeroProps {
  title: string;
  description: string;
  image: string;
  category: string;
  isSale?: boolean;
}

export function CategoryHero({
  title,
  description,
  image,
  category,
  isSale = false,
}: CategoryHeroProps) {
  return (
    <section className="relative w-full overflow-hidden h-[40vh] md:h-[50vh] flex items-center">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={image || "/placeholder.svg"}
          alt={title}
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent z-10" />
      </div>

      {isSale && (
        <div className="absolute top-10 right-10 z-20 rotate-12">
          <div className="bg-red-500 text-white text-xl md:text-3xl font-bold px-6 py-3 rounded-full">
            UP TO 70% OFF
          </div>
        </div>
      )}

      <div className="mx-auto max-w-screen-xl relative z-20 px-4 md:px-6 w-full">
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {title}
          </h1>
          <p className="text-white/80 text-lg md:text-xl max-w-xl">
            {description}
          </p>
        </MotionDiv>
      </div>
    </section>
  );
}
