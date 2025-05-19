import { SignupForm } from "@/components/auth/signup-form";

export const metadata = {
  title: "Sign Up - STYLISH",
  description: "Create a new STYLISH account",
};

export default function SignupPage() {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <SignupForm />
    </div>
  );
}
