// src/router.jsx
import { createBrowserRouter } from "react-router-dom";
import LocationInput from "./pages/LocationInput.jsx";
import LocationDetails from "./pages/LocationDetails.jsx";

const router = createBrowserRouter([
  { path: "/", element: <LocationInput /> },
  { path: "/location-details", element: <LocationDetails /> },
  {
    path: "*",
    element: (
      <div className="flex items-center justify-center h-screen">
        <h1 className="text-2xl font-bold text-red-600">
          404 - Page Not Found
        </h1>
      </div>
    ),
  },
]);

export default router;
