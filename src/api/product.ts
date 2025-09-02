import { getAllProducts, getProductsByCategoryId } from "@/data/product-data";

export interface Product {
    id: number;
    name: string;
    image: string;
    restaurant: string;
    distance: number;
    currentPrice: string;
    originalPrice: string;
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

// Simulate API delay for loading states
const simulateDelay = (ms: number = 400) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getProducts(categoryId?: number): Promise<Product[]> {
    await simulateDelay(400);

    if (categoryId && categoryId !== 1) {
        return getProductsByCategoryId(categoryId);
    }

    return getAllProducts();
}

// New function to get all categories with their products
export async function getAllProductCategories(): Promise<ProductCategory[]> {
    await simulateDelay(300);

    const { productData } = await import("@/data/product-data");
    return productData;
}

// Function to prefetch all product data
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

// Function to get products by category with loading simulation
export async function getProductsByCategory(categoryId: number): Promise<Product[]> {
    await simulateDelay(200);
    return getProductsByCategoryId(categoryId);
}
