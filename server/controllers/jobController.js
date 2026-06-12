const Job = require("../models/Job");

const createJob = async (req, res) => {
  try {
    const {
      company,
      role,
      status,
      salary,
      location,
      jobLink,
      notes,
      resumeUsed,
      coverLetterUsed,
    } = req.body;

    const job = await Job.create({
      user: req.user._id,
      company,
      role,
      status,
      salary,
      location,
      jobLink,
      notes,
      resumeUsed: resumeUsed || null,
      coverLetterUsed: coverLetterUsed || null,
    });

    // Increment usedCount on linked documents
    const Document = require("../models/Document");
    if (resumeUsed) await Document.findByIdAndUpdate(resumeUsed, { $inc: { usedCount: 1 } });
    if (coverLetterUsed) await Document.findByIdAndUpdate(coverLetterUsed, { $inc: { usedCount: 1 } });

    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('resumeUsed', 'name filename originalName')
      .populate('coverLetterUsed', 'name filename originalName');

    if (!job) return res.status(404).json({ message: "Job not found" });
    if (job.user.toString() !== req.user._id.toString())
      return res.status(401).json({ message: "Not authorized" });

    res.status(200).json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find({
      user: req.user._id,
    })
    .populate('resumeUsed', 'name filename originalName')
    .populate('coverLetterUsed', 'name filename originalName');

    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (job.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const updatedJob = await Job.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.status(200).json(updatedJob);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (job.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    // Decrement usedCount on linked documents
    const Document = require("../models/Document");
    if (job.resumeUsed) await Document.findByIdAndUpdate(job.resumeUsed, { $inc: { usedCount: -1 } });
    if (job.coverLetterUsed) await Document.findByIdAndUpdate(job.coverLetterUsed, { $inc: { usedCount: -1 } });

    await job.deleteOne();

    res.status(200).json({ message: "Job deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports = {
  createJob,
  getJobById,
  getJobs,
  updateJob,
  deleteJob,
};