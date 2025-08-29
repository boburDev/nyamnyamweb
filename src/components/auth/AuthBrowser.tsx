import { browserData } from "@/data";

export const AuthBrowser = () => {

  const handleBrowserAuth = (browser: string) => {
    console.log(`Authenticating with ${browser}`);
    
  }
  return (
    <div className="flex items-center justify-center gap-5 mt-[30px]">
      {browserData.map((item) => (
        <button
          key={item.name}
          onClick={() => handleBrowserAuth(item.name)}
          className="bg-borderColor/50 border border-plasterColor rounded-[20px] py-[21px] px-[36px]"
        >
          <item.icon />
        </button>
      ))}
    </div>
  );
};

export default AuthBrowser;
