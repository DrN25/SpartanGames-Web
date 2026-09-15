export const storeInfo = {
  name: "Spartan Games",
  tagline: "Especialistas en Hardware Gamer y Cómputo de Alto Rendimiento",
  city: "Arequipa, Perú",
  address: "Centro Comercial Compuplaza, Tienda 204 - Cercado, Arequipa",
  phones: ["912930004", "973696367"],
  whatsappMain: "51912930004",
  schedule: "Lunes a Sábado: 9:30 AM - 8:30 PM",
  deliveryNote: "Envíos directos en Arequipa Metropolitana y despacho a provincias del Sur del Perú por Olva Courier y Shalom.",
  warrantyPolicy: "Garantía física directa en tienda de 1 a 3 años según componente.",
  legalBookUrl: "/libro-reclamaciones"
};

export const categoriesTree = [
  {
    id: "laptops",
    name: "Laptops Gamer",
    icon: "Laptop",
    count: 14,
    subCategories: ["Lenovo LOQ & Legion", "ASUS ROG & TUF", "Acer Nitro & Predator", "HP Victus & OMEN"]
  },
  {
    id: "ram",
    name: "Memorias RAM",
    icon: "Layers",
    count: 22,
    subCategories: ["DDR5 6000MHz - 6400MHz", "DDR4 3200MHz - 3600MHz", "Kits Dual Channel 32GB", "Memorias para Laptops SODIMM"]
  },
  {
    id: "procesadores",
    name: "Procesadores (CPU)",
    icon: "Cpu",
    count: 18,
    subCategories: ["AMD Ryzen Serie 7000/8000", "AMD Ryzen Serie 5000", "Intel Core 14va Generación", "Intel Core 13va Generación"]
  },
  {
    id: "tarjetas-video",
    name: "Tarjetas de Video (GPU)",
    icon: "Monitor",
    count: 16,
    subCategories: ["NVIDIA GeForce RTX Serie 40", "AMD Radeon RX Serie 7000", "Gama de Entrada Esports", "Modelos OC White Edition"]
  },
  {
    id: "placas-madre",
    name: "Placas Madre",
    icon: "HardDrive",
    count: 15,
    subCategories: ["Socket AM5 (B650 / X670)", "Socket LGA1700 (B760 / Z790)", "Formatos Micro-ATX & Mini-ITX", "Con Wi-Fi 6E Integrado"]
  },
  {
    id: "monitores",
    name: "Monitores Gamer",
    icon: "Monitor",
    count: 12,
    subCategories: ["240Hz / 255Hz Esports", "144Hz - 180Hz 1ms IPS", "Paneles Curvos 2K / WQHD", "Soportes Hidráulicos y Brazos"]
  },
  {
    id: "almacenamiento",
    name: "Almacenamiento SSD",
    icon: "HardDrive",
    count: 19,
    subCategories: ["M.2 NVMe PCIe Gen 4.0", "M.2 NVMe PCIe Gen 3.0", "SSD SATA 2.5\"", "Discos Duros Externos"]
  },
  {
    id: "perifericos",
    name: "Periféricos y Audio",
    icon: "SlidersHorizontal",
    count: 35,
    subCategories: ["Teclados Mecánicos", "Mouse Ópticos 1K/8K Hz", "Auriculares 7.1 Espaciales", "Mousepads XL Speed/Control"]
  }
];

