import React, { useEffect, useState } from "react";
import API from "../config/api";
import { FaHeart } from "react-icons/fa";

const Matches = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMatches = async () => {
    try {
      setLoading(true);
      const res = await API.get("/matches");
      setMatches(res.data.matches);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  if (loading) return <p>Loading...</p>;

  if (matches.length === 0)
    return <p className="text-center">No matches found</p>;

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
      {matches.map((m, i) => (
        <div key={m.matchId} className="border p-4 rounded shadow">
          <p className="text-sm text-gray-400 mb-2">Match #{i + 1}</p>

          <div className="flex justify-center items-center gap-2">
            <span className="font-semibold text-blue-600">
              {m.participant1.fullName}
            </span>
            <FaHeart className="text-red-500" />
            <span className="font-semibold text-pink-600">
              {m.participant2.fullName}
            </span>
          </div>

          <p className="text-xs text-center mt-2">
            {new Date(m.createdAt).toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  );
};

export default Matches;
