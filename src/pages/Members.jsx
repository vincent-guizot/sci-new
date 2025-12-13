import React, { useState } from "react";
import Swal from "sweetalert2";
import useMembers from "../hooks/useMember";

const Members = () => {
  const { members, loading, addMember } = useMembers();

  const [formData, setFormData] = useState({
    fullName: "",
    number: "",
    address: "",
    image: "",
    gender: "M",
  });

  const [filterGender, setFilterGender] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await addMember(formData);
      if (result) {
        Swal.fire({
          title: "Success",
          text: "Member added successfully",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });

        setFormData({
          fullName: "",
          number: "",
          address: "",
          image: "",
          gender: "M",
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: `${error}`,
        icon: "error",
        timer: 1500,
        showConfirmButton: false,
      });
    }
  };

  const filteredMembers = filterGender
    ? members.filter((m) => m.gender === filterGender)
    : members;

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto space-y-6">
      <h2 className="text-xl sm:text-2xl font-bold text-green-700 text-center">
        Members List
      </h2>

      {/* Filter Buttons */}
      <div className="flex flex-wrap justify-center gap-2 mb-4">
        {["", "M", "F"].map((g) => (
          <button
            key={g}
            onClick={() => setFilterGender(g)}
            className={`px-3 py-1 text-sm sm:text-base border rounded-md ${
              filterGender === g ? "bg-blue-600 text-white" : "bg-white"
            }`}
          >
            {g === "" ? "All" : g === "M" ? "Man" : "Woman"}
          </button>
        ))}
      </div>

      {/* Members Table */}
      {loading ? (
        <p className="text-center">Loading members...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-[400px] w-full border border-gray-300 text-sm sm:text-base rounded-lg overflow-hidden">
            <thead className="bg-gray-200">
              <tr>
                <th className="border px-3 py-2 text-left">Name</th>
                <th className="border px-3 py-2 text-left">Number</th>
                <th className="border px-3 py-2 text-left">Gender</th>
              </tr>
            </thead>
            <tbody>
              {filteredMembers.map((member) => (
                <tr
                  key={member.id || member._id}
                  className="hover:bg-gray-50 transition"
                >
                  <td className="border px-3 py-2">{member.fullName}</td>
                  <td className="border px-3 py-2">{member.number}</td>
                  <td className="border px-3 py-2">{member.gender}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Members;
