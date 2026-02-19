# React Hot Toast Notification System

A complete notification system built with Redux Toolkit and React Hot Toast for the Shadow Board application.

## 🚀 Features

- ✅ Success notifications
- ❌ Error notifications
- ℹ️ Info notifications
- ⚠️ Warning notifications
- 🔄 Loading notifications
- 🎨 Custom notifications
- 📱 Mobile responsive
- 🎯 Redux state management
- ⚡ Easy to use

## 📦 Installation

```bash
npm install react-hot-toast @reduxjs/toolkit react-redux
```

## 🛠️ Setup Complete!

The notification system is already configured in your project:

1. ✅ **Store configured** - `notificationReducer` added to store
2. ✅ **App.jsx updated** - Provider and Toaster components added
3. ✅ **Notification slice created** - All actions and reducers ready
4. ✅ **Example page created** - Home.jsx with working examples

## 🎯 Quick Usage

### Basic Usage in Any Component

```javascript
import { useDispatch } from "react-redux";
import {
  showSuccess,
  showError,
  showInfo,
  showWarning,
} from "../store/slices/notificationSlice";

function MyComponent() {
  const dispatch = useDispatch();

  const handleSuccess = () => {
    dispatch(showSuccess({ message: "Operation successful!" }));
  };

  const handleError = () => {
    dispatch(showError({ message: "Something went wrong!" }));
  };

  return (
    <div>
      <button onClick={handleSuccess}>Success</button>
      <button onClick={handleError}>Error</button>
    </div>
  );
}
```

### With API Calls

```javascript
const handleApiCall = async () => {
  dispatch(showLoading({ message: "Submitting vote..." }));

  try {
    const response = await fetch("/api/vote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(voteData),
    });

    dispatch(hideLoading());

    if (response.ok) {
      dispatch(showSuccess({ message: "Vote submitted successfully!" }));
    } else {
      dispatch(showError({ message: "Failed to submit vote" }));
    }
  } catch (error) {
    dispatch(hideLoading());
    dispatch(showError({ message: error.message }));
  }
};
```

## 🎨 Available Actions

| Action        | Description            | Example                  |
| ------------- | ---------------------- | ------------------------ |
| `showSuccess` | Green success message  | Vote submitted ✅        |
| `showError`   | Red error message      | Connection failed ❌     |
| `showInfo`    | Blue info message      | Remember to vote ℹ️      |
| `showWarning` | Orange warning message | Only one vote allowed ⚠️ |
| `showLoading` | Loading spinner        | Processing... 🔄         |
| `hideLoading` | Hide loading toast     | -                        |
| `showCustom`  | Custom styled toast    | Welcome! 🎉              |

## 🎪 Demo

Visit the Home page (`/`) to see all notification types in action with interactive examples!

## 🔧 Customization

### Custom Toast Options

```javascript
dispatch(
  showCustom({
    message: "Custom notification!",
    options: {
      icon: "🎉",
      style: {
        background: "#10b981",
        color: "#fff",
      },
      duration: 3000,
      position: "top-center",
    },
  }),
);
```

### Duration Options

```javascript
// Quick message (1 second)
dispatch(showInfo({ message: "Quick info", duration: 1000 }));

// Long message (10 seconds)
dispatch(showError({ message: "Important error", duration: 10000 }));
```

## 📱 Ready to Use!

Your notification system is fully configured and ready to use throughout your Shadow Board application. Just import the actions you need and start showing beautiful notifications to your users!
