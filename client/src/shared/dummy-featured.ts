import { slidesType } from "@/components/featured";

export const DUMMY_FEATURED: slidesType[] = [
    {
        id: "slide-001",
        title: "Winter Collection",
        imageSrc: "/images/featured/winter.jpg",
        ctaBtns: [
            { title: "Shop Now", url: "/collection/winter" },
            { title: "View Lookbook", url: "/lookbook/winter", varient: "outline" }
        ]
    },
    {
        id: "slide-002",
        title: "Streetwear Drop",
        imageSrc: "/images/featured/streetwear.jpg",
        ctaBtns: [
            { title: "Explore", url: "/collection/streetwear" }
        ]
    },
    {
        id: "slide-003",
        title: "Best Sellers",
        imageSrc: "/images/featured/bestsellers.jpg",
        ctaBtns: [
            { title: "View Products", url: "/best-sellers" },
            { title: "All Products", url: "/products", varient: "secondary" }
        ]
    }
];
