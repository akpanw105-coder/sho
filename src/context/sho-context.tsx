import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import {
  Product,
  CartItem,
  Order,
  Customer,
  NotificationItem,
  INITIAL_PRODUCTS,
  INITIAL_ORDERS,
  INITIAL_CUSTOMERS,
  INITIAL_NOTIFICATIONS,
} from '@/constants/sho-mock-data';

export interface BarberService {
  id: string;
  name: string;
  duration_minutes: number;
  price: number;
  description: string;
  is_active: boolean;
}

export interface BarberBookingItem {
  id: string;
  booking_id: string;
  service_id: string;
  service_name: string;
  duration_minutes: number;
  price: number;
}

export interface BarberBooking {
  id: string;
  reference: string;
  user_id: string | null;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  booking_date: string;
  booking_date_label: string;
  booking_time: string;
  total_price: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  payment_method: 'card' | 'atelier';
  payment_status: 'pending' | 'completed' | 'failed';
  payment_reference: string | null;
  created_at: string;
  items?: BarberBookingItem[];
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  tier: string;
  avatar: string;
  role: 'customer' | 'admin' | 'member';
  address: {
    fullName: string;
    street: string;
    city: string;
    state: string;
    postalCode: string;
    phone: string;
  };
}

interface ShoContextType {
  // Authentication & Profile
  user: UserProfile | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  authLoading: boolean;
  login: (email: string, password?: string) => Promise<{ error: Error | null }>;
  signup: (name: string, email: string, password?: string, phone?: string) => Promise<{ error: Error | null }>;
  logout: () => Promise<void>;
  updateAddress: (address: Partial<UserProfile['address']>) => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;

  // Products & Catalog
  products: Product[];
  isLoadingProducts: boolean;
  fetchProducts: () => Promise<void>;
  addProduct: (product: Omit<Product, 'id'>) => Promise<Product | null>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;

  // Cart & Wishlist
  cart: CartItem[];
  addToCart: (product: Product, color: string, size: number, quantity?: number) => Promise<void>;
  removeFromCart: (productId: string, color: string, size: number) => Promise<void>;
  updateCartQuantity: (productId: string, color: string, size: number, delta: number) => Promise<void>;
  clearCart: () => Promise<void>;
  cartCount: number;
  cartTotal: number;

  wishlist: string[];
  toggleWishlist: (productId: string) => Promise<void>;
  isWishlisted: (productId: string) => boolean;

  // Orders
  orders: Order[];
  isLoadingOrders: boolean;
  fetchOrders: () => Promise<void>;
  placeOrder: (deliveryMethod: string, shippingFee: number) => Promise<Order>;
  updateOrderStatus: (orderId: string, status: Order['status']) => Promise<void>;

  // Customers (Admin)
  customers: Customer[];
  isLoadingCustomers: boolean;
  fetchCustomers: () => Promise<void>;
  addCustomer: (customer: Omit<Customer, 'id' | 'ordersCount' | 'totalSpent' | 'joinedDate'>) => Promise<void>;

  // Notifications
  notifications: NotificationItem[];
  markNotificationRead: (id: string) => Promise<void>;
  unreadNotificationsCount: number;

  // Search & Filter state
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;

  // Barber Shop Appointments
  services: BarberService[];
  isLoadingServices: boolean;
  fetchServices: () => Promise<void>;
  bookings: BarberBooking[];
  isLoadingBookings: boolean;
  fetchBookings: () => Promise<void>;
  createBooking: (params: {
    bookingDate: string;
    bookingDateLabel: string;
    bookingTime: string;
    customerName: string;
    customerEmail: string;
    customerPhone?: string;
    totalPrice: number;
    paymentMethod: 'card' | 'atelier';
    serviceIds: string[];
  }) => Promise<{ data?: any; error?: string | null }>;
  approveBooking: (bookingId: string) => Promise<{ success: boolean; error?: string }>;
  rejectBooking: (bookingId: string) => Promise<{ success: boolean; error?: string }>;
  cancelBooking: (bookingId: string) => Promise<{ success: boolean; error?: string }>;
}

const ShoContext = createContext<ShoContextType | undefined>(undefined);

