import { LocationMenu } from "../menu";

const HeaderRight = () => {
  return (
    <div className="flex items-center gap-[15px] ml-[39px] shrink-0">
      {/* location menu */}
      <LocationMenu />
    </div>
  );
};

export default HeaderRight;
