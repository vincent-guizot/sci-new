import React, { useState } from "react";
import Swal from "sweetalert2";
import useMembers from "../hooks/useMember";
import API from "../config/api";
import { FaMale, FaFemale, FaHeart } from "react-icons/fa";

const MatchMaking = () => {
  const { members, loading } = useMembers();
  const [participantGender, setParticipantGender] = useState("");
  const [participantId, setParticipantId] = useState("");
  const [selectedLikes, setSelectedLikes] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const participant = members.find((m) => m._id === participantId);
  const oppositeGender = participant?.gender === "M" ? "F" : "M";

  const toggleLike = (id) => {
    if (selectedLikes.includes(id)) {
      setSelectedLikes(selectedLikes.filter((x) => x !== id));
      return;
    }
    if (selectedLikes.length >= 4) {
      Swal.fire("Limit reached", "Max 4 likes allowed", "warning");
      return;
    }
    setSelectedLikes([...selectedLikes, id]);
  };

  const submitLikes = async () => {
    if (!participantId || selectedLikes.length === 0) {
      Swal.fire("Error", "Choose participant & likes first", "error");
      return;
    }
    try {
      setSubmitting(true);
      await API.post("/likes/submit", {
        participantId,
        likes: selectedLikes,
      });
      Swal.fire("Success", "Likes submitted & matched!", "success");
      setSelectedLikes([]);
    } catch (err) {
      Swal.fire(
        "Error",
        err.response?.data?.message || "Failed to submit",
        "error"
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto space-y-6">
      <div className="text-center mb-4">
        <h2 className="text-2xl font-bold text-blue-700">💘 Match Making</h2>
        <p className="text-sm text-gray-500">
          Choose participant & select up to 4 people you like
        </p>
      </div>

      {/* Gender Selector */}
      <div className="flex flex-col sm:flex-row justify-center gap-4 mb-4">
        <button
          onClick={() => {
            setParticipantGender("M");
            setParticipantId("");
            setSelectedLikes([]);
          }}
          className={`flex items-center justify-center gap-2 px-4 py-2 rounded-md border transition ${
            participantGender === "M"
              ? "bg-blue-600 text-white border-blue-600 scale-105"
              : "bg-white hover:bg-blue-50"
          }`}
        >
          <FaMale /> Man
        </button>
        <button
          onClick={() => {
            setParticipantGender("F");
            setParticipantId("");
            setSelectedLikes([]);
          }}
          className={`flex items-center justify-center gap-2 px-4 py-2 rounded-md border transition ${
            participantGender === "F"
              ? "bg-pink-500 text-white border-pink-500 scale-105"
              : "bg-white hover:bg-pink-50"
          }`}
        >
          <FaFemale /> Woman
        </button>
      </div>

      {/* Participant Dropdown */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Select Participant
        </label>
        <select
          className="border px-3 py-2 w-full rounded"
          disabled={!participantGender}
          value={participantId}
          onChange={(e) => {
            setParticipantId(e.target.value);
            setSelectedLikes([]);
          }}
        >
          <option value="">Choose participant...</option>
          {members
            .filter((m) => m.gender === participantGender)
            .map((m) => (
              <option key={m._id} value={m._id}>
                {m.number}
                {m.gender === "M" ? "M" : "W"} - {m.fullName}
              </option>
            ))}
        </select>
      </div>

      {/* Likes Selection */}
      {participant && (
        <>
          <div className="flex justify-between items-center mt-4 mb-2">
            <h3 className="font-semibold text-lg">
              Select Likes ({oppositeGender === "M" ? "Male" : "Female"})
            </h3>
            <span className="text-sm text-gray-500">
              {selectedLikes.length} / 4 selected
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {members
              .filter(
                (m) => m.gender === oppositeGender && m._id !== participantId
              )
              .map((m) => {
                const active = selectedLikes.includes(m._id);
                const disabled = !active && selectedLikes.length >= 4;

                return (
                  <div
                    key={m._id}
                    onClick={() => !disabled && toggleLike(m._id)}
                    className={`p-3 sm:p-4 border border-stone-300 text-center transition ${
                      active
                        ? "bg-green-600 text-white scale-105"
                        : disabled
                        ? "opacity-40 cursor-not-allowed"
                        : "hover:border-green-500 cursor-pointer"
                    }`}
                  >
                    <p className="text-sm font-medium">{m.fullName}</p>
                    <p className="text-lg sm:text-xl font-semibold">
                      {m.number}
                    </p>
                    {active && (
                      <FaHeart width={12} className="mx-auto mt-1 text-white" />
                    )}
                  </div>
                );
              })}
          </div>
        </>
      )}

      <button
        onClick={submitLikes}
        disabled={submitting || !participantId}
        className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold disabled:opacity-50"
      >
        {submitting ? "Submitting..." : "Submit Likes"}
      </button>
    </div>
  );
};

export default MatchMaking;
