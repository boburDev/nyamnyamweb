import { getAllProducts, getProductsByCategoryId } from "@/data/product-data";

export interface Product {
    id: string;
    name: string;
    image: string;
    restaurant: string;
    distance: number;
    currentPrice: number;
    originalPrice: number;
    rating: number;
    categoryId: number;
    stock?: number;
    isBookmarked?: boolean;
    isInCart?: boolean;
    coords?: number[];
}

export interface ProductCategory {
    category: string;
    categoryId: number;
    products: Product[];
}

const simulateDelay = (ms: number = 400) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getProducts(categoryId?: number): Promise<Product[]> {
    await simulateDelay(400);

    if (categoryId && categoryId !== 1) {
        return getProductsByCategoryId(categoryId);
    }

    return getAllProducts();
}

export async function getAllProductCategories(): Promise<ProductCategory[]> {
    await simulateDelay(300);

    const { productData } = await import("@/data/product-data");
    return productData;
}

export async function prefetchAllProducts(): Promise<{
    allProducts: Product[];
    categories: ProductCategory[];
}> {
    await simulateDelay(500);

    const allProducts = getAllProducts();
    const { productData } = await import("@/data/product-data");

    return {
        allProducts,
        categories: productData
    };
}


export const buildRequestBody = (cartItems: { id: string; quantity: number }[]) => {
    return {
        items: cartItems.map(item => ({
            surprise_bag: item.id, // product id
            quantity: item.quantity // cart ichidagi miqdor
        }))
    }
};

export const buildFavouriteRequestBody = (favouriteItems: Array<string | number | { id?: string | number; surprise_bag?: string | number }>) => {
    return {
        items: favouriteItems.map(item => ({
            surprise_bag: typeof item === "string" || typeof item === "number" ? item : (item.surprise_bag ?? item.id)
        }))
    }
};

// Function to get products by category with loading simulation
export async function getProductsByCategory(categoryId: number): Promise<Product[]> {
    await simulateDelay(200);
    return getProductsByCategoryId(categoryId);
}
