import { Link } from "@/i18n/navigation";
import { Container } from "../container";
import SearchMenu from "./SearchMenu";

export const Header = () => {
  return (
    <header className="py-6 ">
      <Container className="flex justify-between items-center">
        {/* logo */}
        <div className="mr-[130px] flex-0">
          <Link href={"/"} className="text-[36px] font-semibold text-mainColor">
            Logo
          </Link>
        </div>
        {/*search */}
        <div className="flex flex-2">
          <SearchMenu />
        </div>
        {/* right menu */}
        <div className="flex items-center gap-[15px]">
          {/* location menu */}
        </div>
      </Container>
    </header>
  );
};

export default Header;
