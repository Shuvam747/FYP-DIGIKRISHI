// ErrorToast.tsx
import React, { useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface ErrorToastProps {
  errors: { message: string }[];
}

const ErrorToast: React.FC<ErrorToastProps> = ({ errors }) => {
  useEffect(() => {
    if (errors.length > 0) {
      errors.forEach((error) => {
        toast.error(
          <div className="flex items-center space-x-2">
            <span>{error.message}</span>
          </div>
        );
      });
    }
  }, [errors]);

  return <ToastContainer />;
};

export default ErrorToast;
