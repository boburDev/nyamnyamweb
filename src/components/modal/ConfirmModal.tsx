import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

interface ConfirmModalProps {
  open: boolean;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmModal = ({
  open,
  message,
  onConfirm,
  onCancel,
}: ConfirmModalProps) => {
  const t = useTranslations("confirmModal");
  const handleDelete = () => {
    onConfirm();
    onCancel();
  };
  return (
    <AlertDialog open={open} onOpenChange={onCancel}>
      <AlertDialogContent className="border-input py-4">
        <AlertDialogHeader>
          <AlertDialogTitle className="font-medium">
            {t("deleteConfirm")}
          </AlertDialogTitle>
          <p className="text-textColor font-normal text-base my-4">{message}</p>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button
            variant="secondary"
            onClick={onCancel}
            className="rounded-[15px]"
          >
            {t("cancel")}
          </Button>
          <Button
            variant="destructive"
            className="px-5 rounded-[15px] !bg-red-500"
            onClick={handleDelete}
          >
            {t("delete")}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ConfirmModal;
