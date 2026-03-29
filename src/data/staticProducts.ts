import vneckSweater from "@/assets/products/vneck-sweater.png";
import adidasSamba from "@/assets/products/adidas-samba.png";
import zipKnitJacket from "@/assets/products/zip-knit-jacket.png";
import poloCableKnitQuarterZip from "@/assets/products/polo-cable-knit-quarter-zip.png";
import flagSweater from "@/assets/products/flag-sweater.png";
import poloQuarterZipWhite from "@/assets/products/polo-quarter-zip-white.png";
import poloShirtCream from "@/assets/products/polo-shirt-cream.png";
import linenShirtWhite from "@/assets/products/linen-shirt-white.png";
import aviatorSunglasses from "@/assets/products/aviator-sunglasses.png";
import leatherBelt from "@/assets/products/leather-belt.png";
import linenShortsBeige from "@/assets/products/linen-shorts-beige.png";
import classicWatch from "@/assets/products/classic-watch.png";
import linenDressWhite from "@/assets/products/linen-dress-white.png";
import strawHat from "@/assets/products/straw-hat.png";
import suedeLoafers from "@/assets/products/suede-loafers.png";
import canvasTote from "@/assets/products/canvas-tote.png";
import linenBlazer from "@/assets/products/linen-blazer.png";
import silkCamiTop from "@/assets/products/silk-cami-top.png";
import linenPoloBeige from "@/assets/products/linen-polo-beige.png";
import silkScarf from "@/assets/products/silk-scarf.png";

export type Category = "men" | "women" | "accessories";

export interface StaticProduct {
  id: string;
  handle: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  image: string;
  category: Category;
  tags: string[];
  inStock: boolean;
  isNew: boolean;
}

