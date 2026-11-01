import { Eye, EyeOff } from "lucide-react";
import { forwardRef, useState, type InputHTMLAttributes } from "react";
import { Input } from "@/components/ui/input";
import { useTranslation } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";

export const PasswordInput = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(function PasswordInput(
  { className, ...props },
  ref,
) {
  const [show, setShow] = useState(false);
  const { t } = useTranslation();
  return (
    <div className="relative">
      <Input ref={ref} type={show ? "text" : "password"} className={cn("h-12 rounded-xl pr-12 text-base", className)} {...props} />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        aria-label={show ? t.auth.hidePw : t.auth.showPw}
        className="absolute right-1 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-lg text-muted-foreground hover:bg-surface hover:text-navy"
      >
        {show ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
      </button>
    </div>
  );
});
