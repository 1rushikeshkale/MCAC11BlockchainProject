import React, { useEffect, useState } from "react";
import { usePageTitle } from "../hooks/usePageTitle";
import { useToast } from "../hooks/useToast";
import BlockchainLoader from "./BlockchainLoader";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function IssueCertificate({ account, isAdmin, isCurrentMinter }) {
  const [form, setForm] = useState({
    name: "",
    PRNNumber: "",
    motherName: "",
    seatNumber: "",
    college:
      "Mahatma Education Societys Pillai HOC College of Engineering and Technology",
    batch: "",
    semester: "I",
    month: "DEC",
    year: new Date().getFullYear(),
    grade: "",
    result: "PASS",
    percentage: "",
  });

  const emptyCourse = {
    code: "",
    courseName: "",
    ia: "",
    et: "",
    theoryTotal: "",
    tw: "",
    pr: "",
    practicalTotal: "",
    remark: "",
  };

  const [courses, setCourses] = useState([Object.assign({}, emptyCourse)]);
  const [isLoading, setIsLoading] = useState(false);
  const [certificateIssued, setCertificateIssued] = useState(false);

  usePageTitle("PHCET - Issue Certificate");
  const toast = useToast();

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function clampMarks(v) {
    if (v === "") return "";
    const n = Number(v);
    if (Number.isNaN(n)) return "";
    if (n < 0) return 0;
    if (n > 50) return 50;
    return Math.round(n);
  }

  function computeRemarkForCourse(c) {
    const ia = c.ia === "" ? null : Number(c.ia);
    const et = c.et === "" ? null : Number(c.et);
    const tw = c.tw === "" ? null : Number(c.tw);
    const pr = c.pr === "" ? null : Number(c.pr);

    let theoryTotal = null;
    let practicalTotal = null;
    let theoryPass = true;
    let practicalPass = true;

    if (ia !== null || et !== null) {
      const iaVal = ia === null ? 0 : ia;
      const etVal = et === null ? 0 : et;
      theoryTotal = iaVal + etVal;
      if ((ia !== null && ia < 20) || (et !== null && et < 20)) theoryPass = false;
    }

    if (tw !== null || pr !== null) {
      const twVal = tw === null ? 0 : tw;
      const prVal = pr === null ? 0 : pr;
      practicalTotal = twVal + prVal;
      if ((tw !== null && tw < 20) || (pr !== null && pr < 20)) practicalPass = false;
    }

    let remark = "N/A";
    if (theoryTotal !== null || practicalTotal !== null) {
      remark = "Pass";
      if ((theoryTotal !== null && !theoryPass) || (practicalTotal !== null && !practicalPass)) remark = "Fail";
    }

    return { theoryTotal, practicalTotal, remark };
  }

  function handleCourseChange(index, e) {
    const { name, value } = e.target;
    const updated = [...courses];
    if (["ia", "et", "tw", "pr"].includes(name)) {
      updated[index][name] = clampMarks(value);
    } else {
      updated[index][name] = value;
    }

    const derived = computeRemarkForCourse(updated[index]);
    updated[index].theoryTotal = derived.theoryTotal === null ? "" : derived.theoryTotal;
    updated[index].practicalTotal = derived.practicalTotal === null ? "" : derived.practicalTotal;
    updated[index].remark = derived.remark;

    setCourses(updated);
    recalcOverall(updated);
  }

  function addCourseRow() {
    setCourses([...courses, Object.assign({}, emptyCourse)]);
  }

  function removeCourseRow(i) {
    if (courses.length === 1) return;
    const updated = courses.filter((_, idx) => idx !== i);
    setCourses(updated);
    recalcOverall(updated);
  }

  function recalcOverall(courseList = courses) {
    let obtained = 0;
    let maxPossible = 0;
    let anyFail = false;

    courseList.forEach((c) => {
      const ia = c.ia === "" ? null : Number(c.ia);
      const et = c.et === "" ? null : Number(c.et);
      const tw = c.tw === "" ? null : Number(c.tw);
      const pr = c.pr === "" ? null : Number(c.pr);

      if (ia !== null || et !== null) {
        obtained += (ia === null ? 0 : ia) + (et === null ? 0 : et);
        maxPossible += 100;
        if ((ia !== null && ia < 20) || (et !== null && et < 20)) anyFail = true;
      }
      if (tw !== null || pr !== null) {
        obtained += (tw === null ? 0 : tw) + (pr === null ? 0 : pr);
        maxPossible += 100;
        if ((tw !== null && tw < 20) || (pr !== null && pr < 20)) anyFail = true;
      }
    });

    const percentage = maxPossible === 0 ? 0 : (obtained / maxPossible) * 100;
    const grade = percentageToGrade(percentage);
    const result = anyFail ? "FAIL" : "PASS";

    setForm((prev) => ({
      ...prev,
      percentage: percentage.toFixed(2),
      grade,
      result,
    }));
  }

  function percentageToGrade(p) {
    if (p >= 70) return "A+";
    if (p >= 60) return "A";
    if (p >= 55) return "B+";
    if (p >= 50) return "B";
    if (p >= 45) return "C";
    if (p >= 40) return "D";
    return "F";
  }

  async function issueCertificate(e) {
    e.preventDefault();
    if (!form.name || !form.PRNNumber) {
      toast.error("Please fill Name and PRN Number.");
      return;
    }

    for (let i = 0; i < courses.length; i++) {
      const c = courses[i];
      for (const f of ["ia", "et", "tw", "pr"]) {
        if (c[f] !== "" && (Number.isNaN(Number(c[f])) || Number(c[f]) < 0 || Number(c[f]) > 50)) {
          toast.error(`Invalid marks in row ${i + 1} for ${f.toUpperCase()}.`);
          return;
        }
      }
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setCertificateIssued(true);
      toast.success("Certificate issued successfully!");
    }, 1000);
  }

  async function downloadPDF() {
    const input = document.getElementById("certificatePreview");
    if (!input) return;
    const canvas = await html2canvas(input, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`gradecard_${form.PRNNumber || "student"}.pdf`);
  }

  useEffect(() => {
    recalcOverall();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-center mb-6 text-gray-800 dark:text-gray-200">📝 Issue Certificate</h2>

      {/* Input Form */}
      <form onSubmit={issueCertificate} className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input name="name" placeholder="Full Name" value={form.name} onChange={handleChange} className="border p-2 rounded" required />
          <input name="PRNNumber" placeholder="PRN Number" value={form.PRNNumber} onChange={handleChange} className="border p-2 rounded" required />

          <input name="motherName" placeholder="Mother's Name" value={form.motherName} onChange={handleChange} className="border p-2 rounded" />
          <input name="seatNumber" placeholder="Seat Number" value={form.seatNumber} onChange={handleChange} className="border p-2 rounded" />

          <input name="batch" placeholder="Batch (e.g. 2024-JULY)" value={form.batch} onChange={handleChange} className="border p-2 rounded" />

          <div className="flex gap-2">
            <select name="month" value={form.month} onChange={handleChange} className="border p-2 rounded flex-1">
              {["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"].map(m => <option key={m}>{m}</option>)}
            </select>
            <select name="semester" value={form.semester} onChange={handleChange} className="border p-2 rounded">
              {["I","II","III","IV"].map(s => <option key={s}>{s}</option>)}
            </select>
            <input name="year" value={form.year} onChange={handleChange} className="border p-2 rounded w-32" />
          </div>

          <input name="percentage" placeholder="Percentage" value={form.percentage} readOnly className="border p-2 rounded" />
          <input name="grade" placeholder="Grade" value={form.grade} readOnly className="border p-2 rounded" />
        </div>

        <h3 className="text-lg font-bold mt-4">Course Details</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300 mt-2 text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border border-gray-300">#</th>
                <th className="p-2 border border-gray-300">Course Code</th>
                <th className="p-2 border border-gray-300">Course Name</th>
                <th className="p-2 border border-gray-300">IA (Max 50)</th>
                <th className="p-2 border border-gray-300">End Term (Max 50)</th>
                <th className="p-2 border border-gray-300">Theory Total (100)</th>
                <th className="p-2 border border-gray-300">TW (Max 50)</th>
                <th className="p-2 border border-gray-300">Practical (Max 50)</th>
                <th className="p-2 border border-gray-300">Practical Total (100)</th>
                <th className="p-2 border border-gray-300">Remark</th>
                <th className="p-2 border border-gray-300">Action</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course, idx) => (
                <tr key={idx} className="border-t">
                  <td className="p-2 border border-gray-300">{idx + 1}</td>
                  <td className="p-2 border border-gray-300"><input name="code" value={course.code} onChange={(e) => handleCourseChange(idx, e)} className="border p-1 w-24" /></td>
                  <td className="p-2 border border-gray-300"><input name="courseName" value={course.courseName} onChange={(e) => handleCourseChange(idx, e)} className="border p-1 w-64" /></td>
                  <td className="p-2 border border-gray-300"><input name="ia" value={course.ia} onChange={(e) => handleCourseChange(idx, e)} className="border p-1 w-20" /></td>
                  <td className="p-2 border border-gray-300"><input name="et" value={course.et} onChange={(e) => handleCourseChange(idx, e)} className="border p-1 w-20" /></td>
                  <td className="p-2 border border-gray-300 text-center">{course.theoryTotal || ""}</td>
                  <td className="p-2 border border-gray-300"><input name="tw" value={course.tw} onChange={(e) => handleCourseChange(idx, e)} className="border p-1 w-20" /></td>
                  <td className="p-2 border border-gray-300"><input name="pr" value={course.pr} onChange={(e) => handleCourseChange(idx, e)} className="border p-1 w-20" /></td>
                  <td className="p-2 border border-gray-300 text-center">{course.practicalTotal || ""}</td>
                  <td className="p-2 border border-gray-300 text-center">{course.remark}</td>
                  <td className="p-2 border border-gray-300 text-center">
                    <button type="button" onClick={() => removeCourseRow(idx)} className="px-2 py-1 bg-red-500 text-white rounded">Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex gap-2 mt-2">
          <button type="button" onClick={addCourseRow} className="px-3 py-1 bg-blue-500 text-white rounded">+ Add Course</button>
        </div>

        <button type="submit" className="w-full px-6 py-3 bg-green-600 text-white font-bold rounded-lg shadow-lg mt-4">
          {isLoading ? <BlockchainLoader size={20} /> : "🎯 Issue Certificate"}
        </button>
      </form>

      {/* Certificate Preview */}
      {certificateIssued && (
        <div className="mt-8 p-6">
          <div id="certificatePreview" className="mx-auto p-6" style={{ maxWidth: "842px" /* A4 width px approx at normal zoom */, backgroundColor: "#eaf6fc", border: "1px solid #d1d5db", boxShadow: "0 4px 8px rgba(0,0,0,0.05)" }}>
            {/* thin gray frame */}
            <div style={{ border: "8px solid #f8fafc", padding: 12 }}>
              <div style={{ border: "1px solid #d1d5db", backgroundColor: "#ffffff", padding: 18 }}>
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <img src="/SUST.png" alt="College Logo" className="w-24 h-24 object-contain" />
                    <div className="text-left">
                      <div className="text-sm font-medium" style={{ letterSpacing: 0.6 }}>Mahatma Education Society's</div>
                      <div className="text-2xl font-extrabold leading-tight" style={{ fontSize: "22px" }}>Pillai HOC College of Engineering and Technology</div>
                      <div className="text-xs mt-1">ACCREDITED 'A+' GRADE BY NAAC Dist. Raigad, Via Panvel (Navi-Mumbai), Rasayani, Tal. Khalapur 410207, Maharashtra, India</div>
                    </div>
                  </div>
                </div>

                <hr className="my-4" />

                <div className="text-center mt-2 mb-4">
                  <h3 className="font-bold" style={{ fontSize: "16px" }}>Statement of Grade for</h3>
                  <p className="font-semibold">{`Master of Computer Application Semester ${form.semester} Examination : ${form.month} ${form.year}`}</p>
                </div>

                {/* Student details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm mt-4">
                  <div>
                    <p><b>Name :</b> {form.name}</p>
                    <p><b>PRN Number :</b> {form.PRNNumber}</p>
                    <p><b>College :</b> {form.college}</p>
                  </div>
                  <div>
                    <p><b>Mother's Name :</b> {form.motherName}</p>
                    <p><b>Seat Number :</b> {form.seatNumber}</p>
                    <p><b>Batch :</b> {form.batch}</p>
                  </div>
                </div>

                {/* Marks table */}
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full border-collapse" style={{ border: "1px solid #cbd5e1", fontSize: "13px" }}>
                    <thead>
                      <tr style={{ backgroundColor: "#f1f9fc" }}>
                        <th className="p-2 border" style={{ border: "1px solid #cbd5e1" }}>Course Code</th>
                        <th className="p-2 border" style={{ border: "1px solid #cbd5e1" }}>Course Name</th>
                        <th className="p-2 border text-center" style={{ border: "1px solid #cbd5e1" }}>IA</th>
                        <th className="p-2 border text-center" style={{ border: "1px solid #cbd5e1" }}>End Term</th>
                        <th className="p-2 border text-center" style={{ border: "1px solid #cbd5e1" }}>Theory Total</th>
                        <th className="p-2 border text-center" style={{ border: "1px solid #cbd5e1" }}>TW</th>
                        <th className="p-2 border text-center" style={{ border: "1px solid #cbd5e1" }}>Practical</th>
                        <th className="p-2 border text-center" style={{ border: "1px solid #cbd5e1" }}>Practical Total</th>
                        <th className="p-2 border text-center" style={{ border: "1px solid #cbd5e1" }}>Remark</th>
                      </tr>
                    </thead>
                    <tbody>
                      {courses.map((c, i) => (
                        <tr key={i}>
                          <td className="p-2 border" style={{ border: "1px solid #e2e8f0" }}>{c.code}</td>
                          <td className="p-2 border" style={{ border: "1px solid #e2e8f0" }}>{c.courseName}</td>
                          <td className="p-2 border text-center" style={{ border: "1px solid #e2e8f0" }}>{c.ia}</td>
                          <td className="p-2 border text-center" style={{ border: "1px solid #e2e8f0" }}>{c.et}</td>
                          <td className="p-2 border text-center" style={{ border: "1px solid #e2e8f0" }}>{c.theoryTotal}</td>
                          <td className="p-2 border text-center" style={{ border: "1px solid #e2e8f0" }}>{c.tw}</td>
                          <td className="p-2 border text-center" style={{ border: "1px solid #e2e8f0" }}>{c.pr}</td>
                          <td className="p-2 border text-center" style={{ border: "1px solid #e2e8f0" }}>{c.practicalTotal}</td>
                          <td className="p-2 border text-center" style={{ border: "1px solid #e2e8f0" }}>{c.remark}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Summary */}
                <div className="mt-4 flex justify-end gap-8 text-sm">
                  <div><b>Percentage:</b> {form.percentage} %</div>
                  <div><b>Grade:</b> {form.grade}</div>
                  <div><b>Result:</b> {form.result}</div>
                </div>

                {/* Signature placeholder */}
                <div className="mt-10 flex justify-between items-end">
                  <div style={{ width: 240, textAlign: "left" }}>
                    <div style={{ borderTop: "1px solid #cbd5e1", paddingTop: 6 }}>Controller of Examinations</div>
                    <div className="text-xs mt-1">Mahatma Education Societys Pillai HOC College</div>
                  </div>
                  <div style={{ width: 240, textAlign: "right" }}>
                    <div style={{ borderTop: "1px solid #cbd5e1", paddingTop: 6 }}>Principal</div>
                    <div className="text-xs mt-1">Pillai HOC College of Engineering and Technology</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Download */}
          <div className="mt-4 text-center">
            <button onClick={downloadPDF} className="px-6 py-2 bg-blue-700 text-white rounded shadow">⬇ Download as PDF</button>
          </div>
        </div>
      )}
    </div>
  );
}
