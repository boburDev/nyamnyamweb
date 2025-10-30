import { Link } from "@/i18n/navigation";
import { Container } from "../container";
import SearchMenu from "./SearchMenu";
import HeaderRight from "./HeaderRight";
import { getAuthStatus } from "@/lib/auth";
import { dehydrate, QueryClient } from "@tanstack/react-query";
import Providers from "../provider/Provider";
import { getCart } from "@/api";
import { LogoIcon } from "@/assets/icons";
import { MobileHeader } from "./MobileHeader";

export const Header = async () => {
  const isAuth = await getAuthStatus();
  const queryClient = new QueryClient();
  if (isAuth) {
    await queryClient.prefetchQuery({
      queryKey: ["cart"],
      queryFn: getCart,
    });
  }

  return (
    <>
      <header className="py-6 hidden lg:block">
        <Container className="flex justify-between items-center">
          <div className="flex-0">
            <Link href={"/"} className="text-[36px] font-semibold text-mainColor">
              <LogoIcon className="h-10 xl:h-auto" />
            </Link>
          </div>
          <div className="flex flex-1">
            <SearchMenu auth={isAuth} />
          </div>
          <Providers dehydratedState={dehydrate(queryClient)}>
            <HeaderRight auth={isAuth} />
          </Providers>
        </Container>
      </header>
      <MobileHeader isAuth={isAuth} />
    </>
  );
};

export default Header;
