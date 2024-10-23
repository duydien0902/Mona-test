import { Radio } from "antd";
import type { RadioChangeEvent } from "antd";
import { useState, useEffect } from "react";

export default function RadioMethodPayment({
  handleChange,
}: {
  handleChange: (v: number) => void;
}) {
  const [value, setValue] = useState(1);
  useEffect(() => {
    handleChange(value);
  }, [value, handleChange]);

  const onChange = (e: RadioChangeEvent) => {
    const value = e.target.value;
    setValue(value);
  };
  return (
    <Radio.Group onChange={onChange} value={value}>
      <Radio value={1}>Tiền mặt</Radio>
      <Radio value={2}>Thẻ</Radio>
    </Radio.Group>
  );
}
