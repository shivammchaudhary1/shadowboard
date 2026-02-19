import { useDispatch } from "react-redux";
import {
  showSuccess,
  showError,
  showInfo,
  showWarning,
  showLoading,
  hideLoading,
  showCustom,
} from "../store/slices/notificationSlice";
import styles from "../styles/NotificationTest.module.css";

function Home() {
  const dispatch = useDispatch();

  // Success notification - for successful actions like voting
  const handleVoteSuccess = () => {
    dispatch(
      showSuccess({
        message: "Your vote has been submitted successfully!",
        duration: 3000,
      }),
    );
  };

  // Error notification - for failed actions
  const handleVoteError = () => {
    dispatch(
      showError({
        message:
          "Failed to submit vote. Please check your connection and try again.",
        duration: 5000,
      }),
    );
  };

  // Info notification - for general information
  const handleShowInfo = () => {
    dispatch(
      showInfo({
        message:
          "You can vote anonymously on any poll. Your identity is protected.",
        duration: 4000,
      }),
    );
  };

  // Warning notification - for warnings/cautions
  const handleShowWarning = () => {
    dispatch(
      showWarning({
        message:
          "You can only vote once per poll. Make sure your choice is final!",
        duration: 4500,
      }),
    );
  };

  // Loading notification with async operation simulation
  const handleAsyncVote = async () => {
    // Show loading
    dispatch(
      showLoading({
        message: "Submitting your anonymous vote...",
      }),
    );

    try {
      // Simulate API call (replace with actual API call)
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Hide loading and show success
      dispatch(hideLoading());
      dispatch(
        showSuccess({
          message: "Vote submitted successfully!",
        }),
      );
    } catch (error) {
      // Hide loading and show error
      dispatch(hideLoading());
      dispatch(
        showError({
          message: "Failed to submit vote. Please try again.",
        }),
      );
    }
  };

  // Custom styled notification
  const handleCustomNotification = () => {
    dispatch(
      showCustom({
        message: "Welcome to Shadow Board! 🎯",
        options: {
          icon: "🎉",
          style: {
            background: "#4f46e5",
            color: "#fff",
            fontWeight: "bold",
          },
          duration: 3000,
        },
      }),
    );
  };

  return (
    <div className={styles["home-container"]}>
      <div className={styles["home-header"]}>
        <h1>🎯 Shadow Board</h1>
        <p>Anonymous Voting Platform</p>
      </div>

      <div className={styles["demo-section"]}>
        <h2>Notification Examples</h2>
        <p>Click the buttons below to see different types of notifications:</p>

        <div className={styles["button-grid"]}>
          {/* Success notification example */}
          <button
            className={`${styles.btn} ${styles["btn-success"]}`}
            onClick={handleVoteSuccess}
          >
            ✅ Successful Vote
          </button>

          {/* Error notification example */}
          <button
            className={`${styles.btn} ${styles["btn-error"]}`}
            onClick={handleVoteError}
          >
            ❌ Vote Error
          </button>

          {/* Info notification example */}
          <button
            className={`${styles.btn} ${styles["btn-info"]}`}
            onClick={handleShowInfo}
          >
            ℹ️ Show Info
          </button>

          {/* Warning notification example */}
          <button
            className={`${styles.btn} ${styles["btn-warning"]}`}
            onClick={handleShowWarning}
          >
            ⚠️ Show Warning
          </button>

          {/* Loading with async operation */}
          <button
            className={`${styles.btn} ${styles["btn-loading"]}`}
            onClick={handleAsyncVote}
          >
            🔄 Async Vote (with loading)
          </button>

          {/* Custom notification */}
          <button
            className={`${styles.btn} ${styles["btn-custom"]}`}
            onClick={handleCustomNotification}
          >
            🎉 Custom Welcome
          </button>
        </div>
      </div>

      {/* Sample voting interface */}
      <div className={styles["voting-section"]}>
        <h3>Sample Poll: What's your favorite programming language?</h3>
        <div className={styles["poll-options"]}>
          <button
            className={styles["poll-option"]}
            onClick={() =>
              dispatch(showSuccess({ message: "Voted for JavaScript!" }))
            }
          >
            JavaScript
          </button>
          <button
            className={styles["poll-option"]}
            onClick={() =>
              dispatch(showSuccess({ message: "Voted for Python!" }))
            }
          >
            Python
          </button>
          <button
            className={styles["poll-option"]}
            onClick={() =>
              dispatch(showSuccess({ message: "Voted for React!" }))
            }
          >
            React
          </button>
          <button
            className={styles["poll-option"]}
            onClick={() =>
              dispatch(showSuccess({ message: "Voted for Node.js!" }))
            }
          >
            Node.js
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;

/* 
STEP-BY-STEP USAGE GUIDE:
=========================

1. SETUP IN YOUR APP.JSX:
   - Import Toaster from react-hot-toast
   - Add <Toaster /> component at the end of your App.jsx

2. PROVIDER SETUP:
   - Wrap your app with Redux Provider
   - Import store from './store/store'

3. COMMON USAGE PATTERNS:
   
   // For API calls with loading
   const handleApiCall = async () => {
     dispatch(showLoading({ message: 'Processing...' }));
     try {
       const result = await apiCall();
       dispatch(hideLoading());
       dispatch(showSuccess({ message: 'Success!' }));
     } catch (error) {
       dispatch(hideLoading());
       dispatch(showError({ message: error.message }));
     }
   };

   // For form submissions
   const handleSubmit = (formData) => {
     if (!formData.isValid) {
       dispatch(showWarning({ message: 'Please fill all required fields' }));
       return;
     }
     // Submit logic...
     dispatch(showSuccess({ message: 'Form submitted successfully!' }));
   };

   // For user actions
   const handleUserAction = () => {
     dispatch(showInfo({ message: 'Action completed' }));
   };

4. REMEMBER TO:
   - Import useDispatch from react-redux
   - Import the notification actions you need
   - Add the Toaster component to your App.jsx
*/
