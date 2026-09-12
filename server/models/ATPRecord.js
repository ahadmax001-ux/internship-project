const mongoose = require('mongoose');

const ATPRecordSchema = new mongoose.Schema(
  {
    // Student & Project Information
    studentName: {
      type: String,
      required: [true, 'Student name is required'],
      trim: true,
      maxlength: [100, 'Student name cannot exceed 100 characters'],
    },
    rollNumber: {
      type: String,
      required: [true, 'Roll / Registration Number is required'],
      trim: true,
      maxlength: [50, 'Roll number cannot exceed 50 characters'],
    },
    department: {
      type: String,
      default: 'Computer Science & Engineering',
      trim: true,
    },
    academicYear: {
      type: String,
      default: '2025-2026',
      trim: true,
    },
    projectTitle: {
      type: String,
      default: 'General ATP Assessment',
      trim: true,
    },

    // Raw Input Parameters (values entered)
    parameters: {
      attendance: { type: Number, required: true, min: 0, max: 100 },
      theoryScore1: { type: Number, required: true, min: 0, max: 100 },
      theoryScore2: { type: Number, required: true, min: 0, max: 100 },
      practicalScore: { type: Number, required: true, min: 0, max: 100 },
      projectScore: { type: Number, required: true, min: 0, max: 100 },
      continuousAssessment: { type: Number, required: true, min: 0, max: 100 },
    },

    // Calculated ATP Outputs
    calculatedScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    percentage: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    grade: {
      type: String,
      required: true,
      enum: ['A+', 'A', 'B', 'C', 'D', 'F'],
    },
    status: {
      type: String,
      required: true,
    },
    passed: {
      type: Boolean,
      default: true,
    },

    // Detailed calculation breakdown
    breakdown: [
      {
        key: String,
        parameter: String,
        enteredValue: Number,
        unit: String,
        weightPercentage: Number,
        maxContribution: Number,
        earnedContribution: Number,
      },
    ],

    remarks: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt
  }
);

// Helpful indexes for fast history search and sorting
ATPRecordSchema.index({ rollNumber: 1 });
ATPRecordSchema.index({ studentName: 1 });
ATPRecordSchema.index({ createdAt: -1 });

module.exports = mongoose.model('ATPRecord', ATPRecordSchema);
