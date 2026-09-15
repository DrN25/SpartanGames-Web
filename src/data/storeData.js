export const STORE_INFO = {
  name: "SPARTAN GAMES",
  tagline: "High-End Gaming & Hardware Store",
  location: "C.C. Compuplaza - Octavio Muñoz Najar 223, Int. 116, Arequipa, Perú",
  phones: ["912930004", "973696367"],
  socials: {
    facebook: "https://facebook.com/spartangamesaqp",
    instagram: "https://instagram.com/spartangamesaqp/",
    tiktok: "https://tiktok.com/@spartangamesaqp",
    whatsapp: "https://wa.me/51912930004"
  },
  perks: [
    "Servicio de DELIVERY en todo Arequipa y envíos nacionales",
    "Equipos con Sistema Operativo y Programas listos para usar",
    "Garantía oficial de hasta 1 año en todos los componentes",
    "Pagos con Tarjeta (Visa, Mastercard, Amex), Yape/Plin y Reserva 10%"
  ]
};

export const CATEGORIES = [
  {
    id: "laptops",
    name: "Laptops Gamer",
    icon: "Laptop",
    count: 60,
    subcategories: [
      { id: "asus-rog", name: "ASUS ROG / TUF", count: 15 },
      { id: "lenovo-loq", name: "Lenovo Legion & LOQ", count: 24 },
      { id: "acer-nitro", name: "Acer Nitro & Predator", count: 7 },
      { id: "hp-victus", name: "HP Omen & Victus", count: 7 },
      { id: "msi-gaming", name: "MSI Gaming Series", count: 7 }
    ]
  },
  {
    id: "computadoras",
    name: "PCs y Componentes",
    icon: "Cpu",
    count: 85,
    subcategories: [
      { id: "procesadores", name: "Procesadores (Intel & AMD Ryzen)", count: 22 },
      { id: "placas-madre", name: "Motherboards (B650, Z790, B760)", count: 18 },
      { id: "memoria-ram", name: "Memorias RAM (DDR4 y DDR5)", count: 16 },
      { id: "tarjetas-video", name: "Tarjetas Gráficas (RTX 40 Series / Radeon)", count: 14 },
      { id: "almacenamiento", name: "Discos SSD M.2 NVMe Gen4", count: 15 }
    ]
  },
  {
    id: "monitores",
    name: "Monitores Gaming",
    icon: "Monitor",
    count: 28,
    subcategories: [
      { id: "monitores-2k-240hz", name: "Monitores 2K QHD (240Hz / 255Hz)", count: 8 },
      { id: "monitores-curvos", name: "Monitores Curvos 165Hz", count: 12 },
      { id: "monitores-4k", name: "Monitores 4K IPS Pro", count: 8 }
    ]
  },
  {
    id: "perifericos",
    name: "Periféricos & Streaming",
    icon: "Headphones",
    count: 45,
    subcategories: [
      { id: "teclados-mecanicos", name: "Teclados Mecánicos RGB", count: 15 },
      { id: "mouse-gaming", name: "Mouse Ultralight 8KHz", count: 12 },
      { id: "auriculares", name: "Auriculares 7.1 Espacial", count: 10 },
      { id: "microfonos", name: "Micrófonos Condensador & Brazos", count: 8 }
    ]
  }
];

export const MAIN_PRODUCT = {
  id: 115,
  name: "CORSAIR VENGEANCE RGB 16GB DDR5 6400MHz",
  category: "Memorias RAM",
  brand: "Corsair",
  price: 989.10,
  originalPrice: 1099.00,
  discount: 10,
  stock: 6,
  isPromo: true,
  specs: [
    "16 GB DDR5",
    "6400 MHz",
    "CL32 Ultra-Low Latency",
    "RGB iCUE Dynamic",
    "Intel XMP 3.0 & AMD EXPO",
    "Disipador de Aluminio Anodizado"
  ],
  images: [
    "/assets/images/spartan_games_anuncio_1.jpg",
    "/assets/images/spartan_games_anuncio_2.jpg",
    "/assets/images/spartan_games_banner.jpg"
  ],
  description: "Memoria RAM de alto rendimiento optimizada para placas madre DDR5 de última generación Intel Core 14va y AMD Ryzen 7000/9000. Iluminación RGB direccionable dinámica de diez zonas por módulo controlada por el software iCUE de Corsair. Overclocking de fábrica verificado."
};

