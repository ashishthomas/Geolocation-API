import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const LocationInput = () => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch locations
  const handleSearch = async (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.length < 3) {
      setSuggestions([]);
      return;
    }

    try {
      setLoading(true);
      const res = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&q=${value}`
      );
      if (res.data.length === 0) {
        toast.error("No location found 🚫", { duration: 5000 });
      } else {
        toast.success("Valid location ✅", { duration: 3000 });
      }
      setSuggestions(res.data || []);
    } catch (error) {
      console.error("Error fetching search results:", error);
      toast.error("Error fetching location ❌");
    } finally {
      setLoading(false);
    }
  };

  // Selecting a location
  const handleSelect = (location) => {
    const {
      display_name,
      lat,
      lon,
      type,
      class: placeClass,
      importance,
      address,
    } = location;

    setQuery(display_name);
    setSuggestions([]);

    toast.success(`Location selected: ${display_name}`, { duration: 3000 });

    navigate("/location-details", {
      state: {
        displayName: display_name,
        address: address || null,
        latitude: lat,
        longitude: lon,
        type,
        placeClass,
        importance,
        accuracy: null,
      },
    });
  };

  // Current location
  const handleCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation not supported ❌");
      return;
    }

    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude, accuracy } = position.coords;

        try {
          const res = await axios.get(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
          );

          const {
            display_name,
            type,
            class: placeClass,
            importance,
            address,
          } = res.data;

          if (!display_name) {
            toast.error("Unable to fetch location ❌", { duration: 5000 });
            return;
          }

          setQuery(display_name);
          toast.success("Current location detected ✅", { duration: 3000 });

          navigate("/location-details", {
            state: {
              displayName: display_name,
              address: address || null,
              latitude,
              longitude,
              type,
              placeClass,
              importance,
              accuracy,
            },
          });
        } catch (error) {
          console.error("Error fetching current location details:", error);
          toast.error("Unable to fetch location details ❌");
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        toast.error("Unable to retrieve your location ❌");
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  return (
    <div className="p-4 relative space-y-4">
      {/* Search box */}
      <input
        type="text"
        value={query}
        onChange={handleSearch}
        placeholder="Search for a location..."
        className="border p-2 w-full rounded"
      />
      {loading && <p className="text-sm text-gray-500">Loading...</p>}

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <ul className="absolute z-10 bg-white border rounded w-full mt-1 max-h-48 overflow-auto shadow-lg">
          {suggestions.map((item) => (
            <li
              key={item.place_id}
              onClick={() => handleSelect(item)}
              className="p-2 hover:bg-gray-100 cursor-pointer text-sm"
            >
              {item.display_name}
            </li>
          ))}
        </ul>
      )}

      {/* Current location button */}
      <button
        onClick={handleCurrentLocation}
        className="px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700"
      >
        📍 Use My Current Location
      </button>
    </div>
  );
};

export default LocationInput;
