"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion/dist/framer-motion";

import { Button } from "@/components/ui/button";

export function HeroSection() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <section className="relative w-full overflow-hidden py-12 md:py-24 lg:py-32">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://pos.nvncdn.com/fa2431-2286/bn/20250422_xrDxd1pA.gif"
          alt="Background"
          fill
          className="object-cover object-center brightness-[0.85] transition-transform duration-[30000ms] hover:scale-110"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-transparent z-10" />
      </div>

      <div className="mx-auto max-w-screen-xl relative z-20 px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col justify-center space-y-6"
          >
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isLoaded ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <span className="inline-block rounded-full bg-primary/30 px-6 py-2 text-sm font-medium text-white backdrop-blur-md border border-white/10 shadow-lg hover:bg-primary/40 transition-all duration-300">
                  New Collection 2025
                </span>
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={isLoaded ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.4 }}
                className="text-5xl font-bold tracking-tighter sm:text-6xl xl:text-7xl/none text-white"
              >
                Discover Your{" "}
                <span className="text-primary-foreground bg-primary px-3 rounded-lg shadow-lg hover:shadow-primary/30 transition-all duration-300">
                  Style
                </span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={isLoaded ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.5 }}
                className="max-w-[600px] text-white/90 md:text-xl leading-relaxed"
              >
                Shop the latest trends in fashion with our new collection.
                Quality materials, stylish designs, and affordable prices.
              </motion.p>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isLoaded ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.6 }}
              className="flex flex-col gap-4 min-[400px]:flex-row"
            >
              <Link href="#featured">
                <Button
                  size="lg"
                  className="bg-primary px-10 py-6 text-lg shadow-lg transition-all duration-300 hover:translate-y-[-2px] hover:shadow-xl hover:bg-primary/90"
                >
                  Shop Now
                </Button>
              </Link>
              <Link href="#collections">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/30 bg-white/10 text-white backdrop-blur-md px-10 py-6 text-lg transition-all duration-300 hover:bg-white/20 hover:border-white/50"
                >
                  View Collections
                </Button>
              </Link>
            </motion.div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isLoaded ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 1, delay: 0.3 }}
            className="relative h-[300px] md:h-[400px] lg:h-[500px] w-full overflow-hidden rounded-3xl shadow-2xl"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-black/30 to-transparent z-10" />
            <Image
              src="https://pos.nvncdn.com/fa2431-2286/album/20250417_LZDdKSEp.png"
              alt="Hero Image"
              fill
              className="object-cover transition-transform duration-[30000ms] hover:scale-110"
              priority
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
