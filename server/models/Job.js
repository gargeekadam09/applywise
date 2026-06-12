const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    company: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["Applied", "Interview", "Offer", "Rejected"],
      default: "Applied",
    },

    salary: {
      type: String,
    },

    location: {
      type: String,
    },

    jobLink: {
      type: String,
    },

    notes: {
      type: String,
    },

    interviewDate: {
  type: String,
},

interviewRound: {
  type: String,
},

interviewNotes: {
  type: String,
},

    resumeUsed: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Document",
    },

    coverLetterUsed: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Document",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Job", jobSchema);