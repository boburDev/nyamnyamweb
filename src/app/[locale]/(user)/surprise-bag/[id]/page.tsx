import Image from "next/image";
import { Container } from "@/components/container";
import { getSurpriseBagById } from "@/api";

interface PageProps {
  params: Promise<{ locale: string; id: string }>;
}

export default async function SurpriseBagDetailPage({ params }: PageProps) {
  const { locale, id } = await params;

  const data = await getSurpriseBagById({ id, locale });

  // ❌ Agar ma'lumot topilmasa — 404 emas, shunchaki bo‘sh chiqsin
  if (!data) return <div className="text-center py-10">Ma'lumot topilmadi</div>;

  return (
    <Container>
      <div className="max-w-3xl mx-auto py-10">
        <div className="relative w-full h-[300px] rounded-2xl overflow-hidden">
          <Image
            src={data.image || "/placeholder.png"}
            alt={data.name || "Surprise Bag"}
            fill
            className="object-cover"
          />
        </div>

        <h1 className="text-3xl font-semibold mt-6">{data.name}</h1>

        <p className="text-gray-600 mt-3 leading-relaxed">
          {data.description || "Tavsif mavjud emas."}
        </p>

        <div className="mt-5 flex items-center justify-between border-t pt-4">
          <span className="text-lg font-medium">
            Narxi: <b>{data.price} so‘m</b>
          </span>
          <button className="bg-primary text-white px-5 py-2 rounded-xl hover:opacity-90">
            Savatga qo‘shish
          </button>
        </div>
      </div>
    </Container>
  );
}
