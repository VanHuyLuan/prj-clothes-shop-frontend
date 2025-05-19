import { LoginForm } from "@/components/auth/login-form";

export const metadata = {
  title: "Login - STYLISH",
  description: "Login to your STYLISH account",
};

export default function LoginPage() {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <LoginForm />
    </div>
  );
}