export function ShoProvider({ children }: { children: React.ReactNode }) {
  // Auth state
  const [user, setUser] = useState<UserProfile | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Data state
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);

  const [wishlist, setWishlist] = useState<string[]>(['aj1-retro', 'churchill-chelsea']);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);

  const [customers, setCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS);
  const [isLoadingCustomers, setIsLoadingCustomers] = useState(false);

  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  // Cart state
  const [cart, setCart] = useState<CartItem[]>([
    {
      product: INITIAL_PRODUCTS[0],
      selectedColor: 'Slate Grey / Sail',
      selectedSize: 42,
      quantity: 1,
    },
    {
      product: INITIAL_PRODUCTS[1],
      selectedColor: 'Black / Cloud White',
      selectedSize: 42,
      quantity: 1,
    },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Load user profile & address from Supabase
  const loadUserProfile = useCallback(async (userId: string, email: string) => {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      const { data: address } = await supabase
        .from('delivery_addresses')
        .select('*')
        .eq('user_id', userId)
        .eq('is_default', true)
        .maybeSingle();

      if (profile) {
        setUser({
          id: profile.id,
          name: profile.full_name || email.split('@')[0],
          email: profile.email || email,
          phone: profile.phone || '',
          tier: profile.tier || 'Member',
          avatar: profile.avatar_url || '',
          role: (profile.role as 'customer' | 'admin' | 'member') || 'member',
          address: address
            ? {
                fullName: address.full_name,
                street: address.street,
                city: address.city,
                state: address.state,
                postalCode: address.postal_code,
                phone: address.phone,
              }
            : {
                fullName: profile.full_name || email.split('@')[0],
                street: '12 Freedom Street',
                city: 'Calabar',
                state: 'Cross River State',
                postalCode: '540001',
                phone: profile.phone || '+234 806 123 4567',
              },
        });
      } else {
        // Fallback profile if record not yet generated
        setUser({
          id: userId,
          name: email.split('@')[0],
          email,
          phone: '',
          tier: 'Member',
          avatar: '',
          role: 'customer',
          address: {
            fullName: email.split('@')[0],
            street: '12 Freedom Street',
            city: 'Calabar',
            state: 'Cross River State',
            postalCode: '540001',
            phone: '+234 806 123 4567',
          },
        });
      }
    } catch (err) {
      console.warn('Error loading user profile:', err);
    }
  }, []);

  // Fetch Products from Supabase
  const fetchProducts = useCallback(async () => {
    setIsLoadingProducts(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Supabase fetchProducts error:', error.message);
      } else if (data && data.length > 0) {
        const mappedProducts: Product[] = data.map((row: any) => ({
          id: row.id,
          name: row.name,
          subtitle: row.subtitle,
          category: row.category_id as Product['category'],
          price: Number(row.price),
          originalPrice: row.original_price ? Number(row.original_price) : undefined,
          rating: Number(row.rating),
          reviewsCount: row.reviews_count,
          image: row.image,
          badge: row.badge,
          description: row.description,
          craftDetails: row.craft_details,
          colors: typeof row.colors === 'string' ? JSON.parse(row.colors) : row.colors,
          sizes: typeof row.sizes === 'string' ? JSON.parse(row.sizes) : row.sizes,
          stockCount: row.stock_count,
          featured: row.featured,
        }));
        setProducts(mappedProducts);
      }
    } catch (err) {
      console.warn('Error fetching products:', err);
    } finally {
      setIsLoadingProducts(false);
    }
  }, []);

  // Fetch Orders from Supabase
  const fetchOrders = useCallback(async () => {
    setIsLoadingOrders(true);
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (*)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Supabase fetchOrders error:', error.message);
      } else if (data && data.length > 0) {
        const mappedOrders: Order[] = data.map((o: any) => ({
          id: o.id,
          orderNumber: o.order_number,
          date: new Date(o.created_at).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          }),
          items: (o.order_items || []).map((it: any) => ({
            productId: it.product_id,
            productName: it.product_name,
            color: it.color,
            size: it.size,
            quantity: it.quantity,
            unitPrice: Number(it.unit_price),
            image: it.image,
          })),
          subtotal: Number(o.subtotal),
          shippingFee: Number(o.shipping_fee),
          total: Number(o.total),
          status: o.status,
          deliveryMethod: o.delivery_method,
          shippingAddress: typeof o.shipping_address === 'string' ? JSON.parse(o.shipping_address) : o.shipping_address,
          trackingCode: o.tracking_code,
          estimatedDelivery: o.estimated_delivery,
        }));
        setOrders(mappedOrders);
      }
    } catch (err) {
      console.warn('Error fetching orders:', err);
    } finally {
      setIsLoadingOrders(false);
    }
  }, []);

  // Fetch Customers (Profiles) from Supabase
  const fetchCustomers = useCallback(async () => {
    setIsLoadingCustomers(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Supabase fetchCustomers error:', error.message);
      } else if (data && data.length > 0) {
        const mappedCustomers: Customer[] = data.map((c: any) => ({
          id: c.id,
          name: c.full_name,
          email: c.email,
          phone: c.phone || '+234 800 000 0000',
          avatar: c.avatar_url,
          ordersCount: c.orders_count || 0,
          totalSpent: Number(c.total_spent || 0),
          joinedDate: new Date(c.created_at).toLocaleDateString('en-US', {
            month: 'short',
            year: 'numeric',
          }),
          status: c.status || 'Active',
        }));
        setCustomers(mappedCustomers);
      }
    } catch (err) {
      console.warn('Error fetching customers:', err);
    } finally {
      setIsLoadingCustomers(false);
    }
  }, []);

  // Fetch Notifications from Supabase
  const fetchNotifications = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        const mappedNotifs: NotificationItem[] = data.map((n: any) => ({
          id: n.id,
          title: n.title,
          message: n.message,
          date: new Date(n.created_at).toLocaleDateString(),
          read: n.read,
          type: n.type,
        }));
        setNotifications(mappedNotifs);
      }
    } catch (err) {
      console.warn('Error fetching notifications:', err);
    }
  }, []);

  // Sync Wishlist from Supabase for logged-in user
  const fetchWishlist = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('wishlists')
        .select('product_id')
        .eq('user_id', userId);

      if (!error && data) {
        setWishlist(data.map((w: any) => w.product_id));
      }
    } catch (err) {
      console.warn('Error fetching wishlist:', err);
    }
  }, []);

  // Sync Cart from Supabase for logged-in user
  const fetchCart = useCallback(async (userId: string, currentProds: Product[]) => {
    try {
      const { data, error } = await supabase
        .from('cart_items')
        .select('*')
        .eq('user_id', userId);

      if (!error && data && data.length > 0) {
        const mapped: CartItem[] = [];
        for (const item of data) {
          const prod = currentProds.find((p) => p.id === item.product_id);
          if (prod) {
            mapped.push({
              product: prod,
              selectedColor: item.selected_color,
              selectedSize: item.selected_size,
              quantity: item.quantity,
            });
          }
        }
        if (mapped.length > 0) {
          setCart(mapped);
        }
      }
    } catch (err) {
      console.warn('Error fetching cart:', err);
    }
  }, []);

  // Initialize Auth state listener
  useEffect(() => {
    let isMounted = true;

    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!isMounted) return;
      if (session?.user) {
        loadUserProfile(session.user.id, session.user.email || '');
        fetchWishlist(session.user.id);
      } else {
        setUser(null);
      }
      setAuthLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!isMounted) return;
      if (session?.user) {
        await loadUserProfile(session.user.id, session.user.email || '');
        fetchWishlist(session.user.id);
      } else {
        setUser(null);
      }
      setAuthLoading(false);
    });

    // Initial data fetch
    fetchProducts();
    fetchOrders();
    fetchCustomers();
    fetchNotifications();

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [loadUserProfile, fetchWishlist, fetchProducts, fetchOrders, fetchCustomers, fetchNotifications]);

  // Auth Operations
  const login = async (email: string, password = 'Password123!'): Promise<{ error: Error | null }> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        return { error };
      }

      if (data.user) {
        await loadUserProfile(data.user.id, data.user.email || email);
      }
      return { error: null };
    } catch (err: any) {
      return { error: err };
    }
  };

  const signup = async (
    name: string,
    email: string,
    password = 'Password123!',
    phone = ''
  ): Promise<{ error: Error | null }> => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: name,
            phone,
            role: 'customer',
          },
        },
      });

      if (error) {
        return { error };
      }

      if (data.user) {
        // Explicitly ensure profile is created in public.profiles table
        await supabase
          .from('profiles')
          .upsert({
            id: data.user.id,
            email: email.trim(),
            full_name: name,
            phone,
            role: 'customer',
            tier: 'Member',
            status: 'Active',
          })
          .select();

        await loadUserProfile(data.user.id, data.user.email || email);
      }
      return { error: null };
    } catch (err: any) {
      return { error: err };
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.warn('SignOut error:', err);
    } finally {
      setUser(null);
    }
  };

  const updateAddress = async (newAddr: Partial<UserProfile['address']>) => {
    if (!user) return;
    const updatedAddress = {
      ...user.address,
      ...newAddr,
    };

    setUser({
      ...user,
      address: updatedAddress,
    });

    try {
      await supabase.from('delivery_addresses').upsert({
        user_id: user.id,
        full_name: updatedAddress.fullName,
        street: updatedAddress.street,
        city: updatedAddress.city,
        state: updatedAddress.state,
        postal_code: updatedAddress.postalCode,
        phone: updatedAddress.phone,
        is_default: true,
      });
    } catch (err) {
      console.warn('Error updating address in Supabase:', err);
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return;
    setUser({ ...user, ...updates });

    try {
      await supabase.from('profiles').update({
        full_name: updates.name ?? user.name,
        phone: updates.phone ?? user.phone,
        avatar_url: updates.avatar ?? user.avatar,
        tier: updates.tier ?? user.tier,
      }).eq('id', user.id);
    } catch (err) {
      console.warn('Error updating profile in Supabase:', err);
    }
  };

  // Cart operations
  const addToCart = async (product: Product, color: string, size: number, quantity = 1) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) =>
          item.product.id === product.id &&
          item.selectedColor === color &&
          item.selectedSize === size
      );
      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: next[existingIndex].quantity + quantity,
        };
        return next;
      }
      return [...prev, { product, selectedColor: color, selectedSize: size, quantity }];
    });

    if (user) {
      try {
        await supabase.from('cart_items').upsert(
          {
            user_id: user.id,
            product_id: product.id,
            selected_color: color,
            selected_size: size,
            quantity,
          },
          { onConflict: 'user_id,product_id,selected_color,selected_size' }
        );
      } catch (err) {
        console.warn('Failed to sync cart item to Supabase:', err);
      }
    }
  };

  const removeFromCart = async (productId: string, color: string, size: number) => {
    setCart((prev) =>
      prev.filter(
        (item) =>
          !(
            item.product.id === productId &&
            item.selectedColor === color &&
            item.selectedSize === size
          )
      )
    );

    if (user) {
      try {
        await supabase
          .from('cart_items')
          .delete()
          .eq('user_id', user.id)
          .eq('product_id', productId)
          .eq('selected_color', color)
          .eq('selected_size', size);
      } catch (err) {
        console.warn('Failed to remove cart item from Supabase:', err);
      }
    }
  };

  const updateCartQuantity = async (
    productId: string,
    color: string,
    size: number,
    delta: number
  ) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (
            item.product.id === productId &&
            item.selectedColor === color &&
            item.selectedSize === size
          ) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );

    if (user) {
      try {
        const item = cart.find(
          (i) =>
            i.product.id === productId &&
            i.selectedColor === color &&
            i.selectedSize === size
        );
        if (item) {
          const newQty = item.quantity + delta;
          if (newQty <= 0) {
            await supabase
              .from('cart_items')
              .delete()
              .eq('user_id', user.id)
              .eq('product_id', productId)
              .eq('selected_color', color)
              .eq('selected_size', size);
          } else {
            await supabase.from('cart_items').upsert(
              {
                user_id: user.id,
                product_id: productId,
                selected_color: color,
                selected_size: size,
                quantity: newQty,
              },
              { onConflict: 'user_id,product_id,selected_color,selected_size' }
            );
          }
        }
      } catch (err) {
        console.warn('Failed to update cart quantity in Supabase:', err);
      }
    }
  };

  const clearCart = async () => {
    setCart([]);
    if (user) {
      try {
        await supabase.from('cart_items').delete().eq('user_id', user.id);
      } catch (err) {
        console.warn('Failed to clear cart in Supabase:', err);
      }
    }
  };

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  // Wishlist operations
  const toggleWishlist = async (productId: string) => {
    const isPresent = wishlist.includes(productId);
    const updatedWishlist = isPresent
      ? wishlist.filter((id) => id !== productId)
      : [...wishlist, productId];

    setWishlist(updatedWishlist);

    if (user) {
      try {
        if (isPresent) {
          await supabase
            .from('wishlists')
            .delete()
            .eq('user_id', user.id)
            .eq('product_id', productId);
        } else {
          await supabase.from('wishlists').insert({
            user_id: user.id,
            product_id: productId,
          });
        }
      } catch (err) {
        console.warn('Failed to sync wishlist to Supabase:', err);
      }
    }
  };

  const isWishlisted = (productId: string) => wishlist.includes(productId);

  // Orders
  const placeOrder = async (deliveryMethod: string, shippingFee: number): Promise<Order> => {
    const orderNumber = `SHO-${Math.floor(100000 + Math.random() * 900000)}`;
    const trackingCode = `SHO-EXP-${Math.floor(100000 + Math.random() * 900000)}-NGA`;
    const orderDate = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

    const shippingAddress = user?.address || {
      fullName: 'Client Patron',
      street: '12 Freedom Street',
      city: 'Calabar',
      state: 'Cross River State',
      postalCode: '540001',
      phone: '+234 806 123 4567',
    };

    const newOrder: Order = {
      id: `ord-${Date.now().toString().slice(-4)}`,
      orderNumber,
      date: orderDate,
      items: cart.map((ci) => ({
        productId: ci.product.id,
        productName: ci.product.name,
        color: ci.selectedColor,
        size: ci.selectedSize,
        quantity: ci.quantity,
        unitPrice: ci.product.price,
        image: ci.product.image,
      })),
      subtotal: cartTotal,
      shippingFee,
      total: cartTotal + shippingFee,
      status: 'Processing',
      deliveryMethod,
      shippingAddress,
      trackingCode,
      estimatedDelivery: 'In 3-4 days',
    };

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();

    // Persist to Supabase
    try {
      const { data: dbOrder, error: orderError } = await supabase
        .from('orders')
        .insert({
          order_number: orderNumber,
          user_id: user?.id || null,
          status: 'Processing',
          subtotal: cartTotal,
          shipping_fee: shippingFee,
          total: cartTotal + shippingFee,
          delivery_method: deliveryMethod,
          shipping_address: shippingAddress,
          tracking_code: trackingCode,
          estimated_delivery: 'In 3-4 days',
        })
        .select()
        .single();

      if (!orderError && dbOrder) {
        newOrder.id = dbOrder.id;

        // Insert items
        const itemsToInsert = newOrder.items.map((it) => ({
          order_id: dbOrder.id,
          product_id: it.productId,
          product_name: it.productName,
          color: it.color,
          size: it.size,
          quantity: it.quantity,
          unit_price: it.unitPrice,
          image: it.image,
        }));

        await supabase.from('order_items').insert(itemsToInsert);

        // Add Notification
        await supabase.from('notifications').insert({
          user_id: user?.id || null,
          title: `Order ${orderNumber} Confirmed`,
          message: 'Your bespoke footwear parcel is being handcrafted and prepared for dispatch.',
          read: false,
          type: 'order',
        });
      }
    } catch (err) {
      console.warn('Failed to persist order to Supabase:', err);
    }

    return newOrder;
  };

  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    setOrders((prev) =>
      prev.map((order) => (order.id === orderId ? { ...order, status } : order))
    );

    try {
      await supabase.from('orders').update({ status }).eq('id', orderId);
    } catch (err) {
      console.warn('Failed to update order status in Supabase:', err);
    }
  };

  // Products (Admin)
  const addProduct = async (p: Omit<Product, 'id'>): Promise<Product | null> => {
    const generatedId = `prod-${Date.now()}`;
    const newProd: Product = {
      ...p,
      id: generatedId,
    };

    setProducts((prev) => [newProd, ...prev]);

    try {
      const { data, error } = await supabase
        .from('products')
        .insert({
          id: generatedId,
          name: p.name,
          subtitle: p.subtitle,
          category_id: p.category,
          price: p.price,
          original_price: p.originalPrice || null,
          rating: p.rating,
          reviews_count: p.reviewsCount,
          image: p.image,
          badge: p.badge || null,
          description: p.description,
          craft_details: p.craftDetails,
          colors: p.colors,
          sizes: p.sizes,
          stock_count: p.stockCount,
          featured: p.featured || false,
        })
        .select()
        .single();

      if (error) {
        console.warn('Failed to add product to Supabase:', error.message);
      }
      return newProd;
    } catch (err) {
      console.warn('Error adding product to Supabase:', err);
      return newProd;
    }
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((prod) => (prod.id === id ? { ...prod, ...updates } : prod))
    );

    try {
      const dbUpdates: any = {};
      if (updates.name !== undefined) dbUpdates.name = updates.name;
      if (updates.subtitle !== undefined) dbUpdates.subtitle = updates.subtitle;
      if (updates.category !== undefined) dbUpdates.category_id = updates.category;
      if (updates.price !== undefined) dbUpdates.price = updates.price;
      if (updates.originalPrice !== undefined) dbUpdates.original_price = updates.originalPrice;
      if (updates.rating !== undefined) dbUpdates.rating = updates.rating;
      if (updates.reviewsCount !== undefined) dbUpdates.reviews_count = updates.reviewsCount;
      if (updates.image !== undefined) dbUpdates.image = updates.image;
      if (updates.badge !== undefined) dbUpdates.badge = updates.badge;
      if (updates.description !== undefined) dbUpdates.description = updates.description;
      if (updates.craftDetails !== undefined) dbUpdates.craft_details = updates.craftDetails;
      if (updates.colors !== undefined) dbUpdates.colors = updates.colors;
      if (updates.sizes !== undefined) dbUpdates.sizes = updates.sizes;
      if (updates.stockCount !== undefined) dbUpdates.stock_count = updates.stockCount;
      if (updates.featured !== undefined) dbUpdates.featured = updates.featured;

      await supabase.from('products').update(dbUpdates).eq('id', id);
    } catch (err) {
      console.warn('Failed to update product in Supabase:', err);
    }
  };

  const deleteProduct = async (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));

    try {
      await supabase.from('products').delete().eq('id', id);
    } catch (err) {
      console.warn('Failed to delete product in Supabase:', err);
    }
  };

  // Customers (Admin)
  const addCustomer = async (
    cust: Omit<Customer, 'id' | 'ordersCount' | 'totalSpent' | 'joinedDate'>
  ) => {
    const newCust: Customer = {
      ...cust,
      id: `cust-${Date.now()}`,
      ordersCount: 0,
      totalSpent: 0,
      joinedDate: 'Today',
    };
    setCustomers((prev) => [newCust, ...prev]);
  };

  // Notifications
  const markNotificationRead = async (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );

    try {
      await supabase.from('notifications').update({ read: true }).eq('id', id);
    } catch (err) {
      console.warn('Failed to mark notification read in Supabase:', err);
    }
  };

  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  // Barber Shop State
  const [services, setServices] = useState<BarberService[]>([]);
  const [isLoadingServices, setIsLoadingServices] = useState(false);
  const [bookings, setBookings] = useState<BarberBooking[]>([]);
  const [isLoadingBookings, setIsLoadingBookings] = useState(false);

  // Fetch Services from Supabase
  const fetchServices = useCallback(async () => {
    setIsLoadingServices(true);
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('price', { ascending: true });

      if (error) {
        console.warn('Supabase fetchServices error:', error.message);
      } else if (data) {
        setServices(
          data.map((s: any) => ({
            id: s.id,
            name: s.name,
            duration_minutes: s.duration_minutes,
            price: Number(s.price),
            description: s.description || '',
            is_active: s.is_active ?? true,
          }))
        );
      }
    } catch (err) {
      console.warn('Error fetching services:', err);
    } finally {
      setIsLoadingServices(false);
    }
  }, []);

  // Fetch Bookings from Supabase (RLS handles filtering: admin sees all, member sees own)
  const fetchBookings = useCallback(async () => {
    setIsLoadingBookings(true);
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          items:booking_items(*)
        `)
        .order('booking_date', { ascending: false })
        .order('booking_time', { ascending: false });

      if (error) {
        console.warn('Supabase fetchBookings error:', error.message);
      } else if (data) {
        const mapped: BarberBooking[] = data.map((b: any) => ({
          id: b.id,
          reference: b.reference,
          user_id: b.user_id,
          customer_name: b.customer_name,
          customer_email: b.customer_email,
          customer_phone: b.customer_phone || '',
          booking_date: b.booking_date,
          booking_date_label: b.booking_date_label || b.booking_date,
          booking_time: b.booking_time,
          total_price: Number(b.total_price),
          status: b.status,
          payment_method: b.payment_method,
          payment_status: b.payment_status,
          payment_reference: b.payment_reference,
          created_at: b.created_at,
          items: b.items?.map((it: any) => ({
            id: it.id,
            booking_id: it.booking_id,
            service_id: it.service_id,
            service_name: it.service_name,
            duration_minutes: it.duration_minutes,
            price: Number(it.price),
          })),
        }));
        setBookings(mapped);
      }
    } catch (err) {
      console.warn('Error fetching bookings:', err);
    } finally {
      setIsLoadingBookings(false);
    }
  }, []);

  // Create booking atomically
  const createBooking = async (params: {
    bookingDate: string;
    bookingDateLabel: string;
    bookingTime: string;
    customerName: string;
    customerEmail: string;
    customerPhone?: string;
    totalPrice: number;
    paymentMethod: 'card' | 'atelier';
    serviceIds: string[];
  }) => {
    try {
      const { data, error } = await supabase.rpc('create_booking_atomic', {
        p_booking_date: params.bookingDate,
        p_booking_time: params.bookingTime,
        p_customer_name: params.customerName,
        p_customer_email: params.customerEmail,
        p_customer_phone: params.customerPhone || '',
        p_booking_date_label: params.bookingDateLabel,
        p_total_price: params.totalPrice,
        p_payment_method: params.paymentMethod,
        p_service_ids: params.serviceIds,
      });

      if (error) {
        return { error: error.message };
      }

      await fetchBookings();
      return { data, error: null };
    } catch (err: any) {
      return { error: err.message || 'Failed to create booking' };
    }
  };

  // Admin: Approve booking (sets status='confirmed')
  const approveBooking = async (bookingId: string) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: 'confirmed', updated_at: new Date().toISOString() })
        .eq('id', bookingId);

      if (error) {
        return { success: false, error: error.message };
      }

      setBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? { ...b, status: 'confirmed' } : b))
      );
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to approve booking' };
    }
  };

  // Admin: Reject booking (sets status='cancelled')
  const rejectBooking = async (bookingId: string) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: 'cancelled', updated_at: new Date().toISOString() })
        .eq('id', bookingId);

      if (error) {
        return { success: false, error: error.message };
      }

      setBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? { ...b, status: 'cancelled' } : b))
      );
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to reject booking' };
    }
  };

  // Member: Cancel own booking (sets status='cancelled' enforced by RLS)
  const cancelBooking = async (bookingId: string) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: 'cancelled', updated_at: new Date().toISOString() })
        .eq('id', bookingId);

      if (error) {
        return { success: false, error: error.message };
      }

      setBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? { ...b, status: 'cancelled' } : b))
      );
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to cancel appointment' };
    }
  };

  // Initial load of services and bookings on mount or when user changes
  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  useEffect(() => {
    if (user) {
      fetchBookings();
    }
  }, [user, fetchBookings]);

  return (
    <ShoContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        authLoading,
        login,
        signup,
        logout,
        updateAddress,
        updateProfile,
        products,
        isLoadingProducts,
        fetchProducts,
        addProduct,
        updateProduct,
        deleteProduct,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartCount,
        cartTotal,
        wishlist,
        toggleWishlist,
        isWishlisted,
        orders,
        isLoadingOrders,
        fetchOrders,
        placeOrder,
        updateOrderStatus,
        customers,
        isLoadingCustomers,
        fetchCustomers,
        addCustomer,
        notifications,
        markNotificationRead,
        unreadNotificationsCount,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        services,
        isLoadingServices,
        fetchServices,
        bookings,
        isLoadingBookings,
        fetchBookings,
        createBooking,
        approveBooking,
        rejectBooking,
        cancelBooking,
      }}>
      {children}
    </ShoContext.Provider>
  );
}

export function useSho() {
  const context = useContext(ShoContext);
  if (!context) {
    throw new Error('useSho must be used within a ShoProvider');
  }
  return context;
}
