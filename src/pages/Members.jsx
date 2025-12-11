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
    await addMember(formData);

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
  };

  const filteredMembers = filterGender
    ? members.filter((m) => m.gender === filterGender)
    : members;

  return (
    <div className="p-4 space-y-6">
      {/* FORM */}
      <div className="p-4 rounded-lg">
        <h2 className="text-lg font-semibold mb-4 text-green-700">
          Add Member
        </h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Name */}
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input
              type="text"
              name="fullName"
              placeholder="Enter full name"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>

          {/* Number */}
          <div>
            <label className="block text-sm font-medium mb-1">Number</label>
            <input
              type="text"
              name="number"
              placeholder="Enter number"
              value={formData.number}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm font-medium mb-1">Gender</label>
            <div className="flex gap-6">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  name="gender"
                  value="M"
                  checked={formData.gender === "M"}
                  onChange={handleChange}
                  className="accent-blue-600"
                />
                <span>Male</span>
              </label>

              <label className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  name="gender"
                  value="F"
                  checked={formData.gender === "F"}
                  onChange={handleChange}
                  className="accent-pink-600"
                />
                <span>Female</span>
              </label>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition"
            disabled={!formData.fullName || !formData.number}
          >
            Add Member
          </button>
        </form>
      </div>

      <hr />

      {/* TABLE */}
      <div className="bg-stone-100 p-4 rounded-lg">
        <h2 className="text-lg font-semibold mb-4 text-green-700">
          Members List
        </h2>

        {/* Filter Buttons (masih pakai daisyUI — kalau mau ganti pure Tailwind bilang saja */}
        <div className="flex gap-2 mb-4">
          <button
            className={`px-3 py-1 text-sm border rounded-md ${
              filterGender === "" ? "bg-blue-600 text-white" : "bg-white"
            }`}
            onClick={() => setFilterGender("")}
          >
            All
          </button>

          <button
            className={`px-3 py-1 text-sm border rounded-md ${
              filterGender === "M" ? "bg-blue-600 text-white" : "bg-white"
            }`}
            onClick={() => setFilterGender("M")}
          >
            Male
          </button>

          <button
            className={`px-3 py-1 text-sm border rounded-md ${
              filterGender === "F" ? "bg-blue-600 text-white" : "bg-white"
            }`}
            onClick={() => setFilterGender("F")}
          >
            Female
          </button>
        </div>

        {loading ? (
          <p>Loading members...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-300 text-sm">
              <thead className="bg-gray-200">
                <tr>
                  <th className="border border-gray-300 px-3 py-2">Name</th>
                  <th className="border border-gray-300 px-3 py-2">Number</th>
                  <th className="border border-gray-300 px-3 py-2">Gender</th>
                  <th className="border border-gray-300 px-3 py-2">Address</th>
                </tr>
              </thead>
              <tbody>
                {filteredMembers.map((member) => (
                  <tr key={member.id} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-3 py-2">
                      {member.fullName}
                    </td>
                    <td className="border border-gray-300 px-3 py-2">
                      {member.number}
                    </td>
                    <td className="border border-gray-300 px-3 py-2">
                      {member.gender}
                    </td>
                    <td className="border border-gray-300 px-3 py-2">
                      {member.address}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Members;