export const productsCatalog = [
  {
    id: 115,
    name: "CORSAIR VENGEANCE RGB 16GB DDR5 6400MHz",
    brand: "Corsair",
    category: "Memorias RAM",
    categoryId: "ram",
    price: 989.10,
    oldPrice: 1099.00,
    stock: 6,
    sku: "CMH16GX5M1B6400C32",
    rating: 4.9,
    reviewsCount: 18,
    isPromo: true,
    promoTag: "10% OFF",
    featured: true,
    image: "/assets/images/spartan_games_anuncio_2.jpg",
    specs: ["16 GB DDR5", "6400 MHz", "CL32 Latency", "RGB iCUE Dynamic", "Intel XMP 3.0 / AMD EXPO"],
    summary: "Memoria RAM DDR5 de altísima frecuencia optimizada para exprimir los últimos cuadros por segundo en procesadores Intel Core y AMD Ryzen.",
    description: "La memoria CORSAIR VENGEANCE RGB DDR5 ofrece un rendimiento sin precedentes y frecuencias más altas adaptadas a las plataformas de nueva generación. Los módulos integran diez zonas de iluminación RGB individualmente direccionables por módulo, protegidas bajo un disipador de aluminio negro anodizado de alta conductividad térmica. Compatibilidad total con Intel XMP 3.0 y AMD EXPO para overclocking estable de un solo clic desde la BIOS.",
    detailedSpecs: [
      { label: "Capacidad", value: "16 GB (1 x 16GB)" },
      { label: "Tipo de Memoria", value: "DDR5 DIMM 288 pines" },
      { label: "Velocidad Frecuencia", value: "6400 MHz (PC5-51200)" },
      { label: "Latencia Probada", value: "CL32-40-40-84" },
      { label: "Voltaje", value: "1.40V" },
      { label: "Disipador de Calor", value: "Aluminio anodizado negro mate" },
      { label: "Iluminación", value: "RGB dinámico multizona direccionable" },
      { label: "Perfiles de Rendimiento", value: "Intel XMP 3.0 & AMD EXPO Ready" },
      { label: "Garantía", value: "Garantía de por vida directa con fabricante / 1 año en tienda Arequipa" }
    ],
    warranty: "Garantía directa de 12 meses con boleta/factura en Spartan Games Compuplaza Arequipa."
  },
  {
    id: 116,
    name: "KINGSTON FURY BEAST RGB 32GB (2x16GB) DDR5 6000MHz",
    brand: "Kingston",
    category: "Memorias RAM",
    categoryId: "ram",
    price: 649.00,
    oldPrice: 720.00,
    stock: 9,
    sku: "KF560C36BBEAK2-32",
    rating: 4.8,
    reviewsCount: 14,
    isPromo: true,
    promoTag: "OFERTA",
    featured: true,
    image: "/assets/images/spartan_games_anuncio_2.jpg",
    specs: ["32 GB (2x16GB)", "6000 MHz", "CL36", "Infrared Sync RGB", "Dual Channel"],
    summary: "Kit Dual Channel listo para multitarea pesada, edición y streaming sin cuello de botella.",
    description: "Kingston FURY Beast DDR5 RGB te permite jugar con estilo en plataformas gaming de última generación. Experimenta los avances de velocidad de DDR5 con el doble de bancos y el doble de longitud de ráfaga.",
    detailedSpecs: [
      { label: "Capacidad", value: "32 GB Kit (2 x 16GB)" },
      { label: "Velocidad", value: "6000 MHz" },
      { label: "Latencia", value: "CL36" },
      { label: "Iluminación", value: "FURY Infrared Sync Technology" },
      { label: "Garantía", value: "Garantía de por vida oficial" }
    ],
    warranty: "Garantía de 12 meses en Spartan Games Compuplaza."
  },
  {
    id: 117,
    name: "CORSAIR VENGEANCE LPX 16GB (2x8GB) DDR4 3200MHz",
    brand: "Corsair",
    category: "Memorias RAM",
    categoryId: "ram",
    price: 219.00,
    oldPrice: 260.00,
    stock: 14,
    sku: "CMK16GX4M2B3200C16",
    rating: 4.9,
    reviewsCount: 32,
    isPromo: false,
    promoTag: "BANCADA GAMER",
    featured: false,
    image: "/assets/images/spartan_games_anuncio_2.jpg",
    specs: ["16 GB (2x8GB)", "3200 MHz", "CL16", "Perfil Bajo (Low Profile)", "DDR4"],
    summary: "El estándar de oro para configuraciones gaming accesibles DDR4.",
    description: "Diseñada para overclocking de alto rendimiento. El disipador térmico está hecho de aluminio puro para una disipación de calor más rápida.",
    detailedSpecs: [
      { label: "Capacidad", value: "16 GB (2x8GB)" },
      { label: "Velocidad", value: "3200 MHz" },
      { label: "Latencia", value: "CL16-20-20-38" },
      { label: "Formato", value: "Low Profile (34mm altura)" }
    ],
    warranty: "Garantía de 12 meses en tienda."
  },
  {
    id: 201,
    name: "LAPTOP LENOVO LOQ 15.6\" RYZEN 7 7840HS RTX 4060 16GB 512GB",
    brand: "Lenovo",
    category: "Laptops Gamer",
    categoryId: "laptops",
    price: 4399.00,
    oldPrice: 4799.00,
    stock: 4,
    sku: "LEN-LOQ-15APH8",
    rating: 5.0,
    reviewsCount: 23,
    isPromo: true,
    promoTag: "TOP VENTAS",
    featured: true,
    image: "/assets/images/spartan_games_anuncio_1.jpg",
    specs: ["Ryzen 7 7840HS 8C/16T", "GeForce RTX 4060 8GB GDDR6", "16 GB DDR5 5600MHz", "512 GB SSD NVMe Gen4", "15.6\" FHD 144Hz G-Sync"],
    summary: "Potencia gráfica sin compromiso. Viene configurada con Windows 11 y programas esenciales listos para jugar.",
    description: "La Lenovo LOQ te permite adentrarte en el gaming competitivo con la potencia del AMD Ryzen 7 7840HS y la GPU NVIDIA GeForce RTX 4060 de 115W TGP con arquitectura Ada Lovelace y DLSS 3.5. Chasis resistente, teclado gamer en español con retroiluminación blanca y refrigeración de doble ventilador.",
    detailedSpecs: [
      { label: "Procesador", value: "AMD Ryzen 7 7840HS (8 núcleos, 16 hilos, hasta 5.1 GHz)" },
      { label: "Tarjeta Gráfica", value: "NVIDIA GeForce RTX 4060 8GB GDDR6 (115W TGP)" },
      { label: "Memoria RAM", value: "16 GB DDR5 5600MHz (expandible a 32GB)" },
      { label: "Almacenamiento", value: "512 GB SSD M.2 PCIe 4.0 NVMe (ranura extra disponible)" },
      { label: "Pantalla", value: "15.6\" IPS FHD (1920x1080) 144Hz, 350 nits, G-SYNC" },
      { label: "Servicio Incluido", value: "Se entrega con Windows 11 Pro activado y programas esenciales" }
    ],
    warranty: "1 año de garantía oficial Lenovo Perú + respaldo directo en Compuplaza Arequipa."
  },
  {
    id: 202,
    name: "LAPTOP ASUS ROG STRIX G16 CORE i9-13980HX RTX 4070 16GB 1TB",
    brand: "Asus ROG",
    category: "Laptops Gamer",
    categoryId: "laptops",
    price: 6890.00,
    oldPrice: 7490.00,
    stock: 2,
    sku: "G614JI-AS94",
    rating: 5.0,
    reviewsCount: 9,
    isPromo: true,
    promoTag: "GAMA ALTA",
    featured: true,
    image: "/assets/images/spartan_games_anuncio_1.jpg",
    specs: ["Core i9-13980HX 24C/32T", "GeForce RTX 4070 8GB (140W)", "16 GB DDR5 4800MHz", "1 TB SSD NVMe Gen4", "16\" FHD+ 165Hz ROG Nebula"],
    summary: "Monstruo de rendimiento para torneos eSports y renderizado 3D intensivo.",
    description: "Domina cada batalla con la ASUS ROG Strix G16. Equipada con el procesador insignia Intel Core i9-13980HX y la gráfica NVIDIA RTX 4070 con MUX Switch y NVIDIA Advanced Optimus. Metal líquido Conductonaut Extreme en CPU para temperaturas gélidas.",
    detailedSpecs: [
      { label: "Procesador", value: "Intel Core i9-13980HX (24 núcleos / 32 hilos, hasta 5.6 GHz)" },
      { label: "GPU", value: "NVIDIA GeForce RTX 4070 8GB GDDR6 (140W max TGP)" },
      { label: "Pantalla", value: "16\" ROG Nebula Display 16:10 FHD+ 165Hz 100% sRGB" },
      { label: "Teclado", value: "RGB por tecla Aura Sync" }
    ],
    warranty: "1 año de garantía oficial Asus Perú con soporte local en Spartan Games."
  },
  {
    id: 301,
    name: "PROCESADOR AMD RYZEN 7 7800X3D (4.2GHz / 5.0GHz) AM5",
    brand: "AMD",
    category: "Procesadores (CPU)",
    categoryId: "procesadores",
    price: 1899.00,
    oldPrice: 2099.00,
    stock: 5,
    sku: "100-100000910WOF",
    rating: 5.0,
    reviewsCount: 41,
    isPromo: true,
    promoTag: "EL REY DEL GAMING",
    featured: true,
    image: "/assets/images/spartan_games_banner.jpg",
    specs: ["8 Núcleos / 16 Hilos", "96MB 3D V-Cache", "Socket AM5", "Hasta 5.0 GHz Max Boost", "TDP 120W"],
    summary: "El mejor procesador del mundo para videojuegos gracias a su descomunal caché 3D vertical de 96MB.",
    description: "El AMD Ryzen 7 7800X3D es el procesador gaming indiscutible. Con la tecnología AMD 3D V-Cache, ofrece tasas de cuadros por segundo insuperables en títulos de esports como Dota 2, CS2, Valorant y Warzone.",
    detailedSpecs: [
      { label: "Arquitectura", value: "Zen 4 (5nm TSMC)" },
      { label: "Núcleos / Hilos", value: "8 Núcleos / 16 Hilos" },
      { label: "Caché Total", value: "104 MB (96MB L3 V-Cache + 8MB L2)" },
      { label: "Socket", value: "AM5 (requiere placa AM5 y RAM DDR5)" }
    ],
    warranty: "3 años de garantía oficial AMD con boleta en Spartan Games."
  },
  {
    id: 302,
    name: "PROCESADOR INTEL CORE i7-14700K 20 NÚCLEOS LGA1700",
    brand: "Intel",
    category: "Procesadores (CPU)",
    categoryId: "procesadores",
    price: 1780.00,
    oldPrice: 1950.00,
    stock: 7,
    sku: "BX8071514700K",
    rating: 4.9,
    reviewsCount: 19,
    isPromo: false,
    promoTag: "CREADORES & GAMING",
    featured: false,
    image: "/assets/images/spartan_games_banner.jpg",
    specs: ["20 Núcleos (8P + 12E)", "28 Hilos", "Hasta 5.6 GHz Turbo", "Intel UHD Graphics 770", "Socket LGA1700"],
    summary: "Equilibrio ideal para jugar en ultra y renderizar video 4K sin ralentizaciones.",
    description: "Rendimiento híbrido de 14va generación con 20 núcleos y 28 subprocesos para exprimir cualquier tarjeta gráfica.",
    detailedSpecs: [
      { label: "Núcleos", value: "8 Performance-cores + 12 Efficient-cores" },
      { label: "Frecuencia Turbo Máx.", value: "5.6 GHz con Intel Turbo Boost Max 3.0" },
      { label: "Compatibilidad", value: "Placas madre Intel serie 600 y 700" }
    ],
    warranty: "3 años de garantía con Intel Perú y Spartan Games."
  },
  {
    id: 401,
    name: "TARJETA DE VIDEO ASUS TUF GAMING GEFORCE RTX 4070 Ti SUPER 16GB",
    brand: "Asus ROG",
    category: "Tarjetas de Video (GPU)",
    categoryId: "tarjetas-video",
    price: 3950.00,
    oldPrice: 4290.00,
    stock: 3,
    sku: "TUF-RTX4070TIS-16G-GAMING",
    rating: 5.0,
    reviewsCount: 11,
    isPromo: true,
    promoTag: "16GB VRAM",
    featured: true,
    image: "/assets/images/spartan_games_banner.jpg",
    specs: ["16 GB GDDR6X 256-bit", "8448 CUDA Cores", "DLSS 3.5 & Ray Tracing", "Ventiladores Axial-tech", "Backplate de Metal"],
    summary: "Juega a resolución 1440p y 4K a más de 120 FPS con Ray Tracing completo y 16GB de VRAM.",
    description: "La ASUS TUF Gaming RTX 4070 Ti SUPER combina durabilidad militar con el silicio más avanzado de NVIDIA. Disipador masivo de 3.25 slots con ventiladores de doble rodamiento para silencio y enfriamiento total.",
    detailedSpecs: [
      { label: "Motor Gráfico", value: "NVIDIA GeForce RTX 4070 Ti SUPER" },
      { label: "Memoria de Video", value: "16 GB GDDR6X" },
      { label: "Interfaz de Memoria", value: "256-bit" },
      { label: "Conectores de Poder", value: "1 x 16 pines (12VHPWR)" },
      { label: "Fuente Recomendada", value: "750W o superior" }
    ],
    warranty: "3 años de garantía ASUS TUF en Arequipa."
  },
  {
    id: 402,
    name: "TARJETA DE VIDEO ASUS DUAL GEFORCE RTX 4060 OC 8GB GDDR6",
    brand: "Asus ROG",
    category: "Tarjetas de Video (GPU)",
    categoryId: "tarjetas-video",
    price: 1499.00,
    oldPrice: 1650.00,
    stock: 8,
    sku: "DUAL-RTX4060-O8G",
    rating: 4.8,
    reviewsCount: 27,
    isPromo: true,
    promoTag: "MÁS POPULAR",
    featured: false,
    image: "/assets/images/spartan_games_banner.jpg",
    specs: ["8 GB GDDR6", "DLSS 3 Frame Generation", "Doble Ventilador Axial", "Bajo Consumo (115W)", "Formato 2.5 Slots"],
    summary: "La reina del 1080p competitivo con consumo ultra eficiente y compatibilidad con cualquier gabinete.",
    description: "Rendimiento sensacional para jugar todo en gráficos Ultra a 1080p con la fluidez del generador de cuadros de DLSS 3.",
    detailedSpecs: [
      { label: "Memoria", value: "8 GB GDDR6 128-bit" },
      { label: "Alimentación", value: "1 x 8 pines estándar (requiere fuente 550W)" }
    ],
    warranty: "3 años de garantía oficial Asus."
  },
  {
    id: 501,
    name: "MONITOR ASUS ROG STRIX 24.5\" 255Hz 0.3ms FAST IPS",
    brand: "Asus ROG",
    category: "Monitores Gamer",
    categoryId: "monitores",
    price: 1399.00,
    oldPrice: 1590.00,
    stock: 4,
    sku: "XG259QN",
    rating: 5.0,
    reviewsCount: 15,
    isPromo: true,
    promoTag: "255Hz ESPORTS",
    featured: true,
    image: "/assets/images/spartan_games_anuncio_2.jpg",
    specs: ["24.5\" Fast IPS FHD", "255Hz Overclocked", "0.3 ms Tiempo Respuesta", "ELMB Sync", "G-Sync Compatible"],
    summary: "Diseñado para jugadores profesionales de shooters competitivos (CS2, Valorant, Overwatch 2).",
    description: "Velocidad extrema en un panel Fast IPS que elimina el desenfoque de movimiento. Cuenta con la tecnología exclusiva ELMB Sync de ASUS para sincronizar la reducción de desenfoque con frecuencias variables.",
    detailedSpecs: [
      { label: "Tamaño y Panel", value: "24.5 pulgadas Fast IPS antirreflejo" },
      { label: "Frecuencia de Actualización", value: "255 Hz (Overclock)" },
      { label: "Tiempo de Respuesta", value: "0.3 ms (mín.)" },
      { label: "Puertos", value: "DisplayPort 1.4, 2x HDMI 2.0, Hub USB 3.2" }
    ],
    warranty: "3 años de garantía de pantalla cero píxeles muertos ASUS."
  },
  {
    id: 601,
    name: "PLACA MADRE ASUS TUF GAMING B650-PLUS WIFI AM5",
    brand: "Asus ROG",
    category: "Placas Madre",
    categoryId: "placas-madre",
    price: 980.00,
    oldPrice: 1090.00,
    stock: 6,
    sku: "TUF-GAMING-B650-PLUS-WIFI",
    rating: 4.9,
    reviewsCount: 8,
    isPromo: false,
    promoTag: "RECOMENDADA AM5",
    featured: false,
    image: "/assets/images/spartan_games_banner.jpg",
    specs: ["Socket AM5 para Ryzen 7000/8000", "VRM 12+2 Fases 60A", "PCIe 5.0 M.2", "DDR5 hasta 7600+ MHz (OC)", "Wi-Fi 6 y 2.5Gb Ethernet"],
    summary: "Placa base robusta y confiable diseñada para operar 24/7 con procesadores Ryzen 7 y Ryzen 9.",
    description: "Componentes TUF de grado militar, solución de alimentación mejorada y un conjunto integral de opciones de enfriamiento para un rendimiento de juego sólido como una roca.",
    detailedSpecs: [
      { label: "Chipset", value: "AMD B650" },
      { label: "Soporte RAM", value: "4 x DIMM DDR5 máx. 192GB" },
      { label: "Redes", value: "Wi-Fi 6 + Realtek 2.5Gb Ethernet" }
    ],
    warranty: "3 años de garantía ASUS TUF."
  },
  {
    id: 701,
    name: "SSD M.2 NVMe KINGSTON KC3000 1TB PCIe 4.0 (7000 MB/s)",
    brand: "Kingston",
    category: "Almacenamiento SSD",
    categoryId: "almacenamiento",
    price: 439.00,
    oldPrice: 490.00,
    stock: 12,
    sku: "SKC3000S/1024G",
    rating: 5.0,
    reviewsCount: 38,
    isPromo: true,
    promoTag: "ULTRA RÁPIDO",
    featured: false,
    image: "/assets/images/spartan_games_banner.jpg",
    specs: ["1 TB Capacidad", "Lectura 7000 MB/s", "Escritura 6000 MB/s", "PCIe 4.0 NVMe M.2 2280", "Disipador de Grafeno"],
    summary: "Cargas de juegos instantáneas y rendimiento extremo para Windows y consolas PS5.",
    description: "El SSD Kingston KC3000 PCIe 4.0 NVMe M.2 ofrece un rendimiento de nivel superior utilizando el controlador Gen 4x4 NVMe y 3D TLC NAND de última generación.",
    detailedSpecs: [
      { label: "Factor de Forma", value: "M.2 2280" },
      { label: "Velocidad Lectura", value: "Hasta 7,000 MB/s" },
      { label: "Velocidad Escritura", value: "Hasta 6,000 MB/s" },
      { label: "Compatibilidad", value: "PC Desktop, Laptops compatibles y PlayStation 5" }
    ],
    warranty: "5 años de garantía oficial Kingston."
  }
];

