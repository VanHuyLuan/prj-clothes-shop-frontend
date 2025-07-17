import { motion } from "framer-motion/dist/framer-motion";
import Image from "next/image";

interface CategoryHeaderProps {
  title: string;
  description: string;
  imageUrl: string;
}

export function CategoryHeader({
  title,
  description,
  imageUrl,
}: CategoryHeaderProps) {
  return (
    <div className="relative w-full h-[300px] md:h-[400px] overflow-hidden">
      <Image
        src={imageUrl}
        alt={title}
        fill
        className="object-cover brightness-[0.85]"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
      <div className="absolute inset-0 flex items-center">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {title}
            </h1>
            <p className="text-white/80 text-lg md:text-xl">{description}</p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
