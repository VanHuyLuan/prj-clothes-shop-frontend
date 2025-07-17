"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion/dist/framer-motion";

import { CategoryCard } from "@/components/ui/category-card";

export function CategorySection() {
  const categories = ["Women", "Men", "Kids", "Accessories"];
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <section
      id="categories"
      className="relative w-full overflow-hidden py-12 md:py-24 lg:py-32"
    >
      {/* Background */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-background via-muted/50 to-background" />

      <div className="mx-auto max-w-screen-xl relative z-10 px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isLoaded ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="flex flex-col items-center justify-center space-y-4 text-center"
        >
          <div className="space-y-2">
            <div className="inline-flex items-center justify-center space-x-2">
              <span className="h-px w-8 bg-primary"></span>
              <span className="text-sm font-medium uppercase tracking-wider text-primary">
                Collections
              </span>
              <span className="h-px w-8 bg-primary"></span>
            </div>
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
              Shop by Category
            </h2>
            <p className="max-w-[700px] text-muted-foreground md:text-xl">
              Find exactly what you&apos;re looking for in our wide selection of
              categories.
            </p>
          </div>
        </motion.div>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isLoaded ? "visible" : "hidden"}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8"
        >
          {categories.map((category) => (
            <motion.div key={category} variants={itemVariants}>
              <CategoryCard category={category} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
