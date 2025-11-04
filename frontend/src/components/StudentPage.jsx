// frontend/src/components/StudentPage.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function StudentPage() {
  const [student, setStudent] = useState(null);
  const [form, setForm] = useState({ email: "", password: "" });
  const [msg, setMsg] = useState("");
  const [certificates, setCertificates] = useState([]);
  const [file, setFile] = useState(null);
  const [platform, setPlatform] = useState("");
  const [courseName, setCourseName] = useState("");
  const [duration, setDuration] = useState("");
  const [creditType, setCreditType] = useState("external"); // default lowercase for consistency
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("studentInfo");
    if (saved) {
      const s = JSON.parse(saved);
      setStudent(s);
      loadCertificates(s.id);
    }
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleLogin = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || "Login failed");
      localStorage.setItem("studentToken", data.token);
      localStorage.setItem("studentInfo", JSON.stringify(data.user));
      setStudent(data.user);
      loadCertificates(data.user.id);
    } catch (err) {
      setMsg(err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("studentToken");
    localStorage.removeItem("studentInfo");
    setStudent(null);
    setCertificates([]);
  };

  async function loadCertificates(studentId) {
    try {
      const token = localStorage.getItem("studentToken");
      const res = await fetch(`http://localhost:5000/api/credits/student/${studentId}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await res.json();
      if (res.ok) setCertificates(data);
      else console.error("Load certs error:", data);
    } catch (err) {
      console.error("Load certs failed:", err);
    }
  }

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const calcCredits = (weeks) => {
    if (weeks === "12") return 3;
    if (weeks === "8") return 2;
    if (weeks === "4") return 1;
    return 0;
  };

  const handleUpload = async () => {
    if (!file || !courseName || !duration || !platform) {
      return alert("Please select platform, enter course, duration and choose a file");
    }
    if (!student) return alert("Please login first");

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("certificate", file);
      formData.append("studentId", student.id);
      formData.append("platform", platform);
      formData.append("courseName", courseName);
      formData.append("duration", duration);
      // ✅ normalize creditType to lowercase
      formData.append("creditType", creditType.toLowerCase());

      const token = localStorage.getItem("studentToken");
      const res = await fetch("http://localhost:5000/api/credits/upload", {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || "Upload failed");

      setCertificates((prev) => [data, ...prev]);
      setFile(null);
      setPlatform("");
      setCourseName("");
      setDuration("");
      setCreditType("external");
      alert("Certificate uploaded successfully (Pending verification).");
    } catch (err) {
      console.error("Upload error:", err);
      alert(err.message || "Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRequestTransfer = async (certId) => {
    try {
      const token = localStorage.getItem("studentToken");
      const res = await fetch(`http://localhost:5000/api/credits/transfer/${certId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || "Request failed");
      setCertificates((prev) => prev.map((c) => (c._id === certId ? data : c)));
      alert("Transfer requested. Admin will review.");
    } catch (err) {
      console.error("Transfer request error:", err);
      alert(err.message || "Request failed");
    }
  };

  // ========== UI ==========

  if (!student) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <motion.div
          className="bg-white p-6 rounded shadow-md w-full max-w-md"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <h2 className="text-2xl font-bold mb-4 text-center">🎓 Student Login</h2>
          {msg && <p className="text-red-500 mb-2 text-center">{msg}</p>}
          <form onSubmit={handleLogin} className="space-y-3">
            <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} className="w-full border p-2 rounded" required />
            <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} className="w-full border p-2 rounded" required />
            <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">Login</button>
          </form>
          <p className="text-sm mt-3 text-center">
            New Student? <a href="/student/register" className="text-blue-600 underline">Register</a>
          </p>
        </motion.div>
      </div>
    );
  }

  const verifiedCredits = certificates.filter((c) => c.status === "Approved").reduce((sum, c) => sum + c.credits, 0);
  const pending = certificates.filter((c) => c.status === "Pending").length;
  const total = certificates.length;
  const remaining = 20 - verifiedCredits;

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-purple-50 to-blue-100">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Welcome, {student.name} 👋</h2>
          <p className="text-sm text-gray-600">PRN: {student.prn || "—"}</p>
          <p className="text-sm text-gray-600">Email: {student.email}</p>
        </div>
        <button onClick={handleLogout} className="px-4 py-2 bg-red-500 text-white rounded shadow hover:bg-red-600">Logout</button>
      </div>

      {/* Stats */}
      <motion.div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="bg-green-100 text-green-800 p-4 rounded-lg shadow text-center">
          <h3 className="font-bold">Verified Credits</h3>
          <p className="text-2xl">{verifiedCredits}</p>
        </div>
        <div className="bg-yellow-100 text-yellow-800 p-4 rounded-lg shadow text-center">
          <h3 className="font-bold">Pending Requests</h3>
          <p className="text-2xl">{pending}</p>
        </div>
        <div className="bg-blue-100 text-blue-800 p-4 rounded-lg shadow text-center">
          <h3 className="font-bold">Total Certificates</h3>
          <p className="text-2xl">{total}</p>
        </div>
        <div className="bg-purple-100 text-purple-800 p-4 rounded-lg shadow text-center">
          <h3 className="font-bold">Remaining Credits</h3>
          <p className="text-2xl">{remaining}</p>
        </div>
      </motion.div>

      {/* Upload Section */}
      <motion.div className="bg-white rounded-lg shadow p-6 mb-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h3 className="text-lg font-bold mb-4">📤 Add Course Credit</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-3">
          {/* Credit Type */}
          <select value={creditType} onChange={(e) => setCreditType(e.target.value.toLowerCase())} className="border p-2 rounded">
            <option value="external">External (NPTEL / Coursera / edX)</option>
            <option value="internal">Internal (University Subject)</option>
          </select>

          {/* Platform / Subject */}
          {creditType === "external" ? (
            <select value={platform} onChange={(e) => setPlatform(e.target.value)} className="border p-2 rounded">
              <option value="">Select MOOC Platform</option>
              <option value="NPTEL (SWAYAM)">NPTEL (SWAYAM)</option>
              <option value="Coursera">Coursera</option>
              <option value="edX">edX</option>
            </select>
          ) : (
            <input
              type="text"
              placeholder="Platform "
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              className="border p-2 rounded"
            />
          )}

          <input type="text" placeholder="Subject Name" value={courseName} onChange={(e) => setCourseName(e.target.value)} className="border p-2 rounded" />
          <select value={duration} onChange={(e) => setDuration(e.target.value)} className="border p-2 rounded">
            <option value="">Select Duration</option>
            <option value="4">4 Weeks</option>
            <option value="8">8 Weeks</option>
            <option value="12">12 Weeks</option>
          </select>
          <div>
            <input type="file" onChange={handleFileChange} className="mb-2" />
            <div className="text-xs text-gray-500">{file ? file.name : "No file chosen"}</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={handleUpload} disabled={isUploading} className={`px-4 py-2 rounded text-white ${isUploading ? "bg-gray-400" : "bg-indigo-600 hover:bg-indigo-700"}`}>
            {isUploading ? "Uploading..." : "Upload & Calculate Credits"}
          </button>
          <div className="text-sm text-gray-600">
            Credits: <span className="font-semibold">{calcCredits(duration)}</span>
          </div>
        </div>
      </motion.div>

      {/* Certificates Table */}
      <motion.div className="bg-white rounded-lg shadow p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h3 className="text-lg font-bold mb-4">📑 Your Certificates & Requests</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2">Type</th>
                <th className="p-2">Platform</th>
                <th className="p-2">Course</th>
                <th className="p-2">Duration</th>
                <th className="p-2">Credits</th>
                <th className="p-2">Status</th>
                <th className="p-2">Certificate</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {certificates.map((c) => (
                <motion.tr key={c._id} className="border-b" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                  <td className="p-2">
                    {c.creditType
                      ? c.creditType.charAt(0).toUpperCase() + c.creditType.slice(1)
                      : "External"}
                  </td>
                  <td className="p-2">{c.platform || "—"}</td>
                  <td className="p-2">{c.courseName}</td>
                  <td className="p-2">
                    {c.duration?.toString().includes("week") ? c.duration : `${c.duration} weeks`}
                  </td>
                  <td className="p-2">{c.credits}</td>
                  <td className="p-2">
                    <span
                      className={`px-2 py-1 rounded text-sm ${
                        c.status === "Pending"
                          ? "bg-yellow-200 text-yellow-800"
                          : c.status === "Requested"
                          ? "bg-indigo-200 text-indigo-800"
                          : c.status === "Approved"
                          ? "bg-green-200 text-green-800"
                          : "bg-red-200 text-red-800"
                      }`}
                    >
                      {c.status}
                    </span>
                  </td>
                  <td className="p-2">
                    {c.certificateUrl ? (
                      <a
                        href={`http://localhost:5000/${c.certificateUrl.replace(/^\/+/, "")}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 underline"
                      >
                        Preview / Download
                      </a>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="p-2">
                    {c.status === "Pending" && (
                      <button
                        onClick={() => handleRequestTransfer(c._id)}
                        className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                      >
                        Request Transfer
                      </button>
                    )}
                    {c.status === "Requested" && (
                      <span className="text-sm text-yellow-700">Requested</span>
                    )}
                    {c.status === "Approved" && (
                      <span className="text-sm text-green-700">Approved</span>
                    )}
                    {c.status === "Rejected" && (
                      <span className="text-sm text-red-600">Rejected</span>
                    )}
                  </td>
                </motion.tr>
              ))}
              {certificates.length === 0 && (
                <tr>
                  <td colSpan="8" className="text-center p-4 text-gray-500">
                    No certificates uploaded yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
