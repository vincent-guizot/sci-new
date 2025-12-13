import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import API from "../config/api";
import useMembers from "../hooks/useMember";

const MatchMaking = () => {
  const { members, loading } = useMembers();

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
      Swal.fire("Limit", "Max 4 likes allowed", "warning");
      return;
    }

    setSelectedLikes([...selectedLikes, id]);
  };

  const submitLikes = async () => {
    if (!participantId || selectedLikes.length === 0) {
      Swal.fire("Error", "Select participant & likes", "error");
      return;
    }

    try {
      setSubmitting(true);
      await API.post("/likes/submit", {
        participantId,
        likes: selectedLikes,
      });

      Swal.fire("Success", "Likes submitted!", "success");
      setSelectedLikes([]);
    } catch (err) {
      Swal.fire("Error", err.response?.data?.message || "Failed", "error");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-xl font-bold">Match Making</h2>

      {/* SELECT PARTICIPANT */}
      <select
        className="border px-3 py-2 w-full"
        value={participantId}
        onChange={(e) => {
          setParticipantId(e.target.value);
          setSelectedLikes([]);
        }}
      >
        <option value="">Choose Participant</option>
        {members.map((m) => (
          <option key={m._id} value={m._id}>
            {m.number} -{m.fullName} - ({m.gender})
          </option>
        ))}
      </select>

      {/* OPPOSITE GENDER */}
      {participant && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {members
            .filter(
              (m) => m.gender === oppositeGender && m._id !== participantId
            )
            .map((m) => {
              const active = selectedLikes.includes(m._id);
              return (
                <div
                  key={m._id}
                  onClick={() => toggleLike(m._id)}
                  className={`p-4 border rounded cursor-pointer ${
                    active ? "bg-blue-600 text-white" : "hover:border-blue-500"
                  }`}
                >
                  <p className="font-semibold">{m.fullName}</p>
                  <p className="text-xs">{m.number}</p>
                </div>
              );
            })}
        </div>
      )}

      <button
        disabled={submitting}
        onClick={submitLikes}
        className="w-full bg-green-600 text-white py-3 rounded"
      >
        {submitting ? "Submitting..." : "Submit Likes"}
      </button>
    </div>
  );
};

export default MatchMaking;
