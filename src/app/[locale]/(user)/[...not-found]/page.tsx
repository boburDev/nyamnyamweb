import { Container } from "@/components/container";
import { Link } from "@/i18n/navigation";

export default function Notfound() {
  return (
    <div className="pt-[145px] pb-[117px]">
      <Container className="flex flex-col items-center">
        <h1 className="text-mainColor text-[100px] font-semibold mb-[30px]">
          404
        </h1>
        <h3 className="text-textColor font-medium text-[40px] mb-[15px]">
          Voy! Sahifa topilmadi
        </h3>
        <p className="flex flex-col items-center text-dolphin text-lg gap-[5px]">
          Birorta ham taom yo'q joyga borganga o'xshaysiz.
          <span>
            Lekin tashvishlanmang - asosiy sahifada sizni mazali takliflar
            kutmoqda!
          </span>
        </p>
        <Link
          href="/"
          className="mt-[30px] bg-mainColor py-[9px] px-[10px] rounded-[20px] text-white"
        >
          Bosh sahifaga qaytish
        </Link>
      </Container>
    </div>
  );
}
