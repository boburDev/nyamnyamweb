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
    <div className="flex justify-between items-center  mb-10">
      <h1 className="page-title">{title}</h1>
      {length && length > 3 && (
        <button
          onClick={handleGo}
          className="flex items-center gap-[7px] text-mainColor font-medium text-xl"
        >
          Ko'proq ko'rish
          <span>
            <ArrowRightIcon />
          </span>
        </button>
      )}
    </div>
  );
};

export default SurpriseHeader;
