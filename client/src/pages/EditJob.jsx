import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getJobById, updateJob } from "../services/jobService";
import axios from "axios";
import toast from "react-hot-toast";

function EditJob() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    company: "",
    role: "",
    status: "Applied",
    salary: "",
    location: "",
    jobLink: "",
    notes: "",
    interviewDate: "",
    interviewRound: "",
    interviewNotes: "",
    resumeUsed: "",
    coverLetterUsed: "",
  });

  const [resumes, setResumes] = useState([]);
  const [coverLetters, setCoverLetters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        // Fetch job and documents in parallel
        const [job, docsRes] = await Promise.all([
          getJobById(id),
          axios.get("http://localhost:5000/api/documents", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setFormData({
          company: job.company || "",
          role: job.role || "",
          status: job.status || "Applied",
          salary: job.salary || "",
          location: job.location || "",
          jobLink: job.jobLink || "",
          notes: job.notes || "",
          interviewDate: job.interviewDate || "",
          interviewRound: job.interviewRound || "",
          interviewNotes: job.interviewNotes || "",
          resumeUsed: job.resumeUsed?._id || "",
          coverLetterUsed: job.coverLetterUsed?._id || "",
        });

        setResumes(docsRes.data.filter((d) => d.type === "resume"));
        setCoverLetters(docsRes.data.filter((d) => d.type === "coverLetter"));
      } catch (err) {
        console.log(err);
        toast.error("Failed to load job.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateJob(id, {
        ...formData,
        resumeUsed: formData.resumeUsed || null,
        coverLetterUsed: formData.coverLetterUsed || null,
      });
      toast.success("Job updated successfully!");
      navigate("/dashboard");
    } catch (err) {
      console.log(err);
      toast.error("Failed to update job.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen theme-bg theme-text flex items-center justify-center">
        <Navbar />
        <p className="theme-text-secondary text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen theme-bg theme-text overflow-hidden relative">
      <div className="absolute w-72 h-72 bg-blue-500 rounded-full blur-[120px] opacity-10 top-10 left-10"></div>
      <div className="absolute w-72 h-72 bg-purple-500 rounded-full blur-[120px] opacity-10 bottom-10 right-10"></div>

      <Navbar />

      <div className="relative z-10 max-w-3xl mx-auto pt-32 px-6 pb-20">
        <div className="theme-card border backdrop-blur-xl rounded-3xl p-8 shadow-2xl">
          <h1 className="text-4xl font-bold text-blue-500 mb-2">Edit Job</h1>
          <p className="theme-text-secondary mb-8">Update your application details</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="theme-label">Company</label>
              <input type="text" name="company" value={formData.company} onChange={handleChange}
                className="w-full mt-2 p-4 rounded-xl theme-input border outline-none focus:border-blue-500" />
            </div>

            <div>
              <label className="theme-label">Role</label>
              <input type="text" name="role" value={formData.role} onChange={handleChange}
                className="w-full mt-2 p-4 rounded-xl theme-input border outline-none focus:border-blue-500" />
            </div>

            <div>
              <label className="theme-label">Status</label>
              <select name="status" value={formData.status} onChange={handleChange}
                className="w-full mt-2 p-4 rounded-xl theme-input border outline-none focus:border-blue-500">
                <option>Applied</option>
                <option>Interview</option>
                <option>Offer</option>
                <option>Rejected</option>
              </select>
            </div>

            <div>
              <label className="theme-label">Salary</label>
              <input type="text" name="salary" value={formData.salary} onChange={handleChange}
                className="w-full mt-2 p-4 rounded-xl theme-input border outline-none focus:border-blue-500" />
            </div>

            <div>
              <label className="theme-label">Location</label>
              <input type="text" name="location" value={formData.location} onChange={handleChange}
                className="w-full mt-2 p-4 rounded-xl theme-input border outline-none focus:border-blue-500" />
            </div>

            <div>
              <label className="theme-label">Job Link</label>
              <input type="text" name="jobLink" value={formData.jobLink} onChange={handleChange}
                className="w-full mt-2 p-4 rounded-xl theme-input border outline-none focus:border-blue-500" />
            </div>

            <div>
              <label className="theme-label">Notes</label>
              <textarea rows="3" name="notes" value={formData.notes} onChange={handleChange}
                className="w-full mt-2 p-4 rounded-xl theme-input border outline-none focus:border-blue-500" />
            </div>

            {/* Interview Details */}
            <div className="border border-[var(--border-color)] rounded-2xl p-5 space-y-4">
              <p className="font-semibold text-yellow-400">Interview Details (Optional)</p>

              <div>
                <label className="theme-label">Interview Date</label>
                <input type="text" name="interviewDate" value={formData.interviewDate} onChange={handleChange}
                  placeholder="e.g. Jan 15, 2025"
                  className="w-full mt-2 p-4 rounded-xl theme-input border outline-none focus:border-blue-500" />
              </div>

              <div>
                <label className="theme-label">Interview Round</label>
                <input type="text" name="interviewRound" value={formData.interviewRound} onChange={handleChange}
                  placeholder="e.g. Technical Round 1"
                  className="w-full mt-2 p-4 rounded-xl theme-input border outline-none focus:border-blue-500" />
              </div>

              <div>
                <label className="theme-label">Interview Notes</label>
                <textarea rows="3" name="interviewNotes" value={formData.interviewNotes} onChange={handleChange}
                  placeholder="What was discussed..."
                  className="w-full mt-2 p-4 rounded-xl theme-input border outline-none focus:border-blue-500" />
              </div>
            </div>

            {/* Document selectors */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="theme-label">Resume (Optional)</label>
                <select name="resumeUsed" value={formData.resumeUsed} onChange={handleChange}
                  className="w-full mt-2 p-4 rounded-xl theme-input border outline-none focus:border-blue-500">
                  <option value="">-- None --</option>
                  {resumes.map((r) => (
                    <option key={r._id} value={r._id}>{r.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="theme-label">Cover Letter (Optional)</label>
                <select name="coverLetterUsed" value={formData.coverLetterUsed} onChange={handleChange}
                  className="w-full mt-2 p-4 rounded-xl theme-input border outline-none focus:border-blue-500">
                  <option value="">-- None --</option>
                  {coverLetters.map((c) => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-4">
              <button type="button" onClick={() => navigate("/dashboard")}
                className="flex-1 py-4 rounded-xl border border-[var(--border-color)] theme-text hover:bg-white/5 transition-all duration-300">
                Cancel
              </button>
              <button type="submit" disabled={saving}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-semibold transition-all duration-300 disabled:opacity-50">
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditJob;
