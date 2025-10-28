import { ArrowRightIcon } from "@/assets/icons";
import { useRouter } from "@/i18n/navigation";

interface Props {
  title: string;
  catalog?: string;
  type: string;
  length?: number;
}
export const SurpriseHeader = ({ title, catalog, type, length }: Props) => {
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
    <div className="flex justify-between items-end mb-5 xl:mb-10">
      <h1 className="page-title">{title}</h1>
      {length && length > 3 && (
        <button
          onClick={handleGo}
          className="flex items-center gap-[7px] text-mainColor font-medium xl:text-xl"
        >
          Ko'proq ko'rish
          <span>
            <ArrowRightIcon className="size-4 xl:size-6"/>
          </span>
        </button>
      )}
    </div>
  );
};

export default SurpriseHeader;
