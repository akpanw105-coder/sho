export interface Product {
  id: string;
  name: string;
  subtitle: string;
  category: 'Sneakers' | 'Boots' | 'Loafers' | 'Skate & Low' | 'Mules';
  price: number;
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  image: string;
  badge?: string;
  description: string;
  craftDetails: string;
  colors: { name: string; hex: string }[];
  sizes: number[];
  stockCount: number;
  featured?: boolean;
}

export interface CartItem {
  product: Product;
  selectedColor: string;
  selectedSize: number;
  quantity: number;
}

export interface OrderItem {
  productId: string;
  productName: string;
  color: string;
  size: number;
  quantity: number;
  unitPrice: number;
  image: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  total: number;
  status: 'Processing' | 'Dispatched' | 'In Transit' | 'Out for Delivery' | 'Delivered' | 'Cancelled';
  deliveryMethod: string;
  shippingAddress: {
    fullName: string;
    street: string;
    city: string;
    state: string;
    postalCode: string;
    phone: string;
  };
  trackingCode: string;
  estimatedDelivery: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  ordersCount: number;
  totalSpent: number;
  joinedDate: string;
  status: 'VIP Patron' | 'Active' | 'Dormant';
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  type: 'order' | 'drop' | 'exclusive' | 'system';
}

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'aj1-retro',
    name: 'Air Jordan 1 Retro',
    subtitle: "Men's Lifestyle Shoes",
    category: 'Sneakers',
    price: 120,
    originalPrice: 160,
    rating: 4.8,
    reviewsCount: 124,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDsdiEnqx6xwjnBG-zP8jKSWBgPx8KxBJcNB2yy2g-hGZ0Vp4SDScVuugjnpU1F40zzbJ_pFRK3HlSyaU4U0uvfMsSjS6dotpqc88Jyjyvd7y9WrdtZQUG4hpJMt5WY6N_YD9giIa0IMuSQKW0zFQ6NWEttz3UerXhG7VLpbRU66ozDE7JQDRFb_A7h4eSRyQrVgzwCHznC4CKQJV9gISNQrsgH_towB-8KUCk0HmkvNaaJJ7y0oD2E',
    badge: 'Drop 04 / Edition',
    description: 'Fresh silhouettes. Handcrafted archival stock in phantom sail and shadow grey leather for daily discerning wear.',
    craftDetails: 'Premium full-grain leather, encapsulated Air-Sole unit, durable solid rubber outsole with heritage pivot circle. Hand-finished edges with archival heel stamp.',
    colors: [
      { name: 'Slate Grey / Sail', hex: '#8E9B97' },
      { name: 'Triple Charcoal', hex: '#1e2322' },
      { name: 'Desert Cream / Bone', hex: '#D4C3B3' },
    ],
    sizes: [40, 41, 42, 43, 44, 45],
    stockCount: 18,
    featured: true,
  },
  {
    id: 'vans-old-skool',
    name: 'Vans Old Skool Minimalist',
    subtitle: 'Black / True White Canvas',
    category: 'Skate & Low',
    price: 95,
    originalPrice: 110,
    rating: 4.7,
    reviewsCount: 88,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCZRwNQp-xol08ab9N-t3l3fmmsWYaLRUJ4gugbvOz6kl8kWsgUguZYYKiB0NT08jByExwiR5Rkm2vqqSOhzlVxLz-JFGTxcpbQ2CFRhiSxt_w6_-ei0bH9RUVY-xS70SdBctp1uaNfZVV8ajAzOW7C_BzFlUTnSyW8O2T4W8bjS61t5TjQbUilho8ftmrsFCa5O7dFv9JXtIssK5pFNo9lY_7iYIrM0GWXaRrtghSMP4FqpTkXtt4K',
    badge: 'Canvas',
    description: 'Classic low-top skate sneaker in heavy dark charcoal canvas with contrasting white side stripe and pristine vulcanized sole.',
    craftDetails: 'Double-stitched 12oz duck canvas, reinforced toecaps, padded collars, signature rubber waffle outsoles.',
    colors: [
      { name: 'Black / Cloud White', hex: '#1a1a1a' },
      { name: 'Oatmeal / Off-White', hex: '#d6cbbd' },
    ],
    sizes: [39, 40, 41, 42, 43, 44],
    stockCount: 34,
    featured: true,
  },
  {
    id: 'churchill-chelsea',
    name: 'Churchill Leather Chelsea',
    subtitle: 'Jet Black Full Grain Calfskin',
    category: 'Boots',
    price: 240,
    originalPrice: 280,
    rating: 4.9,
    reviewsCount: 62,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCeSKIUyGGS2XQChFZ9O315jmHdeXL2ZToeeB-v-A04pe5fLuIcuLdWztnIEaDrl8u4vbWUErEBZG6UNM6VftBSLZA7OrKqMLmgmOEKrlOISQPEM1B9FXkcppblo2MTdAW0dM2fZkMj-0Yl-p4dDTCPTrO22WAJQUCMpc9kj1-xbHmGH8xV2b8qPicpnb6lWh9YUgB_zco-NCFaeyRo1ox33Uaj9atnYD-Cab0W_EB5RCrrlOWlIitc',
    badge: 'Polished',
    description: 'Exquisite handcrafted Chelsea boot in jet black full grain leather with elastic gusset detail and Goodyear welted sole.',
    craftDetails: 'Hand-dyed Parisian calfskin, Goodyear welt construction, storm welt stitching, cork bed midlayer with oiled leather outsole.',
    colors: [
      { name: 'Jet Noir Polish', hex: '#0a0a0a' },
      { name: 'Espresso Glaze', hex: '#2c1e18' },
    ],
    sizes: [40, 41, 42, 43, 44, 45],
    stockCount: 12,
    featured: true,
  },
  {
    id: 'atelier-penny-loafer',
    name: 'Atelier Penny Loafer',
    subtitle: 'Oxblood Glazed Calf Leather',
    category: 'Loafers',
    price: 195,
    originalPrice: 220,
    rating: 4.8,
    reviewsCount: 45,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuADEkQtatL5yvBNhu2ylq7VgMHMXiMkxb-HsAaHkWO6cqxVbM7R1cXVzULwyHmE0X7-6NiY69FL_fz540g_F_kBdOqVtKptUCgym6Rdj7GVnipZaBSQCKMUi5dar8twaB9iAkmAc-7Q6dve-4TnkzR_IHg8uRt8y5IFa5EhvX6bZlOtXkhLPpue31biYss0a6F5P23Nvbmju12QJUa2CIu4tS7JNKJBkZFTq2LRwjRNCc6pP6eISyXI',
    badge: 'Archival',
    description: 'Minimalist luxury penny loafer on moody dark backdrop with polished deep oxblood patina and hand-rolled strap.',
    craftDetails: 'Hand-burnished Italian calfskin, stacked leather heel with brass taps, Blake stitch flexibility.',
    colors: [
      { name: 'Oxblood Patina', hex: '#481919' },
      { name: 'Burnished Tan', hex: '#6d482d' },
    ],
    sizes: [40, 41, 42, 43, 44],
    stockCount: 15,
    featured: true,
  },
  {
    id: 'nordic-suede-mule',
    name: 'Nordic Sculpted Suede Mule',
    subtitle: 'Warm Beige Sand & Cork Bed',
    category: 'Mules',
    price: 145,
    rating: 4.6,
    reviewsCount: 38,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC_ASDB2yZmtQUFKnL8y6PvfkX0EdQhIdpOFTu8HrUOZvqHipvQUoTBeFO6FbcKVHpdZX_TyURuIbKCAx0-W0XnC5_hURL6Yign4L8vN3wi8n-RnPywaqoRnoeDexKOYYRPToBpDsTGKtgObaOsg9Z0ALzuv2SkLLvhPy-jASE6vAbKZ4hi6-f-lNQrAsofYvRbcDCR1PC_xyiaBfxpk68sRJQjlrkE8Hadc1NR6fqtkeQUlq1-WuDJ',
    badge: 'Bespoke',
    description: 'Contemporary slide mule sandal in textured desert sand suede with architectural sculpted anatomical cork footbed.',
    craftDetails: 'Velvety split cow suede, natural latex and cork orthopedic contoured footbed, ultra-light EVA traction tread.',
    colors: [
      { name: 'Desert Sand', hex: '#c5b49d' },
      { name: 'Muted Forest', hex: '#37473f' },
    ],
    sizes: [39, 40, 41, 42, 43, 44],
    stockCount: 22,
    featured: false,
  },
  {
    id: 'retro-olive-runner',
    name: 'Archival Olive Retro Runner',
    subtitle: 'Olive Green & Ivory Nubuck',
    category: 'Sneakers',
    price: 135,
    rating: 4.8,
    reviewsCount: 79,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCYpqSJaDIQB1GQEY3LwRdEw6g3NPw7s6RevADDUYMiSRWRTTwvKFzbJoH6zlkixVrVwM143fdUG4fXP9OjouFYjhKj6zw5evKsCI_qU0YfHDaes3VyHncpIq8Y0SDvpnQ5f-8e0ul9DEQFe0eO9eS1a9CZtB8gFByvttvpMfRtzf-GVB1WR_H9rzacHucL7XxIMPV2VITNT9n3_ZQPPEBsB8C9zdnKIYCuRvVFCt4g25CZjf3ASdu',
    badge: 'Limited Drop',
    description: 'Low-profile luxury olive green and ivory retro runner with natural gum sole designed for elevated everyday stride.',
    craftDetails: 'Japanese milled nubuck leather, breathable organic cotton twill underlays, vulcanized gum rubber sole.',
    colors: [
      { name: 'Pine & Cream', hex: '#405247' },
      { name: 'Charcoal Monolith', hex: '#1a1f1d' },
    ],
    sizes: [40, 41, 42, 43, 44, 45],
    stockCount: 16,
    featured: false,
  },
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-9021',
    orderNumber: 'SHO-849201',
    date: 'Oct 17, 2026',
    items: [
      {
        productId: 'aj1-retro',
        productName: 'Air Jordan 1 Retro',
        color: 'Slate Grey / Sail',
        size: 42,
        quantity: 1,
        unitPrice: 120,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDsdiEnqx6xwjnBG-zP8jKSWBgPx8KxBJcNB2yy2g-hGZ0Vp4SDScVuugjnpU1F40zzbJ_pFRK3HlSyaU4U0uvfMsSjS6dotpqc88Jyjyvd7y9WrdtZQUG4hpJMt5WY6N_YD9giIa0IMuSQKW0zFQ6NWEttz3UerXhG7VLpbRU66ozDE7JQDRFb_A7h4eSRyQrVgzwCHznC4CKQJV9gISNQrsgH_towB-8KUCk0HmkvNaaJJ7y0oD2E',
      },
      {
        productId: 'vans-old-skool',
        productName: 'Vans Old Skool Suede',
        color: 'Black / Cloud White',
        size: 42,
        quantity: 1,
        unitPrice: 95,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCZRwNQp-xol08ab9N-t3l3fmmsWYaLRUJ4gugbvOz6kl8kWsgUguZYYKiB0NT08jByExwiR5Rkm2vqqSOhzlVxLz-JFGTxcpbQ2CFRhiSxt_w6_-ei0bH9RUVY-xS70SdBctp1uaNfZVV8ajAzOW7C_BzFlUTnSyW8O2T4W8bjS61t5TjQbUilho8ftmrsFCa5O7dFv9JXtIssK5pFNo9lY_7iYIrM0GWXaRrtghSMP4FqpTkXtt4K',
      },
    ],
    subtotal: 215,
    shippingFee: 0,
    total: 215,
    status: 'In Transit',
    deliveryMethod: 'Standard Complimentary',
    shippingAddress: {
      fullName: 'Wisdom Akpan',
      street: '12 Freedom Street',
      city: 'Calabar',
      state: 'Cross River State',
      postalCode: '540001',
      phone: '+234 806 123 4567',
    },
    trackingCode: 'SHO-EXP-829104-NGA',
    estimatedDelivery: 'Oct 21, 2026',
  },
  {
    id: 'ord-8812',
    orderNumber: 'SHO-773120',
    date: 'Sep 29, 2026',
    items: [
      {
        productId: 'churchill-chelsea',
        productName: 'Churchill Leather Chelsea',
        color: 'Jet Noir Polish',
        size: 43,
        quantity: 1,
        unitPrice: 240,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCeSKIUyGGS2XQChFZ9O315jmHdeXL2ZToeeB-v-A04pe5fLuIcuLdWztnIEaDrl8u4vbWUErEBZG6UNM6VftBSLZA7OrKqMLmgmOEKrlOISQPEM1B9FXkcppblo2MTdAW0dM2fZkMj-0Yl-p4dDTCPTrO22WAJQUCMpc9kj1-xbHmGH8xV2b8qPicpnb6lWh9YUgB_zco-NCFaeyRo1ox33Uaj9atnYD-Cab0W_EB5RCrrlOWlIitc',
      },
    ],
    subtotal: 240,
    shippingFee: 15,
    total: 255,
    status: 'Delivered',
    deliveryMethod: 'Express Courier',
    shippingAddress: {
      fullName: 'Wisdom Akpan',
      street: '12 Freedom Street',
      city: 'Calabar',
      state: 'Cross River State',
      postalCode: '540001',
      phone: '+234 806 123 4567',
    },
    trackingCode: 'SHO-DLV-119302-NGA',
    estimatedDelivery: 'Oct 02, 2026',
  },
];

