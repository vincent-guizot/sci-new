import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import API from "../config/api";

const ParticipantsLiked = () => {
  const [likesData, setLikesData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLikes = async () => {
    try {
      setLoading(true);
      const res = await API.get("/likes");
      setLikesData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteLike = async (id, name) => {
    const confirm = await Swal.fire({
      title: "Delete?",
      text: `Remove likes from ${name}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e11d48",
      confirmButtonText: "Yes, delete",
    });

    if (!confirm.isConfirmed) return;

    try {
      await API.delete(`/likes/${id}`);
      Swal.fire("Deleted", "Likes removed", "success");
      fetchLikes();
    } catch (err) {
      Swal.fire("Error", "Failed to delete", "error");
    }
  };

  useEffect(() => {
    fetchLikes();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-2xl font-bold text-blue-700">
        Participant yang Sudah Memilih
      </h2>

      <p className="text-sm text-gray-500">
        Menampilkan participant yang telah memilih pasangan beserta daftar
        pilihan mereka.
      </p>

      {likesData.length === 0 ? (
        <p className="text-gray-500">Belum ada participant yang memilih.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border text-sm">
            <thead className="bg-gray-200">
              <tr>
                <th className="border px-3 py-2 text-left">Participant</th>
                <th className="border px-3 py-2 text-left">Likes</th>
                <th className="border px-3 py-2 text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {likesData.map((row) => (
                <tr key={row._id} className="hover:bg-gray-50">
                  {/* PARTICIPANT */}
                  <td className="border px-3 py-2">
                    {row.number} - {row.fullName} ({row.gender})
                  </td>

                  {/* LIKES */}
                  <td className="border px-3 py-2">
                    {row.likes.length === 0 ? (
                      <span className="text-gray-400">No likes</span>
                    ) : (
                      row.likes
                        .map((p) => `${p.number} - ${p.fullName}`)
                        .join(", ")
                    )}
                  </td>

                  {/* ACTION */}
                  <td className="border px-3 py-2 text-center">
                    <button
                      onClick={() => deleteLike(row._id, row.fullName)}
                      className="px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ParticipantsLiked;
