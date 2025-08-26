import { LanguageIcon } from "@/assets/icons";
import { Button } from "../ui/button";

export const LanguageMenu = () => {
  return (
    <div>
      <Button variant={"outline"} className="h-12 rounded-full w-12">
        <LanguageIcon />
      </Button>
    </div>
  );
};

export default LanguageMenu;
