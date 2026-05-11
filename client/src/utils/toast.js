import { Toaster, toast } from 'react-hot-toast';

export { Toaster };

export const showToast = {
  success: (message) => toast.success(message, {
    duration: 3000,
    style: {
      background: '#10b981',
      color: '#fff',
      borderRadius: '8px',
      fontSize: '14px'
    }
  }),
  
  error: (message) => toast.error(message, {
    duration: 3000,
    style: {
      background: '#ef4444',
      color: '#fff',
      borderRadius: '8px',
      fontSize: '14px'
    }
  }),
  
  loading: (message) => toast.loading(message, {
    style: {
      background: '#3b82f6',
      color: '#fff',
      borderRadius: '8px',
      fontSize: '14px'
    }
  }),
  
  invalidLogin: (message) => {
    const t = toast.error(message, {
      duration: 2000,
      style: {
        background: '#dc2626',
        color: '#fff',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: '600'
      }
    });
    return t;
  }
};

export default showToast;
