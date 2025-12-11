import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import useMembers from "../hooks/useMember";

const MatchMaking = () => {
  const { members, loading } = useMembers();

  const [p1Number, setP1Number] = useState("");
  const [p1Gender, setP1Gender] = useState("M");
  const [p1Username, setP1Username] = useState("");

  const [p2Gender, setP2Gender] = useState("F");
  const [p2Selection, setP2Selection] = useState([]);

  const [submitting, setSubmitting] = useState(false);

  // 🔥 Fetch Participant 1 name from API (NOT members)
  useEffect(() => {
    if (!p1Number) {
      setP1Username("");
      return;
    }

    const fetchP1 = async () => {
      try {
        const res = await axios.get(
          `http://localhost:4000/participants/${p1Number}`
        );
        setP1Username(res.data.fullName || "");
        setP1Gender(res.data.gender || "M"); // optional auto-gender
      } catch (err) {
        setP1Username("Not found");
      }
    };

    fetchP1();
  }, [p1Number]);

  // Auto-set P2 gender
  useEffect(() => {
    setP2Gender(p1Gender === "M" ? "F" : "M");
    setP2Selection([]);
  }, [p1Gender]);

  const handleP2Select = (member) => {
    if (p2Selection.some((m) => m.number === member.number)) {
      setP2Selection(p2Selection.filter((m) => m.number !== member.number));
    } else if (p2Selection.length < 3) {
      setP2Selection([...p2Selection, member]);
    }
  };

  const handleSubmit = async () => {
    if (!p1Number || p2Selection.length === 0) {
      Swal.fire("Error", "Fill Participant 1 & choose Participant 2", "error");
      return;
    }

    const payload = {
      participant1: p1Number,
      participant2: p2Selection.map((m) => m.number),
    };

    try {
      setSubmitting(true);
      await axios.post("http://localhost:4000/likes", payload);

      Swal.fire("Success", "Likes submitted!", "success");

      setP1Number("");
      setP1Gender("M");
      setP1Username("");
      setP2Selection([]);
    } catch (err) {
      Swal.fire("Error", "Failed submitting likes", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
  <div className="p-4 space-y-10">
    {/* ========================= PARTICIPANT 1 ========================= */}
    <div className="bg-white p-5 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Participant 1</h2>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="space-y-5">

          {/* SELECT NUMBER + GENDER SIDE BY SIDE */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* Select Number */}
            <div className="flex flex-col">
              <label className="text-sm font-medium mb-1">Select Number</label>
              <select
                className="border border-gray-300 rounded-md px-3 py-2"
                value={p1Number}
                onChange={(e) => setP1Number(e.target.value)}
              >
                <option value="">Choose number...</option>
                {members.map((m) => (
                  <option key={m.number} value={m.number}>
                    {m.number}
                  </option>
                ))}
              </select>
            </div>

            {/* Gender Square Buttons */}
            <div className="flex flex-col">
              <label className="text-sm font-medium mb-1">Gender</label>

              <div className="flex gap-3 mt-1">
                <button
                  type="button"
                  className={`px-4 py-2 border rounded-md w-full ${
                    p1Gender === "M"
                      ? "bg-blue-600 text-white border-blue-600"
                      : "border-gray-300"
                  }`}
                  onClick={() => setP1Gender("M")}
                >
                  Male
                </button>

                <button
                  type="button"
                  className={`px-4 py-2 border rounded-md w-full ${
                    p1Gender === "F"
                      ? "bg-pink-500 text-white border-pink-500"
                      : "border-gray-300"
                  }`}
                  onClick={() => setP1Gender("F")}
                >
                  Female
                </button>
              </div>
            </div>
          </div>

          {/* Full Name */}
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">Full Name</label>
            <input
              type="text"
              value={p1Username}
              readOnly
              className="border border-gray-300 rounded-md px-3 py-2 bg-gray-50"
            />
          </div>
        </div>
      )}
    </div>

    {/* ========================= PARTICIPANT 2 ========================= */}
    <div className="bg-white p-5 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-4">
        Participant 2 (Gender: {p2Gender})
      </h2>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {/* Responsive grid: 2 mobile, 3 tablet+ */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {members
              .filter((m) => m.gender === p2Gender)
              .map((m) => {
                const isSelected = p2Selection.some(
                  (sel) => sel.number === m.number
                );

                return (
                  <div
                    key={m.number}
                    role="button"
                    onClick={() => handleP2Select(m)}
                    className={`border rounded-lg p-4 text-center cursor-pointer transition-all ${
                      isSelected
                        ? "border-blue-500 bg-blue-500 text-white scale-105"
                        : "border-gray-300 hover:border-blue-500 hover:scale-105"
                    }`}
                  >
                    <p className="font-semibold text-sm md:text-base">
                      {m.fullName}
                    </p>
                    <p className="text-xs opacity-80 md:text-sm">{m.number}</p>
                  </div>
                );
              })}
          </div>

          <p className="mt-4 text-sm">
            Selected ({p2Selection.length}/3):{" "}
            <span className="font-medium">
              {p2Selection.map((m) => m.fullName).join(", ")}
            </span>
          </p>
        </>
      )}
    </div>

    {/* ========================= SUBMIT BUTTON ========================= */}
    <div>
      <button
        onClick={handleSubmit}
        disabled={submitting}
        className="w-full bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-sm shadow-sm disabled:opacity-50"
      >
        {submitting ? "Submitting..." : "Submit Likes"}
      </button>
    </div>
  </div>
);

};

export default MatchMaking;
