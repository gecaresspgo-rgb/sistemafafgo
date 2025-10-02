declare module 'vue-toastification' {
  export interface ToastOptions {
    position?: string;
    timeout?: number;
    closeOnClick?: boolean;
    pauseOnFocusLoss?: boolean;
    pauseOnHover?: boolean;
    draggable?: boolean;
    draggablePercent?: number;
    showCloseButtonOnHover?: boolean;
    hideProgressBar?: boolean;
    closeButton?: string | boolean;
    icon?: boolean | string;
    rtl?: boolean;
    maxToasts?: number;
    newestOnTop?: boolean;
    toastClassName?: string;
    bodyClassName?: string;
    containerClassName?: string;
    [key: string]: unknown;
  }

  export interface ToastInterface {
    success(message: string, options?: ToastOptions): void;
    error(message: string, options?: ToastOptions): void;
    info(message: string, options?: ToastOptions): void;
    warning(message: string, options?: ToastOptions): void;
    default(message: string, options?: ToastOptions): void;
    clear(): void;
    dismiss(id: string): void;
    update(id: string, options: ToastOptions): void;
  }

  export function useToast(): ToastInterface;
  export default function createToastInterface(options?: ToastOptions): ToastInterface;
}