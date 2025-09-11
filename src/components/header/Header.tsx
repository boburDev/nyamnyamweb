import { Link } from "@/i18n/navigation";
import { Container } from "../container";
import SearchMenu from "./SearchMenu";
import HeaderRight from "./HeaderRight";
import { getAuthStatus } from "@/lib/auth";

export const Header = async () => {
  const isAuth = await getAuthStatus();

  return (
    <header className="py-6 ">
      <Container className="flex justify-between items-center">
        {/* logo */}
        <div className="flex-0">
          <Link href={"/"} className="text-[36px] font-semibold text-mainColor">
            Logo
          </Link>
        </div>
        {/*search */}
        <div className="flex flex-1">
          <SearchMenu auth={isAuth} />
        </div>
        {/* right */}
        <HeaderRight auth={isAuth} />
      </Container>
    </header>
  );
};

export default Header;