export const staticProducts: StaticProduct[] = [
  // ─── EXISTING PRODUCTS ───
  {
    id: "static-2",
    handle: "oversized-vneck-sweater",
    title: "Oversized V-Neck Sweater",
    description: "Luxuriously soft oversized V-neck sweater with balloon sleeves. Perfect for layering or wearing on its own for an effortlessly chic look.",
    price: 1890,
    currency: "EGP",
    image: vneckSweater,
    category: "women",
    tags: ["knitwear", "sweater", "oversized"],
    inStock: true,
    isNew: true,
  },
  {
    id: "static-3",
    handle: "adidas-samba-navy",
    title: "Adidas Samba OG — Navy",
    description: "The iconic Adidas Samba in deep navy suede with signature three stripes and gold foil branding. A heritage sneaker redefined for modern style.",
    price: 3200,
    currency: "EGP",
    image: adidasSamba,
    category: "men",
    tags: ["sneakers", "shoes", "classic"],
    inStock: true,
    isNew: false,
  },
  {
    id: "static-4",
    handle: "zip-up-knit-jacket",
    title: "Zip-Up Knit Jacket",
    description: "Relaxed-fit ribbed knit jacket with a half-zip collar. Crafted from a soft wool blend for warmth and sophistication.",
    price: 2100,
    currency: "EGP",
    image: zipKnitJacket,
    category: "women",
    tags: ["knitwear", "jacket", "outerwear"],
    inStock: true,
    isNew: false,
  },
  {
    id: "static-5",
    handle: "polo-cable-knit-quarter-zip",
    title: "Polo Cable Knit Quarter-Zip",
    description: "Premium cable-knit quarter-zip sweater in cream. A refined layering piece with the iconic polo horse embroidery.",
    price: 2650,
    currency: "EGP",
    image: poloCableKnitQuarterZip,
    category: "men",
    tags: ["knitwear", "sweater", "classic"],
    inStock: true,
    isNew: true,
  },
  {
    id: "static-6",
    handle: "flag-crewneck-sweater",
    title: "Flag Crewneck Sweater",
    description: "Iconic American flag intarsia-knit crewneck sweater in cream cotton. A heritage piece that celebrates timeless Americana.",
    price: 2900,
    currency: "EGP",
    image: flagSweater,
    category: "men",
    tags: ["knitwear", "sweater", "iconic"],
    inStock: true,
    isNew: true,
  },
  {
    id: "static-7",
    handle: "polo-quarter-zip-jersey",
    title: "Polo Quarter-Zip Jersey",
    description: "Clean white quarter-zip jersey pullover with tonal polo embroidery. Lightweight and versatile for effortless layering.",
    price: 1950,
    currency: "EGP",
    image: poloQuarterZipWhite,
    category: "men",
    tags: ["jersey", "pullover", "minimal"],
    inStock: true,
    isNew: false,
  },

  // ─── SUMMER MEN ───
  {
    id: "static-8",
    handle: "classic-polo-shirt-cream",
    title: "Classic Polo Shirt — Cream",
    description: "A timeless cotton polo in warm cream. Ribbed collar and mother-of-pearl buttons bring quiet luxury to this everyday essential.",
    price: 1450,
    currency: "EGP",
    image: poloShirtCream,
    category: "men",
    tags: ["polo", "summer", "classic"],
    inStock: true,
    isNew: true,
  },
  {
    id: "static-9",
    handle: "lightweight-linen-shirt",
    title: "Lightweight Linen Shirt",
    description: "Breathable pure linen shirt in crisp white. Relaxed fit with a camp collar — the perfect warm-weather staple for refined ease.",
    price: 1750,
    currency: "EGP",
    image: linenShirtWhite,
    category: "men",
    tags: ["linen", "shirt", "summer"],
    inStock: true,
    isNew: true,
  },
  {
    id: "static-10",
    handle: "tailored-linen-shorts",
    title: "Tailored Linen Shorts",
    description: "Elegantly tailored linen shorts in warm beige. A pleated front and clean finish bring sophistication to summer days.",
    price: 1350,
    currency: "EGP",
    image: linenShortsBeige,
    category: "men",
    tags: ["shorts", "linen", "summer"],
    inStock: true,
    isNew: true,
  },
  {
    id: "static-11",
    handle: "linen-polo-knit-beige",
    title: "Linen Polo Knit — Beige",
    description: "Open-weave linen knit polo in soft beige. Lightweight texture and a relaxed silhouette perfect for coastal afternoons.",
    price: 1650,
    currency: "EGP",
    image: linenPoloBeige,
    category: "men",
    tags: ["polo", "linen", "knitwear", "summer"],
    inStock: true,
    isNew: false,
  },
  {
    id: "static-12",
    handle: "unstructured-linen-blazer",
    title: "Unstructured Linen Blazer",
    description: "A refined unstructured blazer in breathable linen. No shoulder pads, no fuss — just effortless summer elegance.",
    price: 3400,
    currency: "EGP",
    image: linenBlazer,
    category: "men",
    tags: ["blazer", "linen", "summer", "outerwear"],
    inStock: true,
    isNew: true,
  },

  // ─── SUMMER WOMEN ───
  {
    id: "static-13",
    handle: "linen-midi-dress-white",
    title: "Linen Midi Dress — White",
    description: "Flowing linen midi dress in pristine white. A cinched waist and gentle A-line skirt create an effortlessly feminine silhouette.",
    price: 2200,
    currency: "EGP",
    image: linenDressWhite,
    category: "women",
    tags: ["dress", "linen", "summer", "midi"],
    inStock: true,
    isNew: true,
  },
  {
    id: "static-14",
    handle: "silk-cami-top-ivory",
    title: "Silk Cami Top — Ivory",
    description: "Delicate silk camisole in soft ivory. Adjustable straps and a draped neckline make this piece as versatile as it is elegant.",
    price: 1290,
    currency: "EGP",
    image: silkCamiTop,
    category: "women",
    tags: ["top", "silk", "summer", "minimal"],
    inStock: true,
    isNew: true,
  },

  // ─── ACCESSORIES ───
  {
    id: "static-15",
    handle: "aviator-sunglasses-gold",
    title: "Aviator Sunglasses — Gold",
    description: "Classic aviator sunglasses with a polished gold frame and gradient brown lenses. UV400 protection meets timeless old-money style.",
    price: 1800,
    currency: "EGP",
    image: aviatorSunglasses,
    category: "accessories",
    tags: ["sunglasses", "aviator", "summer"],
    inStock: true,
    isNew: true,
  },
  {
    id: "static-16",
    handle: "heritage-leather-belt",
    title: "Heritage Leather Belt",
    description: "Hand-stitched Italian leather belt with an antique brass buckle. A quiet statement of quality that ages beautifully.",
    price: 1100,
    currency: "EGP",
    image: leatherBelt,
    category: "accessories",
    tags: ["belt", "leather", "classic"],
    inStock: true,
    isNew: false,
  },
  {
    id: "static-17",
    handle: "classic-dress-watch",
    title: "Classic Dress Watch",
    description: "Minimalist dress watch with a brushed silver case and genuine leather strap. Clean dial, Roman numerals — understated luxury on the wrist.",
    price: 4500,
    currency: "EGP",
    image: classicWatch,
    category: "accessories",
    tags: ["watch", "classic", "leather"],
    inStock: true,
    isNew: true,
  },
  {
    id: "static-18",
    handle: "woven-straw-hat",
    title: "Woven Straw Hat",
    description: "Hand-woven straw hat with a wide brim and grosgrain ribbon band. Essential sun protection with a refined, vacation-ready silhouette.",
    price: 950,
    currency: "EGP",
    image: strawHat,
    category: "accessories",
    tags: ["hat", "straw", "summer"],
    inStock: true,
    isNew: true,
  },
  {
    id: "static-19",
    handle: "suede-driver-loafers",
    title: "Suede Driver Loafers",
    description: "Supple suede driver loafers with hand-stitched moccasin construction. The rubber-studded sole grips effortlessly — from terrace to town.",
    price: 2800,
    currency: "EGP",
    image: suedeLoafers,
    category: "accessories",
    tags: ["shoes", "loafers", "suede", "summer"],
    inStock: true,
    isNew: false,
  },
  {
    id: "static-20",
    handle: "canvas-tote-bag",
    title: "Canvas Tote Bag",
    description: "Sturdy canvas tote with leather trim and reinforced handles. Spacious enough for a day at the market or a weekend escape.",
    price: 1250,
    currency: "EGP",
    image: canvasTote,
    category: "accessories",
    tags: ["bag", "tote", "canvas", "summer"],
    inStock: true,
    isNew: false,
  },
  {
    id: "static-21",
    handle: "silk-scarf-neutral",
    title: "Silk Scarf — Neutral",
    description: "Luxe silk twill scarf in muted neutral tones. Hand-rolled edges and a subtle print make it perfect tied at the neck or on a bag.",
    price: 1400,
    currency: "EGP",
    image: silkScarf,
    category: "accessories",
    tags: ["scarf", "silk", "classic"],
    inStock: true,
    isNew: true,
  },
];

export function getProductsByCategory(category: Category): StaticProduct[] {
  return staticProducts.filter((p) => p.category === category);
}

export function getNewProducts(): StaticProduct[] {
  return staticProducts.filter((p) => p.isNew);
}

export function getProductByHandle(handle: string): StaticProduct | undefined {
  return staticProducts.find((p) => p.handle === handle);
}
