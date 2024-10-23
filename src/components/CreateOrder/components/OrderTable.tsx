import { useEffect } from "react";
import { Table, InputNumber, Image } from "antd";
import type { ColumnsType } from "antd/es/table";

import { ProductList, Product } from "../../../types/product.type";
import {
  calculateTotalDiscount,
  calculateTotalPriceBeforeDiscount,
  formatCurrency,
} from "../../../utils";

const renderSummaryRow = (title: string, value: number, colSpan = 4) => (
  <Table.Summary.Row>
    <Table.Summary.Cell index={0} colSpan={colSpan}>
      <strong>{title}</strong>
    </Table.Summary.Cell>
    <Table.Summary.Cell index={1}>
      <strong>₫{formatCurrency(value)}</strong>
    </Table.Summary.Cell>
  </Table.Summary.Row>
);

interface OrderTableProps {
  selectProducts: ProductList;
  setSelectProducts: (value: Product[]) => void;
  onTotalPriceChange: (totalPrice: number) => void;
}

export default function OrderTable({
  selectProducts,
  setSelectProducts,
  onTotalPriceChange,
}: OrderTableProps) {
  const handleQuantityChange = (value: number, id: string) => {
    const updatedProducts = selectProducts.map((product) =>
      product.id === id ? { ...product, quantity: value } : product
    );
    setSelectProducts(updatedProducts);
  };

  const calculateTotalPrice = () => {
    const totalPriceBeforeDiscount =
      calculateTotalPriceBeforeDiscount(selectProducts);
    const totalDiscount = calculateTotalDiscount(selectProducts);
    return totalPriceBeforeDiscount - totalDiscount;
  };

  useEffect(() => {
    const totalPrice = calculateTotalPrice();
    onTotalPriceChange(totalPrice);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectProducts]);

  const columns: ColumnsType<Product> = [
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (image) => <Image src={image} width={100} />,
    },
    {
      title: "Product",
      dataIndex: "name",
      key: "name",
      render: (name) => <p className="capitalize">{name}</p>,
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price, product) => (
        <div className="space-y-1">
          <p>₫{formatCurrency(price)}</p>
          {product.discountType === "percent" && (
            <p className="text-red-500 text-xs">
              -{product.discountValue}% / sản phẩm
            </p>
          )}
          {product.discountType === "amount" && (
            <p className="text-red-500 text-xs">
              - ₫{formatCurrency(product.discountValue)} / sản phẩm
            </p>
          )}
        </div>
      ),
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      render: (quantity, record) => (
        <InputNumber
          min={1}
          value={quantity}
          onChange={(value) => handleQuantityChange(value as number, record.id)}
        />
      ),
    },
    {
      title: "Total",
      key: "total",
      render: (_, record) => {
        const total = Number(record.price) * record.quantity;
        return <span>₫{formatCurrency(total)}</span>;
      },
    },
  ];

  return (
    <div>
      <Table
        columns={columns}
        dataSource={selectProducts}
        pagination={false}
        summary={() => {
          const totalPriceBeforeDiscount =
            calculateTotalPriceBeforeDiscount(selectProducts);
          const totalDiscount = calculateTotalDiscount(selectProducts);
          const totalPriceAfterDiscount =
            totalPriceBeforeDiscount - totalDiscount;

          return (
            <>
              {renderSummaryRow(
                "Tổng tiền (chưa giảm)",
                totalPriceBeforeDiscount
              )}
              {renderSummaryRow("Giảm giá", -totalDiscount, 4)}
              {renderSummaryRow("Tổng tiền", totalPriceAfterDiscount)}
            </>
          );
        }}
      />
    </div>
  );
}
