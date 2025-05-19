"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

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
          className="object-cover object-center brightness-[0.85]"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent z-10" />
      </div>

      <div className="mx-auto max-w-screen-xl relative z-20 px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col justify-center space-y-4"
          >
            <div className="space-y-2">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isLoaded ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <span className="inline-block rounded-full bg-primary/20 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-sm">
                  New Collection 2025
                </span>
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={isLoaded ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.4 }}
                className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-white"
              >
                Discover Your{" "}
                <span className="text-primary-foreground bg-primary px-2 rounded">
                  Style
                </span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={isLoaded ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.5 }}
                className="max-w-[600px] text-white/80 md:text-xl"
              >
                Shop the latest trends in fashion with our new collection.
                Quality materials, stylish designs, and affordable prices.
              </motion.p>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isLoaded ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.6 }}
              className="flex flex-col gap-2 min-[400px]:flex-row"
            >
              <Link href="#featured">
                <Button
                  size="lg"
                  className="bg-primary px-8 shadow-lg transition-all duration-300 hover:translate-y-[-2px] hover:shadow-xl"
                >
                  Shop Now
                </Button>
              </Link>
              <Link href="#collections">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/30 bg-white/10 text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/20"
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
            className="relative h-[300px] md:h-[400px] lg:h-[500px] w-full overflow-hidden rounded-2xl shadow-2xl"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent z-10" />
            <Image
              src="/placeholder.svg?height=1080&width=1920"
              alt="Hero Image"
              fill
              className="object-cover transition-transform duration-10000 hover:scale-110"
              priority
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
