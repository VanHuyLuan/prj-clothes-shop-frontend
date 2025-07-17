"use client";

import type React from "react";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion/dist/framer-motion";
import { Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function NewsletterSection() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter signup
    console.log("Newsletter signup:", email);
    setEmail("");
  };

  return (
    <section className="relative w-full overflow-hidden py-12 md:py-24 lg:py-32">
      {/* Background gradient */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-background via-muted/50 to-background" />

      <div className="mx-auto max-w-screen-xl relative z-10 px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isLoaded ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="flex flex-col justify-center space-y-4"
          >
            <div className="space-y-2">
              <div className="inline-flex items-center space-x-2">
                <span className="h-px w-8 bg-primary"></span>
                <span className="text-sm font-medium uppercase tracking-wider text-primary">
                  Newsletter
                </span>
              </div>
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                Join Our Newsletter
              </h2>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                Subscribe to get special offers, free giveaways, and
                once-in-a-lifetime deals.
              </p>
            </div>
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-2 min-[400px]:flex-row"
            >
              <Input
                placeholder="Enter your email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="max-w-sm rounded-full border-muted/30 bg-white/80 backdrop-blur-sm focus-visible:ring-primary"
                required
              />
              <Button
                type="submit"
                className="group relative overflow-hidden rounded-full transition-all duration-300 hover:shadow-md"
              >
                <span className="relative z-10 flex items-center">
                  Subscribe
                  <Send className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
                <span className="absolute inset-0 z-0 bg-gradient-to-r from-primary to-primary/80 opacity-100 transition-all duration-300 group-hover:opacity-80"></span>
              </Button>
            </form>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isLoaded ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative h-[300px] overflow-hidden rounded-2xl shadow-xl"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent z-10" />
            <Image
              src="/placeholder.svg?height=600&width=800"
              alt="Newsletter Image"
              fill
              className="object-cover transition-transform duration-10000 hover:scale-110"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
