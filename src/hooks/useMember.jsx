import { useState, useEffect } from "react";
import API from "../config/api";

const useMembers = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const res = await API.get("/participants");
      setMembers(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addMember = async (member) => {
    const res = await API.post("/participants", member);
    fetchMembers();
    return res;
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  return { members, loading, fetchMembers, addMember };
};

export default useMembers;
