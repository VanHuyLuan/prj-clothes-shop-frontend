import { LoginForm } from "@/components/auth/login-form";

export const metadata = {
  title: "Login - STYLISH",
  description: "Login to your STYLISH account",
};

export default function LoginPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center p-4 relative">
      <LoginForm />
    </div>
  );
}
