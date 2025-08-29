export const productData = [
    {
        category: "Super boxlar",
        categoryId: 2,
        products: [
            {
                id: 1,
                name: "Vero Bowl",
                image: "/productimg.png",
                restaurant: "Vero TRUE FOOD",
                distance: 1.2,
                currentPrice: "12 000 so'm",
                originalPrice: "18.000",
                rating: 5.0,
                categoryId: 2,
                stock: 2,
                isBookmarked: false,
                isInCart: false
            },
            {
                id: 14,
                name: "Vero Bowl",
                image: "/productimg.png",
                restaurant: "Vero TRUE FOOD",
                distance: 1.2,
                currentPrice: "12 000 so'm",
                originalPrice: "18.000",
                rating: 5.0,
                categoryId: 2,
                stock: 2,
                isBookmarked: false,
                isInCart: false
            },
            {
                id: 5,
                name: "Premium Box",
                image: "/productimg.png",
                restaurant: "Luxury Foods",
                distance: 3.0,
                currentPrice: "25 000 so'm",
                originalPrice: "35.000",
                rating: 5.0,
                categoryId: 2,
                stock: 1,
                isBookmarked: true,
                isInCart: false
            },
            {
                id: 9,
                name: "Family Box",
                image: "/productimg.png",
                restaurant: "Family Restaurant",
                distance: 2.8,
                currentPrice: "45 000 so'm",
                originalPrice: "60.000",
                rating: 4.9,
                categoryId: 2,
                stock: 3,
                isBookmarked: false,
                isInCart: false
            },
        ]
    },
    {
        category: "Taomlar",
        categoryId: 3,
        products: [
            {
                id: 10,
                name: "Grilled Salmon",
                image: "/productimg.png",
                restaurant: "Ocean Delights",
                distance: 3.2,
                currentPrice: "35 000 so'm",
                originalPrice: "45.000",
                rating: 4.7,
                categoryId: 3,
                stock: 4,
                isBookmarked: false,
                isInCart: false
            },
            {
                id: 6,
                name: "Pasta Carbonara",
                image: "/productimg.png",
                restaurant: "Italian Corner",
                distance: 1.8,
                currentPrice: "22 000 so'm",
                originalPrice: "28.000",
                rating: 4.7,
                categoryId: 3,
                stock: 4,
                isBookmarked: false,
                isInCart: false
            },
            {
                id: 15,
                name: "Healthy Salad",
                image: "/productimg.png",
                restaurant: "Fresh Kitchen",
                distance: 0.8,
                currentPrice: "15 000 so'm",
                originalPrice: "20.000",
                rating: 4.8,
                categoryId: 3,
                stock: 5,
                isBookmarked: true,
                isInCart: true
            },
            {
                id: 2,
                name: "Healthy Salad",
                image: "/productimg.png",
                restaurant: "Fresh Kitchen",
                distance: 0.8,
                currentPrice: "15 000 so'm",
                originalPrice: "20.000",
                rating: 4.8,
                categoryId: 3,
                stock: 5,
                isBookmarked: true,
                isInCart: true
            },
        ]
    },
    {
        category: "Fast food",
        categoryId: 4,
        products: [
            {
                id: 3,
                name: "Burger Deluxe",
                image: "/productimg.png",
                restaurant: "Fast Food Express",
                distance: 2.1,
                currentPrice: "18 000 so'm",
                originalPrice: "25.000",
                rating: 4.5,
                categoryId: 4,
                stock: 8,
                isBookmarked: false,
                isInCart: false
            },
            {
                id: 16,
                name: "Burger Deluxe",
                image: "/productimg.png",
                restaurant: "Fast Food Express",
                distance: 2.1,
                currentPrice: "18 000 so'm",
                originalPrice: "25.000",
                rating: 4.5,
                categoryId: 4,
                stock: 8,
                isBookmarked: false,
                isInCart: false
            },
            {
                id: 7,
                name: "Pizza Margherita",
                image: "/productimg.png",
                restaurant: "Pizza Palace",
                distance: 2.5,
                currentPrice: "30 000 so'm",
                originalPrice: "40.000",
                rating: 4.6,
                categoryId: 4,
                stock: 6,
                isBookmarked: false,
                isInCart: false
            },
            {
                id: 11,
                name: "Chicken Wings",
                image: "/productimg.png",
                restaurant: "Wing Stop",
                distance: 1.6,
                currentPrice: "20 000 so'm",
                originalPrice: "28.000",
                rating: 4.4,
                categoryId: 4,
                stock: 7,
                isBookmarked: false,
                isInCart: false
            },
        ]
    },
    {
        category: "Shirinliklar",
        categoryId: 5,
        products: [
            {
                id: 4,
                name: "Chocolate Cake",
                image: "/productimg.png",
                restaurant: "Sweet Dreams",
                distance: 1.5,
                currentPrice: "8 000 so'm",
                originalPrice: "12.000",
                rating: 4.9,
                categoryId: 5,
                stock: 3,
                isBookmarked: false,
                isInCart: false
            },
            {
                id: 12,
                name: "Ice Cream Sundae",
                image: "/productimg.png",
                restaurant: "Frozen Delights",
                distance: 1.1,
                currentPrice: "6 000 so'm",
                originalPrice: "9.000",
                rating: 4.5,
                categoryId: 5,
                stock: 5,
                isBookmarked: false,
                isInCart: false
            },
            {
                id: 13,
                name: "Ice Cream Sundae",
                image: "/productimg.png",
                restaurant: "Frozen Delights",
                distance: 1.1,
                currentPrice: "6 000 so'm",
                originalPrice: "9.000",
                rating: 4.5,
                categoryId: 5,
                stock: 5,
                isBookmarked: false,
                isInCart: false
            },
            {
                id: 8,
                name: "Tiramisu",
                image: "/productimg.png",
                restaurant: "Dolce Vita",
                distance: 1.9,
                currentPrice: "10 000 so'm",
                originalPrice: "15.000",
                rating: 4.8,
                categoryId: 5,
                stock: 2,
                isBookmarked: true,
                isInCart: false
            },
        ]
    }
];

// Helper function to get all products
export const getAllProducts = () => {
    return productData.flatMap(category => category.products);
};

// Helper function to get products by category ID
export const getProductsByCategoryId = (categoryId: number) => {
    const category = productData.find(cat => cat.categoryId === categoryId);
    return category ? category.products : [];
};

// Helper function to get category name by ID
export const getCategoryNameById = (categoryId: number) => {
    const category = productData.find(cat => cat.categoryId === categoryId);
    return category ? category.category : '';
};