export const pcBuilderSteps = [
  { id: 1, name: "Procesador (CPU)", required: true, categoryId: "procesadores", hint: "El cerebro de tu máquina gaming." },
  { id: 2, name: "Placa Madre", required: true, categoryId: "placas-madre", hint: "Asegura la compatibilidad con tu CPU." },
  { id: 3, name: "Memoria RAM", required: true, categoryId: "ram", hint: "Recomendado mínimo 16GB o 32GB Dual Channel." },
  { id: 4, name: "Tarjeta de Video (GPU)", required: false, categoryId: "tarjetas-video", hint: "Crucial para FPS y gráficos en juegos." },
  { id: 5, name: "Almacenamiento SSD", required: true, categoryId: "almacenamiento", hint: "SSD NVMe ultrarrápido para el sistema y juegos." },
  { id: 6, name: "Fuente de Poder (PSU)", required: true, categoryId: "fuentes", hint: "80 Plus Bronce o Gold certificada." },
  { id: 7, name: "Gabinete / Case", required: true, categoryId: "cases", hint: "Excelente flujo de aire con coolers RGB." },
  { id: 8, name: "Refrigeración Líquida/Aire", required: false, categoryId: "coolers", hint: "Mantiene tu procesador a bajas temperaturas." },
  { id: 9, name: "Monitor Gamer", required: false, categoryId: "monitores", hint: "Alta tasa de refresco 144Hz a 255Hz." },
  { id: 10, name: "Teclado y Mouse", required: false, categoryId: "perifericos", hint: "Switches mecánicos y sensores ópticos precisos." },
  { id: 11, name: "Auriculares Gamer", required: false, categoryId: "audio", hint: "Audio posicional 7.1 para escuchar pasos." }
];

