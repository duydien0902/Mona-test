import { Modal } from "antd";

interface ConfirmOrderProps {
  isOpen: boolean;
  onOkConfirm: () => void;
  onCancelConfirm: () => void;
  children: React.ReactNode;
  title: string;
}

export default function ConfirmOrder({
  isOpen,
  onOkConfirm,
  onCancelConfirm,
  children,
  title,
}: ConfirmOrderProps) {
  return (
    <>
      <Modal
        title={title}
        open={isOpen}
        onOk={onOkConfirm}
        onCancel={onCancelConfirm}
        okText="OK"
        cancelText="Cancel"
      >
        {children}
      </Modal>
    </>
  );
}
