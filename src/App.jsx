// LocationInput.jsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LocationInput = () => {
  const [query, setQuery] = useState(""); // user typing
  const [suggestions, setSuggestions] = useState([]); // search results
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch locations from OpenStreetMap Nominatim search API
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
      setSuggestions(res.data || []);
    } catch (error) {
      console.error("Error fetching search results:", error);
    } finally {
      setLoading(false);
    }
  };

  // When user selects a location
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

    navigate("/location-details", {
      state: {
        displayName: display_name,
        address: address || null,
        latitude: lat,
        longitude: lon,
        type,
        placeClass,
        importance,
      },
    });
  };

  return (
    <div className="p-4 relative">
      <input
        type="text"
        value={query}
        onChange={handleSearch}
        placeholder="Search for a location..."
        className="border p-2 w-full rounded"
      />
      {loading && <p className="text-sm text-gray-500">Searching...</p>}

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
    </div>
  );
};

export default LocationInput;
