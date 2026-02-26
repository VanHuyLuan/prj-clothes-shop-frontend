import Image from "next/image";
import Link from "next/link";
import { LoginForm } from "@/components/auth/login-form";

export const metadata = {
  title: "Login - STYLISH",
  description: "Login to your STYLISH account",
};

export default function LoginPage() {
  return (
    <div className="relative min-h-screen w-full flex">
      {/* Full-screen background image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://pos.nvncdn.com/fa2431-2286/bn/20250422_xrDxd1pA.gif"
          alt="STYLISH Fashion"
          fill
          className="object-cover object-center"
          priority
        />
        {/* Gradient overlay: dark on left, lighter on right */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-black/60" />
      </div>

      {/* Left side – brand text */}
      <div className="relative z-10 hidden lg:flex lg:w-1/2 flex-col justify-between p-14">
        <Link href="/" className="text-white text-2xl font-bold tracking-widest uppercase">
          STYLISH
        </Link>
        <div className="space-y-5">
          <span className="inline-block rounded-full bg-white/10 border border-white/20 backdrop-blur-sm px-4 py-1.5 text-xs font-medium text-white/80 uppercase tracking-widest">
            New Collection 2026
          </span>
          <h2 className="text-6xl font-bold text-white leading-tight">
            Discover<br />Your Style
          </h2>
          <p className="text-white/60 text-sm max-w-xs leading-relaxed">
            Quality materials, stylish designs, and affordable prices — all in one place.
          </p>
        </div>
        <p className="text-white/30 text-xs">&copy; 2025 STYLISH. All rights reserved.</p>
      </div>

      {/* Right side – form panel */}
      <div className="relative z-10 w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md bg-white/95 dark:bg-gray-950/95 backdrop-blur-md rounded-2xl shadow-2xl p-8 sm:p-10">
          {/* Mobile logo */}
          <div className="lg:hidden mb-6">
            <Link href="/" className="text-xl font-bold tracking-widest uppercase">
              STYLISH
            </Link>
          </div>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
