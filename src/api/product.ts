import { getAllProducts, getProductsByCategoryId } from "@/data/product-data";

export interface Product {
    id: string;
    // canonical fields used by newer API
    cover_image?: string;
    title?: string;
    business_name?: string;
    branch_name?: string;
    price_in_app?: number;
    price?: number;
    currency?: string;
    rating?: number;
    distance?: number;
    categoryId?: number;
    coords?: number[];
    original_price?: number;

    // legacy aliases kept for backward compatibility with many components
    name?: string;
    image?: string;
    restaurant?: string;
    currentPrice?: number;
    originalPrice?: number;
    isInCart?: boolean;
    stock?: number;

    // UI helpers
    isBookmarked?: boolean;
}

// Legacy product/category shapes from src/data/product-data.ts
type LegacyProduct = {
    id: string;
    name?: string;
    image?: string;
    restaurant?: string;
    distance?: number;
    currentPrice?: number;
    originalPrice?: number;
    coords?: number[];
    rating?: number;
    categoryId?: number;
    stock?: number;
    isInCart?: boolean;
};

type LegacyCategory = {
    category: string;
    categoryId: number;
    products: LegacyProduct[];
};

export interface ProductCategory {
    category: string;
    categoryId: number;
    products: Product[];
}

const simulateDelay = (ms: number = 400) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getProducts(categoryId?: number): Promise<Product[]> {
    await simulateDelay(400);

    if (categoryId && categoryId !== 1) {
        return getProductsByCategoryId(categoryId).map(mapLegacyProductToProduct);
    }

    return getAllProducts().map(mapLegacyProductToProduct);
}

export async function getAllProductCategories(): Promise<ProductCategory[]> {
    await simulateDelay(300);

    const { productData } = await import("@/data/product-data");
    // Map legacy category products to the new Product shape
    return (productData as LegacyCategory[]).map((cat) => ({
        category: cat.category,
        categoryId: cat.categoryId,
        products: cat.products.map(mapLegacyProductToProduct)
    }));
}

export async function prefetchAllProducts(): Promise<{
    allProducts: Product[];
    categories: ProductCategory[];
}> {
    await simulateDelay(500);

    const allProducts = getAllProducts().map(mapLegacyProductToProduct);
    const { productData } = await import("@/data/product-data");

    return {
        allProducts,
        categories: (productData as LegacyCategory[]).map((cat) => ({
            category: cat.category,
            categoryId: cat.categoryId,
            products: cat.products.map(mapLegacyProductToProduct)
        }))
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
    return getProductsByCategoryId(categoryId).map(mapLegacyProductToProduct);
}

// Mapper: convert legacy product object from src/data/product-data.ts
// to the requested Product interface shape. Also keep legacy fields
// on the returned object for backward compatibility with components
// that haven't been migrated yet.
export const mapLegacyProductToProduct = (p: LegacyProduct): Product => {
    // treat p as a flexible record to read potential legacy keys without using `any`
    const rec = p as unknown as Record<string, unknown>;

    const getField = <T>(...keys: string[]): T | undefined => {
        for (const k of keys) {
            if (rec[k] !== undefined) return rec[k] as T;
        }
        return undefined;
    };

    const cover = getField<string>("image", "cover_image") ?? "/productimg.png";
    const title = getField<string>("name", "title") ?? "";
    const business = getField<string>("restaurant", "business_name") ?? "";
    const price = Number(getField<number | string>("currentPrice", "price_in_app") ?? 0);
    const original = getField<number>("originalPrice", "original_price");
    const branch = getField<string>("branch_name") ?? "";
    const currency = getField<string>("currency") ?? "UZS";
    const categoryId = typeof p.categoryId === "number" ? p.categoryId : undefined;

    return {
        id: String(p.id),
        cover_image: cover,
        title,
        business_name: business,
        branch_name: branch,
        price_in_app: price,
        currency,
        categoryId,
        rating: typeof p.rating === "number" ? p.rating : undefined,
        stock: typeof p.stock === "number" ? p.stock : undefined,
        distance: typeof p.distance === "number" ? p.distance : undefined,
        original_price: original,
        // keep legacy aliases for backwards compatibility
        name: p.name,
        image: p.image,
        restaurant: p.restaurant,
        currentPrice: p.currentPrice,
        originalPrice: p.originalPrice,
        coords: p.coords,
        isInCart: p.isInCart,
    };
};

// Single product fetch by id
export async function getProductById(id: string): Promise<Product | null> {
    await simulateDelay(200);
    const all = getAllProducts().map(mapLegacyProductToProduct);
    return all.find(p => p.id === id) ?? null;
}

// Related products by category (excluding the given product id if provided)
export async function getRelatedProducts(categoryId: number, excludeId?: string): Promise<Product[]> {
    const items = await getProductsByCategory(categoryId);
    return excludeId ? items.filter(p => p.id !== excludeId) : items;
}
