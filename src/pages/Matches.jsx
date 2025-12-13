import React, { useEffect, useState } from "react";
import API from "../config/api";
import { FaHeart } from "react-icons/fa";

const Matches = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

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

  // 🔵 Generate Matches
  const handleGenerate = async () => {
    try {
      setProcessing(true);
      await API.post("/matches/generate");
      await fetchMatches();
    } catch (err) {
      console.error(err);
    } finally {
      setProcessing(false);
    }
  };

  // 🔴 Delete Matches
  const handleDelete = async () => {
    if (!window.confirm("Are you sure to delete all matches?")) return;

    try {
      setProcessing(true);
      await API.delete("/matches");
      setMatches([]);
    } catch (err) {
      console.error(err);
    } finally {
      setProcessing(false);
    }
  };

  if (loading) return <p className="text-center">Loading...</p>;

  return (
    <div className="p-6 space-y-6">
      {/* TITLE */}
      <h2 className="text-2xl font-bold text-center text-pink-600">
        💖 Matches 💖
      </h2>

      {/* ACTION BUTTONS */}
      <div className="flex justify-center gap-4">
        <button
          onClick={handleGenerate}
          disabled={processing}
          className="px-5 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
        >
          Generate Matches
        </button>

        <button
          onClick={handleDelete}
          disabled={processing}
          className="px-5 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
        >
          Delete Matches
        </button>
      </div>

      {/* MATCH LIST */}
      {matches.length === 0 ? (
        <p className="text-center text-gray-500">No matches found</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {matches.map((m, i) => (
            <div
              key={m.matchId}
              className="border p-4 rounded-lg shadow hover:shadow-lg transition"
            >
              <p className="text-sm text-gray-400 mb-2">Match #{i + 1}</p>

              <div className="flex justify-center items-center gap-2">
                <span className="font-semibold text-blue-600">
                  {m.participant1.number}
                  {m.participant1.gender === "M" ? "M" : "W"} -{" "}
                  {m.participant1.fullName}
                </span>
                <FaHeart className="text-red-500" />
                <span className="font-semibold text-pink-600">
                  {m.participant2.number}
                  {m.participant2.gender === "M" ? "M" : "W"} -{" "}
                  {m.participant2.fullName}
                </span>
              </div>

              <p className="text-xs text-center mt-2 text-gray-500">
                {new Date(m.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Matches;
