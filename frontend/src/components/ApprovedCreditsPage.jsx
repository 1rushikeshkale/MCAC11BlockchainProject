// frontend/src/components/ApprovedCreditsPage.jsx
import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function ApprovedCreditsPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // 'all' | 'external' | 'internal'

  // ✅ Normalize and handle different field names or casing
  const resolveType = (row) => {
    const raw =
      (row?.creditType ?? row?.type ?? "")
        .toString()
        .trim()
        .toLowerCase();

    if (raw === "internal" || raw === "external") return raw;
    if (row?.subject) return "internal"; // fallback if subject exists
    return "external";
  };

  const labelType = (row) => {
    const t = resolveType(row);
    return t.charAt(0).toUpperCase() + t.slice(1); // Internal | External
  };

  // ✅ Fetch all credit requests
  useEffect(() => {
    async function fetchRequests() {
      try {
        const res = await fetch("http://localhost:5000/api/credits/requests");
        const data = await res.json();
        console.log("✅ Fetched Requests:", data);
        if (Array.isArray(data)) setRequests(data);
        else setRequests([]);
      } catch (err) {
        console.error("❌ Error fetching requests:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchRequests();
  }, []);

  // ✅ Approve / Reject actions
  const handleAction = async (id, action) => {
    if (!id) {
      alert("❌ Invalid ID — cannot process request.");
      return;
    }

    try {
      console.log(`🟢 Sending ${action.toUpperCase()} request for ID:`, id);
      const res = await fetch(`http://localhost:5000/api/credits/${id}/${action}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();

      if (res.ok) {
        const updatedCredit = data.credit ? data.credit : data;
        setRequests((prev) => prev.map((r) => (r._id === id ? updatedCredit : r)));
        alert(data.msg || `✅ Successfully ${action}ed credit request.`);
      } else {
        alert(data.msg || `❌ Failed to ${action} request.`);
      }
    } catch (err) {
      console.error(`❌ Error during ${action}:`, err);
      alert("⚠️ Server or Blockchain error — check backend logs.");
    }
  };

  // ✅ Status counts
  const pending = requests.filter(
    (r) => r.status === "Pending" || r.status === "Requested"
  );
  const approved = requests.filter((r) => r.status === "Approved");
  const rejected = requests.filter((r) => r.status === "Rejected");

  // ✅ Filter by tab (All / External / Internal)
  const filteredRequests = useMemo(() => {
    if (filter === "all") return requests;
    return requests.filter((r) => resolveType(r) === filter);
  }, [requests, filter]);

  // ✅ UI
  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
          Academic Credit Management
        </h1>
        <Link
          to="/admin"
          className="px-4 py-2 bg-indigo-600 text-white rounded shadow hover:bg-indigo-700"
        >
          ← Back to Admin
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-4 mb-6">
        {[
          { key: "all", label: "All" },
          { key: "external", label: "External" },
          { key: "internal", label: "Internal" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`px-4 py-2 rounded-lg font-semibold shadow transition ${
              filter === tab.key
                ? "bg-indigo-600 text-white"
                : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Status Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-yellow-100 text-yellow-800 rounded-lg p-4 shadow text-center">
          Pending Review <span className="font-bold">({pending.length})</span>
        </div>
        <div className="bg-green-100 text-green-800 rounded-lg p-4 shadow text-center">
          Approved <span className="font-bold">({approved.length})</span>
        </div>
        <div className="bg-red-100 text-red-800 rounded-lg p-4 shadow text-center">
          Rejected <span className="font-bold">({rejected.length})</span>
        </div>
        <div className="bg-blue-100 text-blue-800 rounded-lg p-4 shadow text-center">
          Total Requests <span className="font-bold">({requests.length})</span>
        </div>
      </div>

      {/* Table */}
      <motion.div
        className="mb-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-xl font-semibold mb-4">
          {filter === "internal"
            ? "🏛️ Internal Course Credits"
            : filter === "external"
            ? "🌐 External Course Credits"
            : "📋 All Credit Requests"}
        </h2>

        {loading ? (
          <p className="text-center text-gray-500 p-4">Loading...</p>
        ) : (
          <RequestTable
            data={filteredRequests}
            handleAction={handleAction}
            labelType={labelType}
          />
        )}
      </motion.div>
    </div>
  );
}

// ================== Subcomponent ==================
function RequestTable({ data, handleAction, labelType }) {
  if (!data || data.length === 0) {
    return <p className="text-center text-gray-500 p-4">No requests found</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
            <th className="p-3">Type</th>
            <th className="p-3">Student</th>
            <th className="p-3">Platform </th>
            <th className="p-3">Course</th>
            <th className="p-3">Duration</th>
            <th className="p-3">Credits</th>
            <th className="p-3">Certificate</th>
            <th className="p-3">Status</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((req) => (
            <motion.tr
              key={req._id || req.id}
              className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              {/* Type */}
              <td className="p-3 font-semibold">{labelType(req)}</td>

              {/* Student */}
              <td className="p-3">
                <div className="font-semibold">{req.studentName}</div>
                <div className="text-sm text-gray-600">
                  PRN: {req.prn || "—"}
                </div>
                <div className="text-sm text-gray-500">{req.studentEmail}</div>
              </td>

              {/* Platform / Subject */}
              <td className="p-3">{req.platform || req.subject || "—"}</td>

              {/* Course */}
              <td className="p-3">{req.courseName}</td>

              {/* Duration (✅ fixed to always show "weeks") */}
              <td className="p-3">
                {String(req.duration).toLowerCase().includes("week")
                  ? req.duration
                  : `${req.duration} weeks`}
              </td>

              {/* Credits */}
              <td className="p-3">{req.credits}</td>

              {/* Certificate */}
              <td className="p-3">
                {req.certificateUrl ? (
                  <a
                    href={`http://localhost:5000/${req.certificateUrl.replace(/^\/+/, "")}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 underline"
                  >
                    View
                  </a>
                ) : (
                  "—"
                )}
              </td>

              {/* Status */}
              <td className="p-3">
                <span
                  className={`px-2 py-1 rounded text-sm ${
                    req.status === "Pending"
                      ? "bg-yellow-200 text-yellow-800"
                      : req.status === "Approved"
                      ? "bg-green-200 text-green-800"
                      : req.status === "Rejected"
                      ? "bg-red-200 text-red-800"
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  {req.status}
                </span>
              </td>

              {/* Actions */}
              <td className="p-3 flex gap-2">
                <button
                  onClick={() => handleAction(req._id || req.id, "approve")}
                  className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleAction(req._id || req.id, "reject")}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                >
                  Reject
                </button>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
