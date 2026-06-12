import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";
import toast from "react-hot-toast";
import API_BASE from "../config";

function Documents() {
  const [documents, setDocuments] = useState([]);
  const [uploadType, setUploadType] = useState("resume");
  const [selectedFile, setSelectedFile] = useState(null);
  const [documentName, setDocumentName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_BASE}/api/documents`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDocuments(response.data);
    } catch (error) {
      console.error("Error fetching documents:", error);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      // Auto-fill document name with filename (without extension)
      const nameWithoutExt = file.name.replace(/\.[^/.]+$/, "");
      setDocumentName(nameWithoutExt);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !documentName) {
      toast.error("Please select a file and enter a document name.");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("document", selectedFile);
      formData.append("name", documentName);
      formData.append("type", uploadType);

      const token = localStorage.getItem("token");
      await axios.post(`${API_BASE}/api/documents/upload`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Document uploaded successfully!");
      setSelectedFile(null);
      setDocumentName("");
      fetchDocuments();
    } catch (error) {
      console.error("Error uploading document:", error);
      toast.error("Failed to upload document.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this document?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_BASE}/api/documents/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Document deleted.");
      fetchDocuments();
    } catch (error) {
      console.error("Error deleting document:", error);
      toast.error("Failed to delete document.");
    }
  };

  const resumes = documents.filter((doc) => doc.type === "resume");
  const coverLetters = documents.filter((doc) => doc.type === "coverLetter");

  return (
    <div className="min-h-screen theme-bg theme-text overflow-hidden">
      <div className="absolute w-72 h-72 bg-blue-500 rounded-full blur-[120px] opacity-10 top-10 left-10"></div>
      <div className="absolute w-72 h-72 bg-purple-500 rounded-full blur-[120px] opacity-10 bottom-10 right-10"></div>

      <Navbar />

      <div className="relative z-10 p-8 pt-28 max-w-7xl mx-auto">
        <div className="mb-10">
          <h1 className="text-5xl font-bold text-blue-500">Document Manager</h1>
          <p className="theme-text-secondary mt-3 text-lg">
            Upload and manage your resumes and cover letters
          </p>
        </div>

        {/* Upload Section */}
        <div className="theme-card border backdrop-blur-xl rounded-3xl p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6">Upload New Document</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="theme-label text-sm">Document Type</label>
              <select
                value={uploadType}
                onChange={(e) => setUploadType(e.target.value)}
                className="w-full mt-2 p-4 rounded-xl theme-input border outline-none focus:border-blue-500"
              >
                <option value="resume">Resume</option>
                <option value="coverLetter">Cover Letter</option>
              </select>
            </div>

            <div>
              <label className="theme-label text-sm">Document Name</label>
              <input
                type="text"
                value={documentName}
                onChange={(e) => setDocumentName(e.target.value)}
                placeholder="e.g., Software Engineer Resume v2"
                className="w-full mt-2 p-4 rounded-xl theme-input border outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="mt-6">
            <label className="theme-label text-sm">Select File (PDF, DOC, DOCX)</label>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileSelect}
              className="w-full mt-2 p-4 rounded-xl theme-input border theme-text-secondary file:bg-blue-600 file:text-white file:border-0 file:px-4 file:py-2 file:rounded-xl file:cursor-pointer file:mr-4"
            />
          </div>

          {selectedFile && (
            <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
              <p className="text-blue-400">
                Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} KB)
              </p>
            </div>
          )}

          <button
            onClick={handleUpload}
            disabled={loading}
            className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 disabled:opacity-50"
          >
            {loading ? "Uploading..." : "Upload Document"}
          </button>
        </div>

        {/* Resumes Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-6">Resumes ({resumes.length})</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resumes.map((doc) => (
              <div
                key={doc._id}
                className="theme-card border backdrop-blur-xl rounded-3xl p-6 hover:border-blue-500/40 transition-all duration-300"
              >
                <div className="mb-4">
                  <svg className="w-10 h-10 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">{doc.name}</h3>
                <p className="theme-text-secondary text-sm mb-4">
                  Uploaded: {new Date(doc.uploadedAt).toLocaleDateString()}
                </p>
                <div className="flex gap-3">
                  <a
                    href={`${API_BASE}/uploads/${doc.filename}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 text-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm transition-all duration-300"
                  >
                    View
                  </a>
                  <button
                    onClick={() => handleDelete(doc._id)}
                    className="bg-red-500/20 hover:bg-red-500/30 text-red-400 px-4 py-2 rounded-xl text-sm transition-all duration-300"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
          {resumes.length === 0 && (
            <p className="theme-text-secondary text-center py-8">No resumes uploaded yet</p>
          )}
        </div>

        {/* Cover Letters Section */}
        <div>
          <h2 className="text-3xl font-bold mb-6">Cover Letters ({coverLetters.length})</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coverLetters.map((doc) => (
              <div
                key={doc._id}
                className="theme-card border backdrop-blur-xl rounded-3xl p-6 hover:border-purple-500/40 transition-all duration-300"
              >
                <div className="mb-4">
                  <svg className="w-10 h-10 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">{doc.name}</h3>
                <p className="theme-text-secondary text-sm mb-4">
                  Uploaded: {new Date(doc.uploadedAt).toLocaleDateString()}
                </p>
                <div className="flex gap-3">
                  <a
                    href={`${API_BASE}/uploads/${doc.filename}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 text-center bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl text-sm transition-all duration-300"
                  >
                    View
                  </a>
                  <button
                    onClick={() => handleDelete(doc._id)}
                    className="bg-red-500/20 hover:bg-red-500/30 text-red-400 px-4 py-2 rounded-xl text-sm transition-all duration-300"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
          {coverLetters.length === 0 && (
            <p className="theme-text-secondary text-center py-8">No cover letters uploaded yet</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Documents;
