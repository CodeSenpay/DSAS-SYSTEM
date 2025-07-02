import { toast, type ToastOptions } from "react-toastify";

const defaultOptions: ToastOptions = {
    position: "top-center",
    autoClose: 4000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored",
};

export const notifySuccess = (message: string, options?: ToastOptions) =>
    toast.success(message, { ...defaultOptions, ...options });

export const notifyError = (message: string, options?: ToastOptions) =>
    toast.error(message, { ...defaultOptions, ...options });

export const notifyInfo = (message: string, options?: ToastOptions) =>
    toast.info(message, { ...defaultOptions, ...options });
