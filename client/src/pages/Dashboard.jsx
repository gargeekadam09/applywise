import { useEffect, useState, useRef } from "react";
import Navbar from "../components/Navbar";
import KanbanBoard from "../components/KanbanBoard";
import SearchAndFilter from "../components/SearchAndFilter";
import toast from "react-hot-toast";
import API_BASE from "../config";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  getJobs,
  deleteJob,
  updateJob,
} from "../services/jobService";

// Counts up from 0 to `target` over `duration` ms
function useCountUp(target, duration = 1000) {
  const [count, setCount] = useState(0);
  const prev = useRef(0);
  useEffect(() => {
    if (target === prev.current) return;
    const start = prev.current;
    const diff = target - start;
    const startTime = performance.now();
    const tick = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      setCount(Math.floor(start + diff * progress));
      if (progress < 1) requestAnimationFrame(tick);
      else { setCount(target); prev.current = target; }
    };
    requestAnimationFrame(tick);
  }, [target, duration]);
  return count;
}

function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [showAllJobs, setShowAllJobs] = useState(false);
  const [filterStatus, setFilterStatus] = useState(null);
  const [viewMode, setViewMode] = useState("grid"); // "grid" or "kanban"

  const totalCount = useCountUp(jobs.length);
  const interviewCount = useCountUp(jobs.filter((j) => j.status === "Interview").length);
  const rejectedCount = useCountUp(jobs.filter((j) => j.status === "Rejected").length);
  const chartData = [
  {
    name: "Applied",
    value: jobs.filter(
      (job) => job.status === "Applied"
    ).length,
  },

  {
    name: "Interview",
    value: jobs.filter(
      (job) => job.status === "Interview"
    ).length,
  },

  {
    name: "Offer",
    value: jobs.filter(
      (job) => job.status === "Offer"
    ).length,
  },

  {
    name: "Rejected",
    value: jobs.filter(
      (job) => job.status === "Rejected"
    ).length,
  },
];

const COLORS = [
  "#3B82F6",
  "#EAB308",
  "#22C55E",
  "#EF4444",
];

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const data = await getJobs();
        console.log("Jobs data:", data);
        setJobs(data);
        setFilteredJobs(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchJobs();
  }, []);

  const handleDelete = async (id) => {
  try {
    await deleteJob(id);
    setJobs(jobs.filter((job) => job._id !== id));
    toast.success("Job deleted.");
  } catch (error) {
    console.log(error);
    toast.error("Failed to delete job.");
  }
};

const handleStatusChange = async (
  id,
  newStatus
) => {
  try {
    const updatedJob = await updateJob(id, {
      status: newStatus,
    });

    const updatedJobs = jobs.map((job) =>
      job._id === id ? updatedJob : job
    );
    setJobs(updatedJobs);
    applyFiltersAndSort(updatedJobs);

  } catch (error) {
    console.log(error);
  }
};

const applyFiltersAndSort = (jobsList, filters = {}) => {
  let result = [...jobsList];

  // Apply search filter
  if (filters.searchTerm) {
    const search = filters.searchTerm.toLowerCase();
    result = result.filter(
      (job) =>
        job.company.toLowerCase().includes(search) ||
        job.role.toLowerCase().includes(search) ||
        job.location?.toLowerCase().includes(search)
    );
  }

  setFilteredJobs(result);
};

const handleFilterChange = (filters) => {
  applyFiltersAndSort(jobs, filters);
};

