import { CSSProperties } from "react";
import toast from "react-hot-toast";
import { generateIcon } from "../generateIcon";

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

export const toastNotifyInfo = (message: string) =>
  toast(message, {
    ...toastConfig,
    icon: generateIcon("circle-info"),
    style: { ...toastConfig.style, backgroundColor: "#e0f7fa" },
  });
