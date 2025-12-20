// Gallery ảnh quần áo mẫu cho Virtual Try-On

export interface GarmentItem {
  id: string;
  name: string;
  category: 'men' | 'women' | 'kids' | 'unisex';
  type: 'shirt' | 'dress' | 'jacket' | 'pants' | 'sweater' | 'other';
  image: string;
  thumbnail?: string;
}

export const garmentGallery: GarmentItem[] = [
  // Women's clothing
  {
    id: 'w1',
    name: 'Áo sơ mi trắng nữ',
    category: 'women',
    type: 'shirt',
    image: 'https://i.pinimg.com/736x/b4/1c/2e/b41c2e07e8bb49ec5bc40cc64e766e0c.jpg',
  },
  {
    id: 'w2',
    name: 'Váy hoa mùa hè',
    category: 'women',
    type: 'dress',
    image: 'https://i.pinimg.com/736x/87/21/fb/8721fb1f0d60fc6a21d29a83d7c066ff.jpg',
  },
  {
    id: 'w3',
    name: 'Áo khoác denim nữ',
    category: 'women',
    type: 'jacket',
    image: 'https://i.pinimg.com/736x/23/4b/ea/234bea6dcfd0bde56e3ac14a7e0f2efe.jpg',
  },
  {
    id: 'w4',
    name: 'Áo len cổ tròn nữ',
    category: 'women',
    type: 'sweater',
    image: 'https://i.pinimg.com/736x/1f/d4/37/1fd437e26883a3bdb0ede77e80f11cbb.jpg',
  },
  {
    id: 'w5',
    name: 'Váy đen dự tiệc',
    category: 'women',
    type: 'dress',
    image: 'https://i.pinimg.com/736x/f5/c8/65/f5c8654a41e3b3c0a1f14a9b2e3d4c5e.jpg',
  },

  // Men's clothing
  {
    id: 'm1',
    name: 'Áo sơ mi trắng nam',
    category: 'men',
    type: 'shirt',
    image: 'https://i.pinimg.com/736x/41/ef/c9/41efc9fe9f8a0b48e5c7f3d2b1a6c8d5.jpg',
  },
  {
    id: 'm2',
    name: 'Áo thun đen basic',
    category: 'men',
    type: 'shirt',
    image: 'https://i.pinimg.com/736x/6c/d9/a5/6cd9a5f0e8b7c4a3d2f1e6b5a4c3d2e1.jpg',
  },
  {
    id: 'm3',
    name: 'Áo khoác bomber nam',
    category: 'men',
    type: 'jacket',
    image: 'https://i.pinimg.com/736x/8f/b2/c7/8fb2c7a1d5e4f3b2c1d0e9f8g7h6i5j4.jpg',
  },
  {
    id: 'm4',
    name: 'Áo hoodie xám',
    category: 'men',
    type: 'sweater',
    image: 'https://i.pinimg.com/736x/2d/8a/f1/2d8af1c5b7e4d3a2f1e0d9c8b7a6f5e4.jpg',
  },
  {
    id: 'm5',
    name: 'Áo polo xanh navy',
    category: 'men',
    type: 'shirt',
    image: 'https://i.pinimg.com/736x/9e/3f/b8/9e3fb8d7c6a5f4e3d2c1b0a9f8e7d6c5.jpg',
  },

  // Kids' clothing
  {
    id: 'k1',
    name: 'Áo thun họa tiết trẻ em',
    category: 'kids',
    type: 'shirt',
    image: 'https://i.pinimg.com/736x/4b/7e/d2/4b7ed2f8a5c3b1e9d7f6a4c2b0e8d6f4.jpg',
  },
  {
    id: 'k2',
    name: 'Áo khoác trẻ em',
    category: 'kids',
    type: 'jacket',
    image: 'https://i.pinimg.com/736x/7c/3a/f9/7c3af9b6d8e5c4a2f1d0b9e8c7a6f5d4.jpg',
  },

  // Unisex
  {
    id: 'u1',
    name: 'Áo thun trắng basic',
    category: 'unisex',
    type: 'shirt',
    image: 'https://i.pinimg.com/736x/3e/b1/c8/3eb1c8f7a4d2e6b5c9a8d7f6e5b4c3a2.jpg',
  },
  {
    id: 'u2',
    name: 'Áo khoác hoodie đen',
    category: 'unisex',
    type: 'sweater',
    image: 'https://i.pinimg.com/736x/5d/9f/a3/5d9fa3e8b7c6d5f4a3e2d1c0b9f8e7a6.jpg',
  },
];

export const getGarmentsByCategory = (category: GarmentItem['category']) => {
  return garmentGallery.filter(item => item.category === category);
};

export const getAllCategories = () => {
  return ['all', 'women', 'men', 'kids', 'unisex'] as const;
};