export const RELATED_PRODUCTS = [
  {
    id: 123,
    name: "Laptop ASUS ROG Strix G16 i7-13650HX RTX 4060 165Hz",
    category: "Laptops Gamer",
    brand: "ASUS ROG",
    price: 5490.00,
    originalPrice: 5890.00,
    discount: 7,
    stock: 3,
    isPromo: true,
    specs: ["16\" WUXGA 165Hz", "i7-13650HX", "RTX 4060 8GB", "16GB DDR5", "512GB SSD"],
    image: "/assets/images/spartan_games_anuncio_2.jpg"
  },
  {
    id: 124,
    name: "Monitor ASUS ROG Swift 27\" 2K 255Hz Fast IPS 0.3ms G-Sync",
    category: "Monitores Gaming",
    brand: "ASUS ROG",
    price: 1890.00,
    originalPrice: 2090.00,
    discount: 10,
    stock: 2,
    isPromo: true,
    specs: ["27\" 2K QHD", "255Hz Fast IPS", "0.3ms G-Sync", "DisplayHDR 400"],
    image: "/assets/images/spartan_games_anuncio_1.jpg"
  },
  {
    id: 114,
    name: "Kingston Fury Beast RGB 16GB DDR5 5600MHz White",
    category: "Memorias RAM",
    brand: "Kingston",
    price: 1044.00,
    originalPrice: 1099.00,
    discount: 5,
    stock: 4,
    isPromo: false,
    specs: ["16GB DDR5", "5600MHz", "RGB Sync", "Color Blanco"],
    image: "/assets/images/spartan_games_logo_base.png"
  },
  {
    id: 112,
    name: "Tarjeta de Video MSI GeForce RTX 4070 SUPER 12GB Ventus 2X",
    category: "PCs y Componentes",
    brand: "MSI",
    price: 3290.00,
    originalPrice: 3490.00,
    discount: 6,
    stock: 2,
    isPromo: true,
    specs: ["12GB GDDR6X", "DLSS 3.5", "Dual Fan", "Ray Tracing"],
    image: "/assets/images/spartan_games_anuncio_1.jpg"
  }
];

export const PC_BUILDER_STEPS = [
  { id: 1, name: "Procesador (CPU)", required: true, icon: "Cpu", desc: "Intel Core o AMD Ryzen" },
  { id: 2, name: "Placa Madre (Motherboard)", required: true, icon: "CircuitBoard", desc: "Chipset compatible con CPU" },
  { id: 3, name: "Memoria RAM", required: false, icon: "Cpu", desc: "DDR4 o DDR5 en Dual Channel" },
  { id: 4, name: "Tarjeta Gráfica (GPU)", required: false, icon: "Tv", desc: "GeForce RTX o AMD Radeon" },
  { id: 5, name: "Almacenamiento (SSD)", required: false, icon: "HardDrive", desc: "M.2 NVMe de alta velocidad" },
  { id: 6, name: "Gabinete (Case)", required: false, icon: "Box", desc: "Flujo de aire y cristal templado" },
  { id: 7, name: "Fuente de Poder (PSU)", required: false, icon: "Zap", desc: "Certificación 80 Plus Bronce/Gold" },
  { id: 8, name: "Refrigeración", required: false, icon: "Wind", desc: "Disipador por aire o Watercooling" },
  { id: 9, name: "Monitor", required: false, icon: "Monitor", desc: "Frecuencia de refresco 144Hz a 255Hz" },
  { id: 10, name: "Teclado & Mouse", required: false, icon: "Gamepad2", desc: "Switches mecánicos y sensor óptico" },
  { id: 11, name: "Audio / Headset", required: false, icon: "Headphones", desc: "Sonido envolvente para eSports" }
];
