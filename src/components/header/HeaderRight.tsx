"use client";
import useStore from "@/context/store";
import { LanguageMenu, LocationMenu, NotificationMenu } from "../menu";
import { Button } from "../ui/button";
import { CartIcon, UserIcon } from "@/assets/icons";
import { useRouter } from "@/i18n/navigation";

const HeaderRight = () => {
  const auth = useStore((state) => state.auth);
  console.log("auth", auth);
  const router = useRouter();

  const handleGo = () => {
    router.push("/signin");
  };

  const handleGoCart = () => {
    router.push("/cart");
  };

  return (
    <div className="flex items-center gap-[15px] ml-[39px] shrink-0">
      {/* location menu */}
      <LocationMenu />
      <div className="flex gap-[10px]">
        {/* notification */}
        <NotificationMenu />
        {/* language */}
        <LanguageMenu />
      </div>
      {/* cart */}
      {auth && (
        <div>
          <Button onClick={handleGoCart}>
            <span>
              <CartIcon />
            </span>
            256,000 UZS
          </Button>
        </div>
      )}
      {/* login */}
      {!auth && (
        <div className="flex gap-[15px] items-center">
          <Button
            variant={"secondary"}
            className="w-[174px] h-12 px-5 font-medium text-sm "
          >
            Biznes uchun kirish
          </Button>
          <Button
            onClick={handleGo}
            className="w-[114px] h-12 px-5 font-medium text-sm "
          >
            <span>
              <UserIcon />
            </span>
            Kirish
          </Button>
        </div>
      )}
    </div>
  );
};

export default HeaderRight;
