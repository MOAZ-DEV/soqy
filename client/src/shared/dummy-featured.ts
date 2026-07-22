import { slidesType } from "@/components/featured";

export const DUMMY_FEATURED: slidesType[] = [
    {
        id: "slide-001",
        title: "Winter Collection",
        imageSrc: "/images/featured/clay-banks-HVZCsMB3rc4-unsplash(1).jpg",
        ctaBtns: [
            { title: "Shop Now", url: "/collection/winter" },
            { title: "View Lookbook", url: "/lookbook/pants-jeans", varient: "outline" }
        ]
    },
    {
        id: "slide-002",
        title: "Streetwear Drop",
        imageSrc: "/images/featured/kevin-dolan-1rFIUPAfNbk-unsplash.jpg",
        ctaBtns: [
            { title: "Explore", url: "/collection/pants-jeans" }
        ]
    },
    {
        id: "slide-003",
        title: "Best Sellers",
        imageSrc: "/images/featured/leoon-liang-ffHd5sB6338-unsplash.jpg",
        ctaBtns: [
            { title: "View Products", url: "/collection/pants-jeans" },
            { title: "All Products", url: "/collection/pants-jeans", varient: "secondary" }
        ]
    }
];
