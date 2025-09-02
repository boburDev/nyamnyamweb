import { Loader2 } from "lucide-react";

export function SubmitLoader() {
  return (
    <div className="flex items-center gap-1">
      <Loader2 className="mr-2 animate-spin" />
      <span>Yuklanmoqda...</span>
    </div>
  );
}
