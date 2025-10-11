// Danh sách các ảnh sản phẩm có sẵn
export const productImages = [
  "/cloth/00006_00.jpg",
  "/cloth/00008_00.jpg",
  "/cloth/00013_00.jpg",
  "/cloth/00017_00.jpg",
  "/cloth/00034_00.jpg",
  "/cloth/00035_00.jpg",
  "/cloth/00055_00.jpg",
  "/cloth/00057_00.jpg",
  "/cloth/00064_00.jpg",
  "/cloth/00074_00.jpg",
  "/cloth/00075_00.jpg",
  "/cloth/00084_00.jpg",
  "/cloth/00094_00.jpg",
  "/cloth/00095_00.jpg",
  "/cloth/00096_00.jpg",
  "/cloth/00110_00.jpg",
  "/cloth/00112_00.jpg",
  "/cloth/00121_00.jpg",
  "/cloth/00145_00.jpg",
  "/cloth/00151_00.jpg",
  "/cloth/00158_00.jpg",
  "/cloth/00176_00.jpg",
  "/cloth/00190_00.jpg",
  "/cloth/00205_00.jpg",
  "/cloth/00249_00.jpg",
  "/cloth/00254_00.jpg",
  "/cloth/00259_00.jpg",
  "/cloth/00273_00.jpg",
  "/cloth/00278_00.jpg",
  "/cloth/00286_00.jpg",
  "/cloth/00287_00.jpg",
  "/cloth/00291_00.jpg",
  "/cloth/00311_00.jpg",
  "/cloth/00330_00.jpg",
  "/cloth/00339_00.jpg",
  "/cloth/00345_00.jpg",
];

// Hàm để lấy ảnh ngẫu nhiên
export function getRandomProductImage(): string {
  return productImages[Math.floor(Math.random() * productImages.length)];
}

// Hàm để lấy ảnh theo index
export function getProductImageByIndex(index: number): string {
  return productImages[index % productImages.length];
}

// Ảnh cho từng danh mục
export const categoryImages = {
  men: [
    "/cloth/00006_00.jpg",
    "/cloth/00008_00.jpg", 
    "/cloth/00013_00.jpg",
    "/cloth/00017_00.jpg",
    "/cloth/00034_00.jpg",
    "/cloth/00035_00.jpg",
    "/cloth/00055_00.jpg",
    "/cloth/00057_00.jpg",
    "/cloth/00064_00.jpg",
    "/cloth/00074_00.jpg",
  ],
  women: [
    "/cloth/00075_00.jpg",
    "/cloth/00084_00.jpg",
    "/cloth/00094_00.jpg",
    "/cloth/00095_00.jpg",
    "/cloth/00096_00.jpg",
    "/cloth/00110_00.jpg",
    "/cloth/00112_00.jpg",
    "/cloth/00121_00.jpg",
    "/cloth/00145_00.jpg",
    "/cloth/00151_00.jpg",
  ],
  kids: [
    "/cloth/00158_00.jpg",
    "/cloth/00176_00.jpg",
    "/cloth/00190_00.jpg",
    "/cloth/00205_00.jpg",
    "/cloth/00249_00.jpg",
    "/cloth/00254_00.jpg",
    "/cloth/00259_00.jpg",
    "/cloth/00273_00.jpg",
  ],
  accessories: [
    "/cloth/00278_00.jpg",
    "/cloth/00286_00.jpg",
    "/cloth/00287_00.jpg",
    "/cloth/00291_00.jpg",
    "/cloth/00311_00.jpg",
    "/cloth/00330_00.jpg",
    "/cloth/00339_00.jpg",
    "/cloth/00345_00.jpg",
  ]
};

// Ảnh hero cho các danh mục
export const categoryHeroImages = {
  men: "/cloth/00006_00.jpg",
  women: "/cloth/00075_00.jpg", 
  kids: "/cloth/00158_00.jpg",
  accessories: "/cloth/00278_00.jpg",
  sale: "/cloth/00110_00.jpg",
};

// Hàm để lấy ảnh theo danh mục
export function getCategoryImages(category: keyof typeof categoryImages): string[] {
  return categoryImages[category];
}

// Hàm để lấy ảnh theo danh mục và index
export function getCategoryImageByIndex(category: keyof typeof categoryImages, index: number): string {
  const images = categoryImages[category];
  return images[index % images.length];
}

// Hàm để lấy ảnh hero theo danh mục
export function getCategoryHeroImage(category: keyof typeof categoryHeroImages): string {
  return categoryHeroImages[category];
}