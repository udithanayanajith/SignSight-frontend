import { useEffect, useState } from "react";
import axios from "axios";
import { MENTOR_BASE_URI } from "../../config/CONFIG";

export default function AdminDashboard() {
  const [mentors, setMentors] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<Record<string, string[]>>(
    {},
  );
  const [savingMentor, setSavingMentor] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const [mRes, uRes] = await Promise.all([
      axios.get(MENTOR_BASE_URI + "/api/admin/mentors"),
      axios.get(MENTOR_BASE_URI + "/api/admin/students"),
    ]);

    setMentors(mRes.data);
    setUsers(uRes.data);

    // preload assigned users
    const preload: Record<string, string[]> = {};
    mRes.data.forEach((m: any) => {
      preload[m.id] = m.users || [];
    });
    setSelectedUsers(preload);
  }

  function toggleUser(mentorId: string, userId: string) {
    setSelectedUsers((prev) => {
      const current = prev[mentorId] || [];
      if (current.includes(userId)) {
        return { ...prev, [mentorId]: current.filter((id) => id !== userId) };
      }
      if (current.length >= 5) return prev;
      return { ...prev, [mentorId]: [...current, userId] };
    });
  }

  async function saveUsers(mentorId: string) {
    try {
      setSavingMentor(mentorId);

      await axios.post(MENTOR_BASE_URI + "/api/admin/save-mentor-users", {
        mentorId,
        userIds: selectedUsers[mentorId] || [],
      });

      alert("Saved successfully ✅");
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.error || "Save failed");
    } finally {
      setSavingMentor(null);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-pink-50 p-8">
      <h1 className="text-3xl font-extrabold mb-8 text-center text-gray-800">
        Admin Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
        {mentors.map((mentor) => {
          const selected = selectedUsers[mentor.id] || [];

          return (
            <div
              key={mentor.id}
              className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl p-6 transition hover:scale-[1.01]"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-bold text-gray-800">
                    {mentor.name}
                  </h2>
                  <p className="text-sm text-gray-500">{mentor.email}</p>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    selected.length >= 5
                      ? "bg-red-100 text-red-600"
                      : "bg-green-100 text-green-600"
                  }`}
                >
                  {selected.length} / 5
                </span>
              </div>

              {/* Users */}
              <div className="max-h-56 overflow-y-auto space-y-2 mb-4 pr-2">
                {users.map((user) => {
                  const checked = selected.includes(user._id);
                  const disabled = !checked && selected.length >= 5;

                  return (
                    <label
                      key={user._id}
                      className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition ${
                        checked ? "bg-pink-100" : "hover:bg-gray-100"
                      } ${disabled ? "opacity-40 cursor-not-allowed" : ""}`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        disabled={disabled}
                        onChange={() => toggleUser(mentor.id, user._id)}
                      />
                      <span className="text-sm text-gray-700">
                        {user.userId}
                      </span>
                    </label>
                  );
                })}
              </div>

              {/* Save button */}
              <button
                disabled={savingMentor === mentor.id}
                onClick={() => saveUsers(mentor.id)}
                className="w-full bg-black text-white py-2 rounded-xl font-semibold transition hover:bg-gray-800 disabled:opacity-50"
              >
                {savingMentor === mentor.id ? "Saving..." : "Save"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