export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'cust-1',
    name: 'Wisdom Akpan',
    email: 'wisdom@example.com',
    phone: '+234 806 123 4567',
    ordersCount: 5,
    totalSpent: 1140,
    joinedDate: 'Feb 2026',
    status: 'VIP Patron',
  },
  {
    id: 'cust-2',
    name: 'Elena Rostova',
    email: 'elena.rostova@editorial.co',
    phone: '+44 7911 123456',
    ordersCount: 3,
    totalSpent: 675,
    joinedDate: 'Apr 2026',
    status: 'Active',
  },
  {
    id: 'cust-3',
    name: 'Marcus Vance',
    email: 'marcus.v@atelier.design',
    phone: '+1 415 889 0192',
    ordersCount: 1,
    totalSpent: 240,
    joinedDate: 'Aug 2026',
    status: 'Active',
  },
  {
    id: 'cust-4',
    name: 'Sora Takahashi',
    email: 'sora@tokyokicks.jp',
    phone: '+81 90 2819 0422',
    ordersCount: 8,
    totalSpent: 1980,
    joinedDate: 'Jan 2026',
    status: 'VIP Patron',
  },
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Drop 04 Unlocked',
    message: 'Air Jordan 1 Retro and Churchill Chelsea archive restocked in limited quantities.',
    date: '2 hours ago',
    read: false,
    type: 'drop',
  },
  {
    id: 'notif-2',
    title: 'Order SHO-849201 In Transit',
    message: 'Your bespoke parcel has passed quality certification and is en route via courier.',
    date: 'Yesterday',
    read: false,
    type: 'order',
  },
  {
    id: 'notif-3',
    title: 'Private Collector Invitation',
    message: 'You have qualified for SHO. Private Salon preview of winter Chelsea editions.',
    date: '3 days ago',
    read: true,
    type: 'exclusive',
  },
];
