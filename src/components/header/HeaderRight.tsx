"use client";
import { LanguageMenu, LocationMenu, NotificationMenu } from "../menu";
import { Button } from "../ui/button";
import { CartIcon, UserIcon, UserProfile } from "@/assets/icons";
import { useRouter } from "@/i18n/navigation";

const HeaderRight = ({ auth }: { auth: boolean }) => {
  const router = useRouter();

  return (
    <div className="flex items-center gap-4 ml-10 shrink-0">
      <LocationMenu />
      <div className="flex gap-2">
        <NotificationMenu />
        <LanguageMenu />
      </div>

      {auth ? (
        <div className="flex items-center gap-4">
          <Button className="w-[170px]" onClick={() => router.push("/cart")}>
            <CartIcon />
            256,000 UZS
          </Button>
          <Button variant="outline" className="w-12 h-12 bg-plaster">
            <UserProfile/>
          </Button>
        </div>
      ) : (
        <div className="flex gap-4 items-center">
          <Button
            variant="secondary"
            className="w-[174px] h-12 px-5 font-medium text-sm"
          >
            Biznes uchun kirish
          </Button>
          <Button
            onClick={() => router.push("/signin")}
            className="w-[114px] h-12 px-5 font-medium text-sm"
          >
            <UserIcon />
            Kirish
          </Button>
        </div>
      )}
    </div>
  );
};

export default HeaderRight;
