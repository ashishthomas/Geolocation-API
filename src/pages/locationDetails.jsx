// LocationDetails.jsx
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const LocationDetails = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state) {
    return (
      <div className="p-4">
        <p>No location data provided.</p>
        <button
          onClick={() => navigate("/")}
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded"
        >
          Go Back
        </button>
      </div>
    );
  }

  const {
    displayName,
    address,
    latitude,
    longitude,
    type,
    placeClass,
    importance,
    accuracy,
  } = state;

  // Format address: prefer displayName, fallback to structured object
  const formattedAddress =
    displayName ||
    (address ? Object.values(address).join(", ") : "Not available");

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h2 className="text-xl font-bold mb-4">📍 Location Details</h2>
      <div className="bg-white border rounded-lg shadow p-4 space-y-2">
        <p>
          <strong>Address:</strong> {formattedAddress}
        </p>
        <p>
          <strong>Latitude:</strong> {latitude}
        </p>
        <p>
          <strong>Longitude:</strong> {longitude}
        </p>
        <p>
          <strong>Type:</strong> {type}
        </p>
        <p>
          <strong>Class:</strong> {placeClass}
        </p>
        <p>
          <strong>Importance:</strong> {importance?.toFixed(2)}
        </p>
        {accuracy && (
          <p>
            <strong>Accuracy:</strong> ±{accuracy.toFixed(0)} meters
          </p>
        )}
      </div>

      {/* Optional structured breakdown */}
      {address && (
        <div className="mt-4 bg-gray-50 border rounded-lg shadow p-4">
          <h3 className="font-semibold mb-2">Structured Address</h3>
          <ul className="text-sm space-y-1">
            {Object.entries(address).map(([key, value]) => (
              <li key={key}>
                <strong>{key}:</strong> {value}
              </li>
            ))}
          </ul>
        </div>
      )}

      <button
        onClick={() => navigate("/")}
        className="mt-4 px-4 py-2 bg-gray-700 text-white rounded"
      >
        🔙 Back
      </button>
    </div>
  );
};

export default LocationDetails;
