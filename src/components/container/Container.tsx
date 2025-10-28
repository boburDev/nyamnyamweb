import { cn } from "@/lib/utils";

interface Props {
  children?: React.ReactNode;
  className?: string;
}
export const Container = ({ children, className }: Props) => {
  return (
    <div
      className={cn(
        "w-full px-4 sm:px-5 xl:px-7.5 mx-auto max-w-[860px] xl:max-w-[1280px] ",
        className
      )}
    >
      {children}
    </div>
  );
};

export default Container;