const getStatusColor = (status) => {
  switch (status) {
    case "Applied":
      return "bg-blue-500/20 text-blue-300";

    case "Interview":
      return "bg-yellow-500/20 text-yellow-300";

    case "Offer":
      return "bg-green-500/20 text-green-300";

    case "Rejected":
      return "bg-red-500/20 text-red-300";

    default:
      return "bg-gray-500/20 text-gray-300";
  }
};

  return (
    <div className="min-h-screen theme-bg theme-text overflow-hidden">
      <div className="absolute w-72 h-72 bg-blue-500 rounded-full blur-[120px] opacity-10 top-10 left-10"></div>
      <div className="absolute w-72 h-72 bg-purple-500 rounded-full blur-[120px] opacity-10 bottom-10 right-10"></div>

      <Navbar />

      <div className="relative z-10 p-8 pt-28">
        <div className="mb-10">
          <h1 className="text-5xl font-bold text-blue-500">
            Welcome back, {user?.name}
          </h1>

          <p className="theme-text-secondary mt-3 text-lg">
            Track applications, interviews, and insights.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div 
            onClick={() => {
              setFilterStatus(null);
              setShowAllJobs(true);
            }}
            className="theme-card backdrop-blur-xl border rounded-3xl p-6 shadow-xl cursor-pointer hover:border-blue-500/50 hover:scale-105 transition-all duration-300"
          >
            <h2 className="theme-text-secondary text-lg">Total Applications</h2>
            <p className="text-5xl font-bold text-blue-500 mt-4">
              {totalCount}
            </p>
            <p className="theme-text-secondary text-sm mt-2">Click to view all</p>
          </div>

          <div 
            onClick={() => {
              setFilterStatus("Interview");
              setShowAllJobs(true);
            }}
            className="theme-card backdrop-blur-xl border rounded-3xl p-6 shadow-xl cursor-pointer hover:border-yellow-500/50 hover:scale-105 transition-all duration-300"
          >
            <h2 className="theme-text-secondary text-lg">Interviews</h2>
            <p className="text-5xl font-bold text-green-400 mt-4">
              {interviewCount}
            </p>
            <p className="theme-text-secondary text-sm mt-2">Click to view all</p>
          </div>

          <div 
            onClick={() => {
              setFilterStatus("Rejected");
              setShowAllJobs(true);
            }}
            className="theme-card backdrop-blur-xl border rounded-3xl p-6 shadow-xl cursor-pointer hover:border-red-500/50 hover:scale-105 transition-all duration-300"
          >
            <h2 className="theme-text-secondary text-lg">Rejections</h2>
            <p className="text-5xl font-bold text-red-400 mt-4">
              {rejectedCount}
            </p>
            <p className="theme-text-secondary text-sm mt-2">Click to view all</p>
          </div>
        </div>

  <div className="mt-12">
  <h2 className="text-3xl font-bold mb-6">
    Application Analytics
  </h2>

  <div className="theme-card border backdrop-blur-xl rounded-3xl p-8 h-[400px]">
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          outerRadius={120}
          dataKey="value"
          label
        >
          {chartData.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={COLORS[index % COLORS.length]}
            />
          ))}
        </Pie>

        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  </div>
