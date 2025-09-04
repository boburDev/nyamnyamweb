import { Link } from "@/i18n/navigation";
import {
  LanguageMenu,
  LocationMenu,
  NotificationMenu,
  UserMenu,
} from "../menu";
import { Button } from "../ui/button";
import { CartIcon, UserIcon } from "@/assets/icons";

const HeaderRight = ({ auth }: { auth: boolean }) => {
  return (
    <div className="flex items-center gap-4 ml-10 shrink-0">
      <LocationMenu />
      <div className="flex gap-2">
        <NotificationMenu />
        <LanguageMenu />
      </div>

      {auth ? (
        <div className="flex items-center gap-4">
          <Button className="w-[170px]">
            <Link href={"/cart"} className="flex">
              <CartIcon />
              256,000 UZS
            </Link>
          </Button>
          <UserMenu />
        </div>
      ) : (
        <div className="flex gap-4 items-center">
          <Button
            variant="secondary"
            className="w-[174px] h-12 px-5 font-medium text-sm"
          >
            Biznes uchun kirish
          </Button>
          <Button className="w-[114px] h-12 px-5 font-medium text-sm">
            <Link href={"/signin"} className="flex">
              <UserIcon />
              Kirish
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
};

export default HeaderRight;
