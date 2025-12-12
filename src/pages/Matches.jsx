import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaHeart } from "react-icons/fa"; // ikon love

const Matches = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch matches
  const fetchMatches = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:4000/matches");
      setMatches(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-2xl font-bold mb-4 text-pink-600 text-center">
        💖 Matches 💖
      </h2>

      {loading ? (
        <p className="text-center text-gray-500">Loading matches...</p>
      ) : matches.length === 0 ? (
        <p className="text-center text-gray-500">No matches found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {matches.map((match, index) => (
            <div
              key={match.id || index}
              className="bg-white rounded-lg shadow-md p-5 hover:shadow-xl transition duration-300"
            >
              <p className="text-sm text-gray-400 mb-2">Match #{index + 1}</p>

              <div className="flex items-center justify-center gap-2 mb-3">
                <span className="font-semibold text-lg text-blue-600">
                  {match.participant1}
                </span>
                <FaHeart className="text-red-500" />
                <span className="font-semibold text-lg text-pink-600">
                  {Array.isArray(match.participant2)
                    ? match.participant2.join(", ")
                    : match.participant2}
                </span>
              </div>

              <p className="text-xs text-gray-500 text-center">
                {match.date ? new Date(match.date).toLocaleString() : "No date"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Matches;
