"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, ArrowLeft, Lock, CheckCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/lib/hooks/use-toast";
import { API_BASE_URL as API_BASE } from "@/lib/api";

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();

  const token = searchParams.get("token") ?? "";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!token) {
      toast({
        title: "Link không hợp lệ",
        description: "Vui lòng yêu cầu đặt lại mật khẩu lại.",
        variant: "destructive",
      });
    }
  }, [token, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword.length < 8) {
      toast({ title: "Mật khẩu quá ngắn", description: "Mật khẩu phải có ít nhất 8 ký tự.", variant: "destructive" });
      return;
    }
    if (newPassword !== confirmPassword) {
      toast({ title: "Mật khẩu không khớp", description: "Vui lòng kiểm tra lại.", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/identities/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.message || "Token không hợp lệ hoặc đã hết hạn.");
      }

      setDone(true);
    } catch (err: any) {
      toast({ title: "Đặt lại mật khẩu thất bại", description: err.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="w-full space-y-6 text-center">
        <Lock className="w-12 h-12 text-destructive mx-auto" />
        <h1 className="text-2xl font-bold">Link không hợp lệ</h1>
        <p className="text-sm text-muted-foreground">Link đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.</p>
        <Link href="/forgot-password">
          <Button className="w-full">Yêu cầu link mới</Button>
        </Link>
      </div>
    );
  }

  if (done) {
    return (
      <div className="w-full space-y-6 text-center">
        <div className="w-14 h-14 rounded-full bg-black dark:bg-white flex items-center justify-center mx-auto">
          <CheckCircle className="w-7 h-7 text-white dark:text-black" />
        </div>
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">Đặt lại thành công!</h1>
          <p className="text-sm text-muted-foreground">Mật khẩu của bạn đã được cập nhật. Hãy đăng nhập lại.</p>
        </div>
        <Link href="/login">
          <Button className="w-full">Đăng nhập</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full space-y-7">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          Đặt lại mật khẩu
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Nhập mật khẩu mới cho tài khoản của bạn
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-1.5">
          <Label htmlFor="new-password" className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Mật khẩu mới
          </Label>
          <div className="relative">
            <Input
              id="new-password"
              type={showPassword ? "text" : "password"}
              placeholder="Ít nhất 8 ký tự"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="h-11 pr-10 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:border-black dark:focus:border-white focus:ring-0 focus-visible:ring-0 text-sm transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="confirm-password" className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Xác nhận mật khẩu
          </Label>
          <Input
            id="confirm-password"
            type="password"
            placeholder="Nhập lại mật khẩu mới"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="h-11 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:border-black dark:focus:border-white focus:ring-0 focus-visible:ring-0 text-sm transition-colors"
          />
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h-11 bg-black hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-100 text-white font-semibold text-sm uppercase tracking-widest rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Đang xử lý...
            </>
          ) : (
            "Đặt lại mật khẩu"
          )}
        </Button>
      </form>

      <Link
        href="/login"
        className="flex items-center justify-center gap-1.5 text-sm text-gray-500 hover:text-black dark:hover:text-white transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Quay lại đăng nhập
      </Link>

      <p className="text-center text-xs text-gray-400 flex items-center justify-center gap-1">
        <Lock className="w-3 h-3" />
        Secured with 256-bit SSL encryption
      </p>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-10">
        <Suspense fallback={<div className="flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>}>
          <ResetPasswordContent />
        </Suspense>
      </div>
    </div>
  );
}
