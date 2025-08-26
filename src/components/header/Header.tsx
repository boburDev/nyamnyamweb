import { Link } from "@/i18n/navigation";
import { Container } from "../container";
import SearchMenu from "./SearchMenu";
import HeaderRight from "./HeaderRight";
import { cookies } from "next/headers";
import { TOKEN } from "@/constants";

export const Header = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get(TOKEN);
  const isAuthenticated = !!token;
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
          <SearchMenu  auth={isAuthenticated}/>
        </div>
        {/* right */}
        <HeaderRight auth={isAuthenticated} />
      </Container>
    </header>
  );
};

export default Header;
