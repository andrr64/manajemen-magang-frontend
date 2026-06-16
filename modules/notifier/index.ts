import toast from 'react-hot-toast';

export const notifier = {
  success: (message: string) => {
    toast.success(message, {
      position: 'top-center',
    });
  },
  
  error: (message: string) => {
    toast.error(message, {
      position: 'top-center',
    });
  },
  
  promise: <T>(
    promise: Promise<T>,
    messages: { loading: string; success: string | ((data: T) => string); error: string | ((err: any) => string) }
  ) => {
    return toast.promise(promise, messages, {
      position: 'top-center',
    });
  },

  // Fallbacks or generic
  info: (message: string) => {
    toast(message, {
      position: 'top-center',
    });
  }
};
