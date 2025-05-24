import toast from "react-hot-toast";
import { CSSProperties } from "react";

interface ToastConfig {
  duration: number;
  style: { textAlign: CSSProperties["textAlign"] };
}

const toastConfig: ToastConfig = {
  duration: 3000,
  style: { textAlign: "center" },
};

// Toast Notifications
export const toastNotifyError = (message: string) =>
  toast.error(message, toastConfig);

export const toastNotifySuccess = (message: string) =>
  toast.success(message, toastConfig);
