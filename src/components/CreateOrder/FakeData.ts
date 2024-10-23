import caphe from "../../assets/image-products/caphe.jpg";
import bia from "../../assets/image-products/bia.jpg";
import ruou from "../../assets/image-products/ruou.jpg";
import cocktail from "../../assets/image-products/cocktail.jpg";
import camep from "../../assets/image-products/cam-ep.jpg";

export const productList = [
  {
    name: "cà phê",
    id: "1",
    image: caphe,
    price: "25000",
    quantity: 1,
    discountType: "amount",
    discountValue: 10000,
  },
  {
    name: "bia",
    id: "2",
    image: bia,
    price: "21000",
    quantity: 1,
    discountType: "percent",
    discountValue: 20,
  },
  {
    name: "rượu",
    id: "3",
    image: ruou,
    price: "50000",
    quantity: 1,
    discountType: "percent",
    discountValue: 10,
  },
  {
    name: "cocktail",
    id: "4",
    image: cocktail,
    price: "40000",
    quantity: 1,
    discountType: "amount",
    discountValue: 5000,
  },
  {
    name: "cam ép",
    id: "5",
    image: camep,
    price: "35000",
    quantity: 1,
    discountType: "percent",
    discountValue: 15,
  },
];

export const selectsProducts = [
  {
    value: "2",
    label: "bia",
  },
  {
    value: "5",
    label: "cam ép",
  },
  {
    value: "1",
    label: "cà phê",
  },
  {
    value: "4",
    label: "cocktail",
  },
  {
    value: "3",
    label: "rượu",
  },
];
