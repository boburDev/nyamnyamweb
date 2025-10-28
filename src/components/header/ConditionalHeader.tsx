import Header from "./Header";

interface ConditionalHeaderProps {
  children: React.ReactNode;
  pathname: string;
}

export const ConditionalHeader = ({ children, pathname }: ConditionalHeaderProps) => {
  const pagesWithoutMainHeader = ["/notification", "/profile"];
  const shouldShowMainHeader = !pagesWithoutMainHeader.some(page =>
    pathname.includes(page)
  );

  return (
    <>
      {shouldShowMainHeader && <Header />}
      {children}
    </>
  );
};

export default ConditionalHeader;
