import { SignupForm } from "@/components/auth/signup-form";

export const metadata = {
  title: "Sign Up - STYLISH",
  description: "Create a new STYLISH account",
};

export default function SignupPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center p-4 relative">
      <SignupForm />
    </div>
  );
}