</div>


        <div className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold">Recent Applications</h2>

            <div className="flex gap-3">
              {/* View Toggle */}
              <div className="bg-white/10 backdrop-blur-xl rounded-xl p-1 flex gap-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                    viewMode === "grid"
                      ? "bg-blue-600 text-white"
                      : "theme-text-secondary hover:theme-text"
                  }`}
                >
                  Grid
                </button>
                <button
                  onClick={() => setViewMode("kanban")}
                  className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                    viewMode === "kanban"
                      ? "bg-blue-600 text-white"
                      : "theme-text-secondary hover:theme-text"
                  }`}
                >
                  Kanban
                </button>
              </div>

              <a
                href="/add-job"
                className="bg-blue-600 hover:bg-blue-700 px-5 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg shadow-blue-500/20"
              >
                + Add Job
              </a>
            </div>
          </div>

          {/* Search and Filter */}
          <SearchAndFilter
            onFilterChange={handleFilterChange}
            jobsCount={filteredJobs.length}
          />

          {/* Kanban View */}
          {viewMode === "kanban" ? (
            <KanbanBoard
              jobs={filteredJobs}
              onStatusChange={handleStatusChange}
              onDelete={handleDelete}
            />
          ) : (
            /* Grid View */
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredJobs.map((job) => (
              <div
                key={job._id}
                className="theme-card border backdrop-blur-xl rounded-3xl p-6 hover:border-blue-500/40 transition-all duration-300"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-2xl font-bold">{job.role}</h3>
                    <p className="theme-text-secondary mt-1">
                      {job.company} • {job.location}
                    </p>

                    {(job.resumeUsed || job.coverLetterUsed) && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {job.resumeUsed && (
                          <a
                            href={`${API_BASE}/uploads/${job.resumeUsed.filename}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full hover:bg-blue-500/30 transition-all"
                          >
                            Resume
                          </a>
                        )}
                        {job.coverLetterUsed && (
                          <a
                            href={`${API_BASE}/uploads/${job.coverLetterUsed.filename}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full hover:bg-purple-500/30 transition-all"
                          >
                            Cover Letter
                          </a>
                        )}
                      </div>
                    )}

                    {job.interviewDate && (
  <div className="mt-4 space-y-2">

    <p className="text-sm text-yellow-300">
      {job.interviewDate}
    </p>

    <p className="text-sm text-blue-300">
      {job.interviewRound}
    </p>

    <p className="text-sm text-gray-400">
      {job.interviewNotes}
    </p>

  </div>
)}
                  </div>

<select
  value={job.status}
  onChange={(e) =>
    handleStatusChange(
      job._id,
      e.target.value
    )
  }
  className={`${getStatusColor(
    job.status
  )} px-4 py-2 rounded-full text-sm border-none outline-none shrink-0`}
>
  <option value="Applied">
    Applied
  </option>

  <option value="Interview">
    Interview
  </option>

  <option value="Offer">
    Offer
  </option>

  <option value="Rejected">
    Rejected
  </option>
</select>
                </div>

<div className="mt-6 flex items-center justify-between">
  <p className="theme-text-secondary">
    {job.salary}
  </p>

  <div className="flex gap-4 items-center">
    <a
      href={job.jobLink}
      target="_blank"
      rel="noreferrer"
      className="text-blue-400 hover:text-blue-300 transition-all duration-300"
    >
      View Job →
    </a>

    <a
      href={`/edit-job/${job._id}`}
      className="text-yellow-400 hover:text-yellow-300 transition-all duration-300"
    >
      Edit
    </a>

<button
  onClick={() => handleDelete(job._id)}
  className="text-red-400 hover:text-red-300 transition-all duration-300"
>
  Delete
</button>
  </div>
</div>
              </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Sheet for All Jobs */}
      {showAllJobs && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end"
          onClick={() => setShowAllJobs(false)}
        >
          <div 
            className="bg-gradient-to-b from-gray-900 to-black dark:from-gray-900 dark:to-black border-t-2 border-blue-500/50 rounded-t-3xl w-full max-h-[85vh] overflow-hidden animate-slide-up"
            style={{ background: 'var(--sheet-bg)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 backdrop-blur-xl border-b border-[var(--border-color)] p-6" style={{ background: 'var(--sheet-header-bg)' }}>
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold text-blue-500">
                    {filterStatus ? `${filterStatus} Applications` : "All Applications"}
                  </h2>
                  <p className="theme-text-secondary mt-1">
                    Total: {filterStatus ? jobs.filter(job => job.status === filterStatus).length : jobs.length} applications
                  </p>
                </div>
                <button
                  onClick={() => setShowAllJobs(false)}
                  className="bg-white/10 hover:bg-red-500/20 theme-text hover:text-red-400 w-10 h-10 rounded-full transition-all duration-300 flex items-center justify-center"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(85vh-120px)]">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {(filterStatus ? jobs.filter(job => job.status === filterStatus) : jobs).map((job) => (
                  <div
                    key={job._id}
                    className="theme-card border backdrop-blur-xl rounded-3xl p-6 hover:border-blue-500/40 transition-all duration-300"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-2xl font-bold">{job.role}</h3>
                        <p className="theme-text-secondary mt-1">
                          {job.company} • {job.location}
                        </p>

                        {job.interviewDate && (
                          <div className="mt-4 space-y-2">
                            <p className="text-sm text-yellow-300">
                              {job.interviewDate}
                            </p>
                            <p className="text-sm text-blue-300">
                              {job.interviewRound}
                            </p>
                            <p className="text-sm text-gray-400">
                              {job.interviewNotes}
                            </p>
                          </div>
                        )}
                      </div>

                      <select
                        value={job.status}
                        onChange={(e) => handleStatusChange(job._id, e.target.value)}
                        className={`${getStatusColor(job.status)} px-4 py-2 rounded-full text-sm border-none outline-none shrink-0`}
                      >
                        <option value="Applied">Applied</option>
                        <option value="Interview">Interview</option>
                        <option value="Offer">Offer</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </div>

                    <div className="mt-6 flex items-center justify-between">
                      <p className="theme-text-secondary">{job.salary}</p>
                      <div className="flex gap-4 items-center">
                        <a
                          href={job.jobLink}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-400 hover:text-blue-300 transition-all duration-300"
                        >
                          View Job →
                        </a>
                        <a
  href={`/edit-job/${job._id}`}
  className="text-yellow-400 hover:text-yellow-300"
>
  Edit
</a>
                        <button
                          onClick={() => handleDelete(job._id)}
                          className="text-red-400 hover:text-red-300 transition-all duration-300"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;