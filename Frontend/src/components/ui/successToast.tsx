// ErrorToast.tsx
import React, { useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface SuccessToastProps {
  message: { message: string }[];
}

const SuccessToast: React.FC<SuccessToastProps> = ({ message }) => {
  useEffect(() => {
    if (message.length > 0) {
      message.forEach((error) => {
        toast.success(
          <div className="flex items-center space-x-2">
            <span>{error.message}</span>
          </div>
        );
      });
    }
  }, [message]);

  return <ToastContainer />;
};

export default SuccessToast;