export const faqData = [
  {
    category: "Compras y Pagos en Arequipa",
    items: [
      {
        q: "¿Cuáles son los métodos de pago aceptados?",
        a: "Aceptamos Yape, Plin, transferencias directas (BCP, BBVA, Interbank), efectivo en tienda (C.C. Compuplaza Tienda 204) y tarjetas de crédito/débito con Culqi (Visa, Mastercard, Amex)."
      },
      {
        q: "¿Cómo funciona el 'Pago por Reserva (10%)'?",
        a: "Para asegurar el precio de oferta y el stock físico de componentes de alta demanda, puedes abonar una seña del 10% mediante Yape o transferencia. Te enviamos la proforma firmada por WhatsApp y cancelas el 90% restante al retirar tu equipo en tienda o contraentrega coordinada en Arequipa."
      }
    ]
  },
  {
    category: "Entregas y Envíos",
    items: [
      {
        q: "¿Tienen servicio de Delivery en Arequipa?",
        a: "¡Sí! Contamos con servicio de DELIVERY propio en todo Arequipa Metropolitana (Cercado, Yanahuara, Cayma, Paucarpata, Cerro Colorado, JLByR, etc.). Los equipos armados se entregan con Sistema Operativo Windows y programas esenciales listos para jugar."
      },
      {
        q: "¿Hacen envíos a otras ciudades del Perú?",
        a: "Realizamos envíos asegurados a todo el Perú (Cusco, Puno, Tacna, Moquegua, Lima, etc.) a través de Shalom y Olva Courier con código de rastreo en tiempo real."
      }
    ]
  },
  {
    category: "Garantía y Servicio Técnico",
    items: [
      {
        q: "¿Qué tipo de garantía ofrecen?",
        a: "Todos nuestros componentes y laptops cuentan con garantía física local de 1 a 3 años. Entregamos boleta de venta o factura electrónica con RUC."
      },
      {
        q: "¿Realizan servicio de armado y mantenimiento?",
        a: "Sí, todos los ensambles comprados con nosotros incluyen armado profesional, gestión de cables oculta (cable management) y prueba de estrés térmico completamente GRATIS."
      }
    ]
  }
];
export const STORE_INFO = storeInfo;
export const PC_BUILDER_STEPS = pcBuilderSteps;

export const RELATED_PRODUCTS = productsCatalog;
