import { notFound } from "next/navigation";
import { Container } from "@/components/container";
import { ProductCard } from "@/components/card";
import Image from "next/image";
import { formatPrice } from "@/utils/price-format";
import { getProductById, getRelatedProducts } from "@/api/product";

interface PageProps {
    params: Promise<{ id: string; locale: string }>
}

export default async function ProductDetailPage({ params }: PageProps) {
    const { id } = await params;
    const product = await getProductById(id);
    if (!product) return notFound();

    const related = product.categoryId
        ? await getRelatedProducts(product.categoryId, product.id)
        : [];

    return (
        <Container>
            <div className="mt-[100px] pb-[120px]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="relative w-full h-[320px] md:h-[420px]">
                        <Image
                            src={product.cover_image || "/productimg.png"}
                            alt={product.title}
                            fill
                            className="object-cover rounded-2xl"
                        />
                    </div>
                    <div>
                        <h1 className="text-3xl font-semibold text-textColor mb-3">{product.title}</h1>
                        <p className="text-dolphin mb-4">
                            {product.business_name}
                            {product.branch_name ? ` • ${product.branch_name}` : ""}
                        </p>
                        <div className="flex items-center gap-3 mb-6">
                            <span className="text-mainColor text-2xl font-semibold">
                                {formatPrice(product.price_in_app)}
                            </span>
                            {product.original_price && (
                                <span className="text-dolphin line-through">
                                    {formatPrice(product.original_price)}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {related.length > 0 && (
                    <div className="mt-14">
                        <h2 className="page-title mb-6">O'xshash superboxlar</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {related.map((item) => (
                                <ProductCard key={item.id} item={item} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </Container>
    );
}


