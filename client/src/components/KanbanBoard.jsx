import { useState } from "react";

function KanbanBoard({ jobs, onStatusChange, onDelete }) {
  const [draggedJob, setDraggedJob] = useState(null);

  const columns = {
    Applied: jobs.filter((job) => job.status === "Applied"),
    Interview: jobs.filter((job) => job.status === "Interview"),
    Offer: jobs.filter((job) => job.status === "Offer"),
    Rejected: jobs.filter((job) => job.status === "Rejected"),
  };

  const columnColors = {
    Applied: "border-blue-500/50 bg-blue-500/5",
    Interview: "border-yellow-500/50 bg-yellow-500/5",
    Offer: "border-green-500/50 bg-green-500/5",
    Rejected: "border-red-500/50 bg-red-500/5",
  };

  const handleDragStart = (e, job) => {
    setDraggedJob(job);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e, newStatus) => {
    e.preventDefault();
    if (draggedJob && draggedJob.status !== newStatus) {
      onStatusChange(draggedJob._id, newStatus);
    }
    setDraggedJob(null);
  };

  const handleDragEnd = () => {
    setDraggedJob(null);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {Object.entries(columns).map(([status, statusJobs]) => (
        <div
          key={status}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, status)}
          className={`border-2 ${columnColors[status]} backdrop-blur-xl rounded-3xl p-4 min-h-[600px] transition-all duration-300 hover:border-opacity-100`}
        >
          <div className="flex items-center justify-between mb-4 sticky top-0 backdrop-blur-xl py-2 rounded-xl px-2" style={{ background: 'var(--sheet-header-bg)' }}>
            <h3 className="text-xl font-bold theme-text">{status}</h3>
            <span className="bg-white/20 px-3 py-1 rounded-full text-sm theme-text font-semibold">
              {statusJobs.length}
            </span>
          </div>

          <div className="space-y-3">
            {statusJobs.map((job) => (
              <JobCard
                key={job._id}
                job={job}
                onDelete={onDelete}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                isDragging={draggedJob?._id === job._id}
              />
            ))}
            {statusJobs.length === 0 && (
              <div className="text-center text-gray-500 text-sm py-8">
                Drag jobs here
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function JobCard({ job, onDelete, onDragStart, onDragEnd, isDragging }) {
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, job)}
      onDragEnd={onDragEnd}
      className={`theme-card border rounded-2xl p-4 cursor-grab active:cursor-grabbing hover:border-blue-500/50 hover:scale-105 transition-all duration-300 ${
        isDragging ? "opacity-50 scale-95" : ""
      }`}
    >
      <h4 className="font-bold theme-text text-lg mb-1">{job.role}</h4>
      <p className="theme-text-secondary text-sm mb-3">
        {job.company} • {job.location}
      </p>

      {(job.resumeUsed || job.coverLetterUsed) && (
        <div className="flex flex-wrap gap-2 mb-3">
          {job.resumeUsed && (
            <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full">
              Resume
            </span>
          )}
          {job.coverLetterUsed && (
            <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded-full">
              Cover Letter
            </span>
          )}
        </div>
      )}

      {job.salary && (
        <p className="theme-text-secondary text-xs mb-3">{job.salary}</p>
      )}

      <div className="flex gap-2 mt-3 pt-3 border-t border-[var(--border-color)]">
        <a
          href={job.jobLink}
          target="_blank"
          rel="noreferrer"
          className="text-blue-400 hover:text-blue-300 text-xs transition-all flex-1 text-center py-1 bg-blue-500/10 rounded-lg hover:bg-blue-500/20"
          onClick={(e) => e.stopPropagation()}
        >
          View Job →
        </a>
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (window.confirm("Delete this job?")) {
              onDelete(job._id);
            }
          }}
          className="text-red-400 hover:text-red-300 text-xs transition-all px-3 py-1 bg-red-500/10 rounded-lg hover:bg-red-500/20"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default KanbanBoard;
