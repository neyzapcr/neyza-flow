import { AlertCircle, Trash2, AlertTriangle, Info } from "lucide-react";
import Modal from "./Modal";
import Button from "./Button";

const variantConfig = {
  danger: {
    Icon: Trash2,
    iconBg: "bg-red-100",
    iconColor: "text-red-500",
    confirmVariant: "danger",
  },
  warning: {
    Icon: AlertTriangle,
    iconBg: "bg-yellow-100",
    iconColor: "text-yellow-500",
    confirmVariant: "warning",
  },
  info: {
    Icon: Info,
    iconBg: "bg-blue-100",
    iconColor: "text-[#3ABDE8]",
    confirmVariant: "primary",
  },
};

export default function ConfirmModal({
  open,
  onClose,
  onConfirm,
  title        = "Konfirmasi",
  message      = "Apakah Anda yakin?",
  confirmLabel = "Hapus",
  cancelLabel  = "Batal",
  variant      = "danger",
  loading      = false,
}) {
  const cfg = variantConfig[variant] || variantConfig.danger;
  const { Icon } = cfg;

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="sm"
      hideClose
      footer={
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1"
            onClick={onClose}
            disabled={loading}
          >
            {cancelLabel}
          </Button>
          <Button
            variant={cfg.confirmVariant}
            className="flex-1"
            onClick={onConfirm}
            loading={loading}
          >
            {confirmLabel}
          </Button>
        </div>
      }
    >
      <div className="text-center">
        <div className={`w-12 h-12 ${cfg.iconBg} rounded-2xl flex items-center justify-center mx-auto mb-3`}>
          <Icon size={22} className={cfg.iconColor} />
        </div>
        <h3 className="font-bold text-gray-800 mb-2">{title}</h3>
        <p className="text-sm text-gray-500">{message}</p>
      </div>
    </Modal>
  );
}
