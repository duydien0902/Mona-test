import React from "react";
import { Select, Tag } from "antd";
import type { SelectProps } from "antd";

type TagRender = SelectProps["tagRender"];

const tagRender: TagRender = (props) => {
  const { label, closable, onClose } = props;
  const onPreventMouseDown = (event: React.MouseEvent<HTMLSpanElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };
  return (
    <Tag
      onMouseDown={onPreventMouseDown}
      closable={closable}
      onClose={onClose}
      style={{ marginInlineEnd: 4 }}
    >
      {label}
    </Tag>
  );
};

type SelectProductsProps = {
  onChange?: (value: string[]) => void;
  options: SelectProps["options"];
};

export default function SelectProducts({
  onChange,
  options,
}: SelectProductsProps) {
  return (
    <Select
      placeholder="hãy chọn sản phẩm"
      mode="multiple"
      tagRender={tagRender}
      onChange={onChange}
      style={{ width: "100%" }}
      options={options}
    />
  );
}
