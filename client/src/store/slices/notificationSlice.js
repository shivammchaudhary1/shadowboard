import { createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

// Initial state for notifications
const initialState = {
  notifications: [],
  isLoading: false,
};

// Create notification slice
const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    // Show success notification
    showSuccess: (state, action) => {
      const { message, duration = 4000 } = action.payload;
      toast.success(message, {
        duration,
        position: "top-right",
      });

      // Store notification in state for history if needed
      state.notifications.push({
        id: Date.now(),
        type: "success",
        message,
        timestamp: new Date().toISOString(),
      });
    },

    // Show error notification
    showError: (state, action) => {
      const { message, duration = 5000 } = action.payload;
      toast.error(message, {
        duration,
        position: "top-right",
      });

      state.notifications.push({
        id: Date.now(),
        type: "error",
        message,
        timestamp: new Date().toISOString(),
      });
    },

    // Show info notification
    showInfo: (state, action) => {
      const { message, duration = 3000 } = action.payload;
      toast(message, {
        duration,
        position: "top-right",
        icon: "ℹ️",
      });

      state.notifications.push({
        id: Date.now(),
        type: "info",
        message,
        timestamp: new Date().toISOString(),
      });
    },

    // Show warning notification
    showWarning: (state, action) => {
      const { message, duration = 4000 } = action.payload;
      toast(message, {
        duration,
        position: "top-right",
        icon: "⚠️",
        style: {
          background: "#f59e0b",
          color: "#fff",
        },
      });

      state.notifications.push({
        id: Date.now(),
        type: "warning",
        message,
        timestamp: new Date().toISOString(),
      });
    },

    // Show loading notification
    showLoading: (state, action) => {
      const { message = "Loading..." } = action.payload || {};
      state.isLoading = true;

      toast.loading(message, {
        id: "loading",
        position: "top-center",
      });
    },

    // Hide loading notification
    hideLoading: (state) => {
      state.isLoading = false;
      toast.dismiss("loading");
    },

    // Show custom notification
    showCustom: (state, action) => {
      const { message, options = {} } = action.payload;
      toast(message, {
        position: "top-right",
        ...options,
      });

      state.notifications.push({
        id: Date.now(),
        type: "custom",
        message,
        timestamp: new Date().toISOString(),
      });
    },

    // Clear all notifications from state (not from screen)
    clearNotifications: (state) => {
      state.notifications = [];
    },

    // Dismiss all visible toasts
    dismissAll: () => {
      toast.dismiss();
    },
  },
});

// Export actions
export const {
  showSuccess,
  showError,
  showInfo,
  showWarning,
  showLoading,
  hideLoading,
  showCustom,
  clearNotifications,
  dismissAll,
} = notificationSlice.actions;

// Export reducer
export default notificationSlice.reducer;

/* 
==============================================
USAGE EXAMPLES FOR HOME.JSX OR ANY COMPONENT:
==============================================

// 1. Import required hooks and actions
import { useDispatch } from 'react-redux';
import { 
  showSuccess, 
  showError, 
  showInfo, 
  showWarning, 
  showLoading, 
  hideLoading 
} from '../store/slices/notificationSlice';

// 2. Setup in your component
function Home() {
  const dispatch = useDispatch();

  // Success notification example
  const handleSuccessClick = () => {
    dispatch(showSuccess({ 
      message: 'Vote submitted successfully!' 
    }));
  };

  // Error notification example
  const handleErrorClick = () => {
    dispatch(showError({ 
      message: 'Failed to submit vote. Please try again.' 
    }));
  };

  // Info notification example
  const handleInfoClick = () => {
    dispatch(showInfo({ 
      message: 'Remember to vote on all available polls!' 
    }));
  };

  // Warning notification example
  const handleWarningClick = () => {
    dispatch(showWarning({ 
      message: 'You can only vote once per poll!' 
    }));
  };

  // Loading notification example
  const handleLoadingClick = async () => {
    dispatch(showLoading({ 
      message: 'Submitting your vote...' 
    }));
    
    // Simulate API call
    setTimeout(() => {
      dispatch(hideLoading());
      dispatch(showSuccess({ 
        message: 'Vote submitted successfully!' 
      }));
    }, 2000);
  };

  // Custom notification example
  const handleCustomClick = () => {
    dispatch(showCustom({
      message: 'Custom notification!',
      options: {
        icon: '🎉',
        style: {
          background: '#10b981',
          color: '#fff',
        },
        duration: 3000,
      }
    }));
  };

  return (
    <div className="home-page">
      <h1>Shadow Board - Anonymous Voting</h1>
      
      <div className="notification-examples">
        <button onClick={handleSuccessClick}>
          Show Success Notification
        </button>
        
        <button onClick={handleErrorClick}>
          Show Error Notification
        </button>
        
        <button onClick={handleInfoClick}>
          Show Info Notification
        </button>
        
        <button onClick={handleWarningClick}>
          Show Warning Notification
        </button>
        
        <button onClick={handleLoadingClick}>
          Show Loading Notification
        </button>
        
        <button onClick={handleCustomClick}>
          Show Custom Notification
        </button>
      </div>
    </div>
  );
}

// 3. Don't forget to add Toaster component in your App.jsx:
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <div>
      {/* Your app content *\/}
      
      {/* Add this at the end *\/}
      <Toaster 
        position="top-right"
        reverseOrder={false}
        gutter={8}
        containerClassName=""
        containerStyle={{}}
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            theme: {
              primary: 'green',
              secondary: 'black',
            },
          },
        }}
      />
    </div>
  );
}

// 4. Add the notification reducer to your store.js:
import notificationReducer from './slices/notificationSlice';

export const store = configureStore({
  reducer: {
    notification: notificationReducer,
    // other reducers...
  },
});

*/
