import { useEffect, useState } from "react";
import { Button, Form, Input } from "antd";
import type { FormProps } from "antd";

import { Product, ProductList } from "../../types/product.type";

import { selectsProducts, productList } from "./FakeData";
import SelectProducts from "./components/SelectProducts";
import OrderTable from "./components/OrderTable";
import RadioMethodPayment from "./components/RadioMethodPayment";
import ConfirmOrder from "../ConfirmOrder";
import { calculateDiscountedPrice, formatCurrency } from "../../utils";

type FieldType = {
  fullname?: string;
  email?: string;
  phone?: string;
  order?: string[];
  option?: number;
  customer_money?: string;
};

export default function CreateOrder() {
  const [selectProducts, setSelectProducts] = useState<ProductList | null>(
    null
  );
  const [openConfirm, setOpenConfirm] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [checkoutProduct, setCheckoutProduct] = useState<any | null>(null);
  const [customerMoney, setCustomerMoney] = useState<string | null>(null);

  // Tổng tiền đơn hàng
  const [totalPrice, setTotalPrice] = useState<number>(0);

  // Tiền thừa
  const [change, setChange] = useState<number | null>(null);

  const [form] = Form.useForm();

  const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
    setCheckoutProduct({
      customerInfo: {
        fullname: values.fullname,
        email: values.email,
        phone: values.phone,
      },
      products: selectProducts,
      paymentMethod: values.option,
      customerMoney: values.customer_money,
      totalPrice: totalPrice,
      back_money: change,
    });
    setOpenConfirm(true);
  };

  const handleReset = () => {
    form.resetFields();
    setSelectProducts(null);
    setCustomerMoney(null);
    setTotalPrice(0);
    setChange(null);
  };

  const handleTotalPriceChange = (newTotalPrice: number) => {
    setTotalPrice(newTotalPrice);
  };

  const handleChangeSelectProduct = (selectedValues: string[]) => {
    if (selectedValues?.length <= 0) {
      setSelectProducts(null);
      return;
    }
    const result: ProductList = selectedValues.map((value) => {
      return productList.find((item) => value === item.id) as Product;
    });
    setSelectProducts(result);
  };

  const handleChangeRadio = (value: number) => {
    form.setFieldsValue({ option: value });
  };

  useEffect(() => {
    if (customerMoney !== null && totalPrice !== null) {
      const calculatedChange = +customerMoney - totalPrice;
      // Tiền thừa không thể âm
      setChange(calculatedChange > 0 ? calculatedChange : 0);
    }
  }, [customerMoney, totalPrice]);

  const onOkConfirm = () => {
    handleReset();
    setOpenConfirm(false);
  };

  const onCancelConfirm = () => {
    setOpenConfirm(false);
  };

  return (
    <div className="space-y-12 min-h-screen max-w-7xl mx-auto px-4 sm:px-6">
      <h1 className="text-3xl font-semibold pt-10">Tạo đơn hàng</h1>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        autoComplete="off"
      >
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-4">
            <div className="sticky top-12 space-y-8">
              <div className="bg-white p-6 rounded-md">
                <Form.Item<FieldType>
                  label="Họ và tên KH"
                  name="fullname"
                  rules={[
                    { required: true, message: "Hãy nhập Họ và tên KH!" },
                  ]}
                >
                  <Input placeholder="Nhập Họ và tên KH..." />
                </Form.Item>
                <Form.Item<FieldType>
                  label="Email"
                  name="email"
                  rules={[
                    {
                      type: "email",
                      message: "Email không đúng đinh dạng!",
                    },
                    {
                      required: true,
                      message: "Hãy nhâpk emai KH",
                    },
                  ]}
                >
                  <Input placeholder="Nhập email..." />
                </Form.Item>
                <Form.Item<FieldType>
                  label="Sdt"
                  name="phone"
                  rules={[
                    {
                      required: true,
                      message: "Hãy nhập số điện thoại Kh!",
                    },
                    {
                      pattern:
                        /^(0?)(3[2-9]|5[6|8|9]|7[0|6-9]|8[1-9]|9[0-9])[0-9]{7}$/,
                      message: "Số điện thoại KH không đúng định dạng!",
                    },
                  ]}
                >
                  <Input placeholder="Nhập só điện thoại..." />
                </Form.Item>
              </div>
              <div className="bg-white p-6 rounded-md">
                <Form.Item<FieldType>
                  name="order"
                  label=""
                  rules={[{ required: true, message: "Hãy chọn sản phẩm!" }]}
                >
                  <SelectProducts
                    onChange={handleChangeSelectProduct}
                    options={selectsProducts}
                  />
                </Form.Item>
              </div>
            </div>
          </div>
          <div className="col-span-8 bg-white rounded-md p-6 flex flex-col gap-y-6">
            <h3 className="capitalize text-xl font-medium">
              chi tiết đơn hàng
            </h3>
            <div className="flex-1">
              {selectProducts ? (
                <OrderTable
                  selectProducts={selectProducts}
                  setSelectProducts={setSelectProducts}
                  onTotalPriceChange={handleTotalPriceChange}
                />
              ) : (
                <div className="text-center">Không có dữ liệu!</div>
              )}
            </div>
            <div className="space-y-2">
              <h3 className="text-lg">Phương thức thanh toán:</h3>
              <Form.Item<FieldType>
                name="option"
                rules={[{ required: true, message: "Please select option!" }]}
              >
                <RadioMethodPayment handleChange={handleChangeRadio} />
              </Form.Item>
            </div>
            <div>
              <Form.Item<FieldType>
                name="customer_money"
                label="Tiền khách đưa"
                rules={[
                  {
                    required: true,
                    message: "Hãy nhập số tiền khách đưa!",
                  },
                  {
                    pattern: /^\d+$/,
                    message: "không đúng định dạng là số",
                  },
                  () => ({
                    validator(_, value) {
                      if (!value || parseFloat(value) >= totalPrice) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error(
                          "Số tiền khách đưa phải lớn hơn hoặc bằng tổng tiền!"
                        )
                      );
                    },
                  }),
                ]}
              >
                <Input
                  placeholder="Nhập số tiền khách hàng..."
                  onChange={(e) => setCustomerMoney(e.target.value)}
                />
              </Form.Item>
            </div>
            <div className="space-y-2">
              <p>
                <strong>Tổng tiền đơn hàng:</strong>{" "}
                {totalPrice.toLocaleString()} VND
              </p>
              <p>
                <strong>Tiền thừa trả lại:</strong>{" "}
                {change !== null ? change.toLocaleString() : 0} VND
              </p>
            </div>
            <div className="w-full flex items-center">
              <Form.Item className="w-full flex items-center">
                <Button
                  type="primary"
                  htmlType="submit"
                  className=" h-12 font-semibold"
                >
                  Thanh toán
                </Button>
                <Button
                  type="default"
                  className="ml-4 h-12 font-semibold"
                  onClick={handleReset}
                >
                  Reset
                </Button>
              </Form.Item>
            </div>
          </div>
        </div>
      </Form>
      {openConfirm && (
        <ConfirmOrder
          title="Xác nhận đơn hàng"
          onOkConfirm={onOkConfirm}
          onCancelConfirm={onCancelConfirm}
          isOpen={openConfirm}
        >
          <div className="space-y-4">
            <div>
              <div className="text-xs">
                <p>
                  Họ và tên KH:
                  <span className="capitalize ml-1">
                    {checkoutProduct.customerInfo.fullname}
                  </span>
                </p>
                <p>Sdt: {checkoutProduct.customerInfo.phone}</p>
                <p>Email: {checkoutProduct.customerInfo.email}</p>
              </div>
            </div>
            <div className="space-y-2">
              {checkoutProduct?.products.map((item: Product) => (
                <div className="capitalize grid grid-cols-4 gap-2">
                  <div className="col-span-1">
                    <p>{item.name}</p>
                  </div>
                  <div className="col-span-1">
                    <p>{item.quantity}</p>
                  </div>
                  <div className="col-span-1">
                    <p>
                      {" "}
                      {item.discountType === "percent" && (
                        <p className="text-red-500 text-xs">
                          -{item.discountValue}%
                        </p>
                      )}
                      {item.discountType === "amount" && (
                        <p className="text-red-500 text-xs">
                          - ₫{formatCurrency(item.discountValue)}
                        </p>
                      )}
                    </p>
                  </div>
                  <div className="col-span-1">
                    <p>
                      ₫
                      {formatCurrency(
                        calculateDiscountedPrice(item) * item.quantity
                      )}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <hr />
            <div className="grid grid-cols-4 gap-2">
              <div className="col-span-3">Tổng tiền</div>
              <div className="col-span-1">
                ₫{formatCurrency(checkoutProduct.totalPrice)}
              </div>
            </div>
            <div>
              <p>
                Tiền khách trả: ₫
                {formatCurrency(+checkoutProduct.customerMoney)}
              </p>
              <p>Tiền thừa: ₫{formatCurrency(checkoutProduct.back_money)}</p>
            </div>
          </div>
        </ConfirmOrder>
      )}
    </div>
  );
}
