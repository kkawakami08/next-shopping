export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "Prostore";
export const APP_DESCRIPTION =
  process.env.NEXT_PUBLIC_APP_DESCRIPTION ||
  "A modern ecommerce store built with Next.js";

export const SERVER_URL =
  process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000";

export const LATEST_PRODUCTS_LIMIT =
  Number(process.env.LATEST_PRODUCTS_LIMIT) || 4;

export const signInDefaultValues = {
  email: "",
  password: "",
};
export const signUpDefaultValues = {
  email: "",
  password: "",
  confirmPassword: "",
  name: "",
};

export const shippingAddressDefaultValues = {
  fullName: "",
  streetAddress: "",
  city: "",
  postalCode: "",
  country: "",
};

export const PAYMENT_METHODS = process.env.PAYMENT_METHODS
  ? process.env.PAYMENT_METHODS.split(", ")
  : ["PayPal", "Stripe", "CashOnDelivery"];

export const DEFAULT_PAYMENT_METHOD =
  process.env.DEFAULT_PAYMENT_METHOD || "PayPal";

export const PAGE_SIZE = Number(process.env.PAGE_SIZE) || 12;

export const productDefaultValues = {
  name: "",
  slug: "",
  category: "",
  images: [],
  brand: "",
  description: "",
  price: "0",
  stock: 0,
  rating: "0",
  numReviews: "0",
  isFeatured: false,
  banner: null,
};

export const USER_ROLES = process.env.USER_ROLES
  ? process.env.USER_ROLES.split(", ")
  : ["admin", "user"];

export const paths = {
  home: () => {
    return `/`;
  },
  cart: () => {
    return `/cart`;
  },
  signIn: () => {
    return `/sign-in`;
  },
  signUp: () => {
    return `/sign-up`;
  },
  shipping: () => {
    return `/shipping-address`;
  },
  paymentMethod: () => {
    return `/payment-method`;
  },
  placeOrder: () => {
    return `/place-order`;
  },
  searchCategory: (category: string) => {
    return `/search?category=${category}`;
  },
  product: (slug: string) => {
    return `/product/${slug}`;
  },
  order: (insertedOrderId: string) => {
    return `/order/${insertedOrderId}`;
  },
  profile: () => {
    return `/user/profile`;
  },
  userOrders: () => {
    return `/user/orders`;
  },
  overview: () => {
    return `/admin/overview`;
  },
  adminProducts: () => {
    return `/admin/products`;
  },
  adminProductPage: (productId: string) => {
    return `/admin/products/${productId}`;
  },
  adminCreateProduct: () => {
    return `/admin/products/create`;
  },
  adminOrders: () => {
    return `/admin/orders`;
  },
  adminUsers: () => {
    return `/admin/users`;
  },
  adminUserPage: (userId: string) => {
    return `/admin/users/${userId}`;
  },
  unauthorized: () => {
    return `/unauthorized`;
  },
};
