import Image from "next/image";
import Link from "next/link";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export const metadata = {
  title: "Forgot Password - STYLISH",
  description: "Reset your STYLISH account password",
};

export default function ForgotPasswordPage() {
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
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-black/60" />
      </div>

      {/* Left side – brand text */}
      <div className="relative z-10 hidden lg:flex lg:w-1/2 flex-col justify-between p-14">
        <Link href="/" className="text-white text-2xl font-bold tracking-widest uppercase">
          STYLISH
        </Link>
        <div className="space-y-5">
          <span className="inline-block rounded-full bg-white/10 border border-white/20 backdrop-blur-sm px-4 py-1.5 text-xs font-medium text-white/80 uppercase tracking-widest">
            Account Recovery
          </span>
          <h2 className="text-6xl font-bold text-white leading-tight">
            Reset Your<br />Password
          </h2>
          <p className="text-white/60 text-sm max-w-xs leading-relaxed">
            No worries — enter your email and we'll send you a link to get back in.
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
          <ForgotPasswordForm />
        </div>
      </div>
    </div>
  );
}
