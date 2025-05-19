import { toast } from "@/lib/utils";

export type ToastProps = {
  title: string;
  description?: string;
  variant?: "default" | "destructive";
};

export function useToast() {
  const showToast = (props: ToastProps) => {
    const { title, description, variant = "default" } = props;

    if (variant === "destructive") {
      return toast.error(description || title);
    }

    return toast.success(title);
  };

  return {
    toast: showToast,
  };
}
