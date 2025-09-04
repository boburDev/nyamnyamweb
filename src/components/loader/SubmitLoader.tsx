import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";

export function SubmitLoader() {
  const t = useTranslations("loader")
  return (
    <div className="flex items-center gap-1">
      <Loader2 className="mr-2 animate-spin" />
      <span>{t("submit")}</span>
    </div>
  );
}
