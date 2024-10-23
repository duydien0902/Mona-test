export interface Product {
  name: string;
  id: string;
  image: string;
  price: string | number;
  quantity: number;
  discountType: string;
  discountValue: number;
}

export type ProductList = Product[];
