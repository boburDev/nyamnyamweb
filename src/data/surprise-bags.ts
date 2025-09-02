export interface SurpriseBag {
    id: string;
    name: string;
    restaurant: string;
    distance: string;
    pickupTime: string;
    originalPrice: number;
    discountedPrice: number;
    rating: number;
    remainingCount: number;
    coords: [number, number];
    image: string;
    category: string;
}

export const surpriseBags: SurpriseBag[] = [
    {
        id: "1",
        name: "Suprise bag",
        restaurant: "Oqtepa lavash",
        distance: "1.2 km",
        pickupTime: "Olib ketish vaqti: 9:00-23:00 oraligida",
        originalPrice: 18000,
        discountedPrice: 12000,
        rating: 5.0,
        remainingCount: 2,
        coords: [41.349467, 69.178196],
        image: "/productimg.png",
        category: "Hamma"
    },
    {
        id: "2",
        name: "Suprise bag",
        restaurant: "KFC",
        distance: "0.8 km",
        pickupTime: "Olib ketish vaqti: 10:00-22:00 oraligida",
        originalPrice: 20000,
        discountedPrice: 15000,
        rating: 5.0,
        remainingCount: 1,
        coords: [41.326734, 69.330799],
        image: "/productimg.png",
        category: "Hamma"
    },
    {
        id: "3",
        name: "Suprise bag",
        restaurant: "Beshqozon",
        distance: "2.1 km",
        pickupTime: "Olib ketish vaqti: 8:00-24:00 oraligida",
        originalPrice: 16000,
        discountedPrice: 11000,
        rating: 5.0,
        remainingCount: 3,
        coords: [41.347665, 69.285371],
        image: "/productimg.png",
        category: "Taomlar"
    },
    {
        id: "4",
        name: "Suprise bag",
        restaurant: "Bursa",
        distance: "1.5 km",
        pickupTime: "Olib ketish vaqti: 9:00-23:00 oraligida",
        originalPrice: 22000,
        discountedPrice: 17000,
        rating: 5.0,
        remainingCount: 1,
        coords: [41.334713, 69.216639],
        image: "/productimg.png",
        category: "Hamma"
    },
    {
        id: "5",
        name: "Suprise bag",
        restaurant: "Miranamandi",
        distance: "0.9 km",
        pickupTime: "Olib ketish vaqti: 10:00-22:00 oraligida",
        originalPrice: 19000,
        discountedPrice: 14000,
        rating: 5.0,
        remainingCount: 2,
        coords: [41.318649, 69.241679],
        image: "/productimg.png",
        category: "Fast food"
    },
    {
        id: "6",
        name: "Suprise bag",
        restaurant: "Zohid kebab",
        distance: "1.7 km",
        pickupTime: "Olib ketish vaqti: 9:00-23:00 oraligida",
        originalPrice: 17000,
        discountedPrice: 12000,
        rating: 5.0,
        remainingCount: 1,
        coords: [41.321798, 69.193404],
        image: "/productimg.png",
        category: "Super box"
    },
    {
        id: "7",
        name: "Suprise bag",
        restaurant: "Feed Up",
        distance: "1.3 km",
        pickupTime: "Olib ketish vaqti: 8:00-24:00 oraligida",
        originalPrice: 21000,
        discountedPrice: 16000,
        rating: 5.0,
        remainingCount: 2,
        coords: [41.328693, 69.196945],
        image: "/productimg.png",
        category: "Hamma"
    },
    {
        id: "8",
        name: "Suprise bag",
        restaurant: "Oqtepa Lavash",
        distance: "2.5 km",
        pickupTime: "Olib ketish vaqti: 9:00-23:00 oraligida",
        originalPrice: 18000,
        discountedPrice: 13000,
        rating: 5.0,
        remainingCount: 1,
        coords: [41.349467, 69.178196],
        image: "/productimg.png",
        category: "Fast food"
    }
];
