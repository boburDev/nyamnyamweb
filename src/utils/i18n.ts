import { useTranslations } from "next-intl";

export type TFunction<Namespace extends string = never> = ReturnType<
  typeof useTranslations<Namespace>
>;
