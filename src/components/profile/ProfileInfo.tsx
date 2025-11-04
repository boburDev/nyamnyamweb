import { EditIcon, ProfileLogout } from "@/assets/icons";
import { Button } from "../ui/button";
import { TFunction } from "@/utils/i18n";
import { UserData } from "@/types";
import { userData } from "@/data";
import { useRouter } from "@/i18n/navigation";
import { useQueryClient } from "@tanstack/react-query";

interface Props {
  t: TFunction;
  t2: TFunction;
  user: UserData;
  setEditMode: (value: boolean) => void;
}

export const ProfileInfo = ({ t, t2, user, setEditMode }: Props) => {
  const filteredData = userData.filter((key) => key !== "password");
  const router = useRouter();
  const qc = useQueryClient();
  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (e) {
      console.error("Logout request failed", e);
    }

    qc.clear();
    router.refresh();
  };
  return (
    <div className="pt-5 3xl:pt-[19px] p-5 3xl:px-[30px] border border-plasterColor rounded-[20px] bg-white shadow-sm">
      <div className="flex justify-between items-center pb-[27px] 3xl:pb-[19px] border-b border-input">
        <h3 className="font-medium text-[18px] 3xl:text-[22px] text-textColor">
          {t("about-title")}
        </h3>
        <Button
          variant="outline"
          className="font-medium text-sm !text-dolphin h-11 w-[149px]"
          onClick={() => setEditMode(true)}
        >
          <span>
            <EditIcon className="size-[18px]" />
          </span>
          {t("edit")}
        </Button>
      </div>

      <div className="pt-[34px] 3xl:pb-[42px]">
        {[0, 1].map((row) => (
          <div key={row} className="grid md:grid-cols-3 gap-5 3xl:gap-10 mb-5 3xl:mb-20">
            {filteredData.slice(row * 3, row * 3 + 3).map((key) => (
              <div key={key} className="flex flex-col 3xl:gap-2">
                <span className="profile-label">{t(key)}</span>
                <p className="profile-name truncate max-w-[260px] 2xs:max-w-max">{user?.[key] || "-"}</p>
              </div>
            ))}
          </div>
        ))}
      </div>
      <button
        onClick={handleLogout}
        className="md:hidden px-[10px] rounded-[10px] py-[10px] hover:bg-mainColor/5 flex items-center gap-[9px] text-sm text-red ml-auto"
      >
        <span className="pl-1">
          <ProfileLogout className="w-5 h-5" />
        </span>
        {t2("logout")}
      </button>
    </div>
  );
};

export default ProfileInfo;
