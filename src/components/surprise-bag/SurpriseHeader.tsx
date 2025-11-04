import { ArrowRightIcon } from "@/assets/icons";
import { useRouter } from "@/i18n/navigation";
import { TFunction } from "@/utils/i18n";

interface Props {
  title: string;
  catalog?: string;
  type: string;
  length?: number;
  t: TFunction
}
export const SurpriseHeader = ({ title, catalog, type, length, t }: Props) => {
  const router = useRouter();
  const handleGo = () => {
    if (catalog) {
      router.push({
        pathname: `/surprise-bag/`,
        query: {
          catalog: catalog,
          type: type,
        },
      });
    } else {
      router.push({
        pathname: `/surprise-bag/`,
        query: {
          type: type,
        },
      });
    }
  };
  return (
    <div className="flex justify-between md:items-end mb-5 xl:mb-10">
      <h1 className="page-title">{title}</h1>
      {length && length > 3 && (
        <button
          onClick={handleGo}
          className="flex items-center sm:gap-[7px] text-mainColor font-medium text-[13px] sm:text-base xl:text-xl"
        >
          <span className="hidden md:block">{t("seeMore")}</span> <span className="block md:hidden">{t("seeMore-2")}</span>
          <span>
            <ArrowRightIcon className="size-4 xl:size-6 hidden sm:block" />
          </span>
        </button>
      )}
    </div>
  );
};

export default SurpriseHeader;
