import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom"; // Import BrowserRouter
import App from "./App.jsx";
import store from "./store";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/* Provider makes the Redux store available to the rest of the app,
    allowing components to access the Redux state and dispatch actions. */}
    <Provider store={store}>
      {/* Wrap the App in BrowserRouter to provide routing context */}
      <BrowserRouter>
        {/* App is the top-level component that renders the entire application. */}
        <App />
      </BrowserRouter>
    </Provider>
  </StrictMode>
);
