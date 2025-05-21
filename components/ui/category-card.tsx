"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

interface CategoryCardProps {
  category: string;
}

export function CategoryCard({ category }: CategoryCardProps) {
  const categoryPath = category.toLowerCase();

  return (
    <Link
      href={`/client/${categoryPath}`}
      className="group block"
      prefetch={true}
    >
      <motion.div
        whileHover={{ scale: 1.03 }}
        transition={{ duration: 0.2 }}
        className="relative h-[200px] w-full overflow-hidden rounded-xl shadow-lg will-change-transform"
      >
        <Image
          src={`/images/categories/${categoryPath}.jpg`}
          alt={category}
          fill
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-xl font-bold text-white">{category}</h3>
          <motion.div
            className="flex items-center text-sm text-white/90"
            whileHover={{ x: 5 }}
            transition={{ duration: 0.2 }}
          >
            Shop now{" "}
            <ChevronRight className="ml-1 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </motion.div>
        </div>
      </motion.div>
    </Link>
  );
}
