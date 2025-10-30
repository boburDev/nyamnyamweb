import { Footer } from "@/components/footer";
import { Header } from "@/components/header";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="pb-20 pt-2 md:pb-0 md:pt-0">
      <Header />
      {children}
      <Footer />
    </div>
  );
}
