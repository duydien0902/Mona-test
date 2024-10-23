import { Product, ProductList } from "../types/product.type";

export function formatCurrency(currency: number) {
  return new Intl.NumberFormat("de-DE").format(currency);
}

export const calculateDiscountedPrice = (product: Product) => {
  const { price, discountType, discountValue } = product;
  let discountedPrice = Number(price);

  if (discountType === "percent") {
    discountedPrice = +price - +price * (discountValue / 100);
  } else if (discountType === "amount") {
    discountedPrice = +price - discountValue;
  }

  return discountedPrice;
};

export const calculateTotalPriceBeforeDiscount = (products: ProductList) => {
  return products.reduce(
    (sum, product) => sum + Number(product.price) * product.quantity,
    0
  );
};

export const calculateTotalDiscount = (products: ProductList) => {
  return products.reduce(
    (sum, product) =>
      sum +
      (Number(product.price) - calculateDiscountedPrice(product)) *
        product.quantity,
    0
  );
};
