import { Toaster } from "react-hot-toast";
import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    <>
      <AppRoutes />
      {/* React Hot Toast component for notifications */}
      <Toaster
        position="top-right"
        reverseOrder={false}
        gutter={8}
        containerStyle={{}}
        toastOptions={{
          // Default options for all toasts
          duration: 4000,
          style: {
            background: "#363636",
            color: "#fff",
            fontSize: "14px",
            fontWeight: "500",
            padding: "12px 16px",
            borderRadius: "8px",
          },
          // Success toast styling
          success: {
            duration: 3000,
            style: {
              background: "#10b981",
              color: "#fff",
            },
            iconTheme: {
              primary: "#fff",
              secondary: "#10b981",
            },
          },
          // Error toast styling
          error: {
            duration: 5000,
            style: {
              background: "#ef4444",
              color: "#fff",
            },
            iconTheme: {
              primary: "#fff",
              secondary: "#ef4444",
            },
          },
          // Loading toast styling
          loading: {
            style: {
              background: "#3b82f6",
              color: "#fff",
            },
          },
        }}
      />
    </>
  );
}

export default App;
