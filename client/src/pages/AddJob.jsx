import { useState, useEffect } from "react";
import { createJob } from "../services/jobService";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import axios from "axios";
import toast from "react-hot-toast";

function AddJob() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    company: "",
    role: "",
    status: "Applied",
    salary: "",
    location: "",
    jobLink: "",
    notes: "",
    resumeUsed: "",
    coverLetterUsed: "",
  });

  const [resumes, setResumes] = useState([]);
  const [coverLetters, setCoverLetters] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/documents", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setResumes(res.data.filter((d) => d.type === "resume"));
        setCoverLetters(res.data.filter((d) => d.type === "coverLetter"));
      } catch (err) {
        console.log("Failed to load documents", err);
      }
    };
    fetchDocuments();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const jobData = {
        ...formData,
        resumeUsed: formData.resumeUsed || null,
        coverLetterUsed: formData.coverLetterUsed || null,
      };
      await createJob(jobData);
      toast.success("Job added successfully!");
      navigate("/dashboard");
    } catch (error) {
      console.log(error);
      toast.error("Failed to add job.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen theme-bg theme-text overflow-hidden relative">
      <div className="absolute w-72 h-72 bg-blue-500 rounded-full blur-[120px] opacity-10 top-10 left-10"></div>
      <div className="absolute w-72 h-72 bg-purple-500 rounded-full blur-[120px] opacity-10 bottom-10 right-10"></div>

      <Navbar />

      <div className="relative z-10 max-w-3xl mx-auto pt-32 px-6 pb-20">
        <div className="theme-card border backdrop-blur-xl rounded-3xl p-8 shadow-2xl">
          <h1 className="text-4xl font-bold text-blue-500 mb-2">Add New Job</h1>
          <p className="theme-text-secondary mb-8">Track your next opportunity</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="theme-label">Company</label>
              <input type="text" name="company" value={formData.company} onChange={handleChange}
                placeholder="Google"
                className="w-full mt-2 p-4 rounded-xl theme-input border outline-none focus:border-blue-500" />
            </div>

            <div>
              <label className="theme-label">Role</label>
              <input type="text" name="role" value={formData.role} onChange={handleChange}
                placeholder="Frontend Developer"
                className="w-full mt-2 p-4 rounded-xl theme-input border outline-none focus:border-blue-500" />
            </div>

            <div>
              <label className="theme-label">Status</label>
              <select name="status" value={formData.status} onChange={handleChange}
                className="w-full mt-2 p-4 rounded-xl theme-input border outline-none focus:border-blue-500">
                <option>Applied</option>
                <option>Interview</option>
                <option>Rejected</option>
                <option>Offer</option>
              </select>
            </div>

            <div>
              <label className="theme-label">Salary</label>
              <input type="text" name="salary" value={formData.salary} onChange={handleChange}
                placeholder="$60,000"
                className="w-full mt-2 p-4 rounded-xl theme-input border outline-none focus:border-blue-500" />
            </div>

            <div>
              <label className="theme-label">Location</label>
              <input type="text" name="location" value={formData.location} onChange={handleChange}
                placeholder="Dublin"
                className="w-full mt-2 p-4 rounded-xl theme-input border outline-none focus:border-blue-500" />
            </div>

            <div>
              <label className="theme-label">Job Link</label>
              <input type="text" name="jobLink" value={formData.jobLink} onChange={handleChange}
                placeholder="https://..."
                className="w-full mt-2 p-4 rounded-xl theme-input border outline-none focus:border-blue-500" />
            </div>

            <div>
              <label className="theme-label">Notes</label>
              <textarea rows="4" name="notes" value={formData.notes} onChange={handleChange}
                placeholder="Recruiter reached out..."
                className="w-full mt-2 p-4 rounded-xl theme-input border outline-none focus:border-blue-500" />
            </div>

            {/* Document selectors from library */}
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
                {resumes.length === 0 && (
                  <p className="text-xs theme-text-secondary mt-1">
                    No resumes in library.{" "}
                    <a href="/documents" className="text-blue-400 hover:underline">Upload one</a>
                  </p>
                )}
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
                {coverLetters.length === 0 && (
                  <p className="text-xs theme-text-secondary mt-1">
                    No cover letters in library.{" "}
                    <a href="/documents" className="text-blue-400 hover:underline">Upload one</a>
                  </p>
                )}
              </div>
            </div>

            <button disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 py-4 rounded-xl font-semibold transition-all duration-300 text-white disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? "Saving..." : "Save Job"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddJob;
