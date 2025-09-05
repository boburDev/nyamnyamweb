import { EditIcon } from "@/assets/icons";
import { Button } from "../ui/button";
import { TFunction } from "@/utils/i18n";
import { UserData } from "@/types";
import { userData } from "@/data";
interface Props {
  t: TFunction;
  user: UserData;
  setEditMode: (value: boolean) => void;
}
export const ProfileInfo = ({ t, user, setEditMode }: Props) => {
  return (
    <div className="pt-[19px] px-[30px] border border-plasterColor rounded-[20px] bg-white shadow-sm ">
      <div className="flex justify-between items-center pb-[19px] border-b border-input">
        <h3 className="font-medium text-[22px] text-textColor">
          {t("about-title")}
        </h3>
        <Button
          variant={"outline"}
          className="font-medium !text-dolphin h-11 w-[149px]"
          onClick={() => setEditMode(true)}
        >
          <span>
            <EditIcon className="size-[18px]" />
          </span>
          {t("edit")}
        </Button>
      </div>
      <div className="pt-[34px] pb-[42px]">
        {[0, 1].map((row) => (
          <div key={row} className="flex gap-10 mb-20">
            {userData.slice(row * 3, row * 3 + 3).map((key) => (
              <div key={key} className="flex flex-col gap-2 min-w-[255px]">
                <span className="profile-label">{t(key)}</span>
                <p className="profile-name">{user?.[key] || "-"}</p>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfileInfo;
