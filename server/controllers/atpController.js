const ATPRecord = require('../models/ATPRecord');
const {
  ATP_PARAMETER_SPECS,
  GRADE_THRESHOLDS,
  validateATPInputs,
  calculateATPScore,
} = require('../utils/atpCalculator');
const { getDBStatus } = require('../config/db');
const sampleData = require('../data/sampleData.json');

// In-Memory fallback store if MongoDB is offline on user's machine
let inMemoryStore = [...sampleData];

/**
 * @route   GET /api/atp/specs
 * @desc    Get configured ATP parameter specifications and formula weights
 * @access  Public
 */
const getParameterSpecs = (req, res) => {
  res.json({
    success: true,
    data: {
      parameters: ATP_PARAMETER_SPECS,
      gradeThresholds: GRADE_THRESHOLDS,
      isConfigurable: true,
      formulaNote: 'REPLACE WITH OFFICIAL ATP FORMULA (in server/utils/atpCalculator.js)',
    },
  });
};

/**
 * @route   POST /api/atp/calculate
 * @desc    Calculate ATP score preview without saving to database
 * @access  Public
 */
const calculateScorePreview = (req, res) => {
  try {
    const { parameters } = req.body;

    if (!parameters || typeof parameters !== 'object') {
      return res.status(400).json({
        success: false,
        message: 'Invalid request: "parameters" object is required.',
      });
    }

    const errors = validateATPInputs(parameters);
    if (errors.length > 0) {
      return res.status(422).json({
        success: false,
        message: 'Validation failed for one or more parameters.',
        errors,
      });
    }

    const calculationResult = calculateATPScore(parameters);

    return res.status(200).json({
      success: true,
      message: 'ATP score calculated successfully.',
      data: calculationResult,
    });
  } catch (error) {
    console.error('Error in calculateScorePreview:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error while calculating ATP score.',
      error: error.message,
    });
  }
};

/**
 * @route   POST /api/atp
 * @desc    Calculate ATP score and save new student record
 * @access  Public
 */
const createATPRecord = async (req, res) => {
  try {
    const {
      studentName,
      rollNumber,
      department,
      academicYear,
      projectTitle,
      remarks,
      parameters,
    } = req.body;

    // 1. Validate student metadata
    if (!studentName || !studentName.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Student name is required.',
      });
    }
    if (!rollNumber || !rollNumber.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Roll / Registration number is required.',
      });
    }

    // 2. Validate input parameters
    const errors = validateATPInputs(parameters);
    if (errors.length > 0) {
      return res.status(422).json({
        success: false,
        message: 'Validation failed for one or more parameters.',
        errors,
      });
    }

    // 3. Compute score using dedicated calculation function
    const calculation = calculateATPScore(parameters);

    const recordPayload = {
      studentName: studentName.trim(),
      rollNumber: rollNumber.trim().toUpperCase(),
      department: department?.trim() || 'Computer Science & Engineering',
      academicYear: academicYear?.trim() || '2025-2026',
      projectTitle: projectTitle?.trim() || 'General ATP Assessment',
      remarks: remarks?.trim() || '',
      parameters,
      calculatedScore: calculation.finalScore,
      percentage: calculation.percentage,
      grade: calculation.grade,
      status: calculation.status,
      passed: calculation.passed,
      breakdown: calculation.breakdown,
    };

    // 4. Save to MongoDB if connected, otherwise use in-memory store
    if (getDBStatus()) {
      const savedRecord = await ATPRecord.create(recordPayload);
      return res.status(201).json({
        success: true,
        message: 'ATP Record created and saved to MongoDB successfully.',
        data: savedRecord,
      });
    } else {
      const memoryRecord = {
        _id: 'rec-' + Date.now(),
        ...recordPayload,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      inMemoryStore.unshift(memoryRecord);

      return res.status(201).json({
        success: true,
        message: 'ATP Record calculated and saved (In-Memory Session Mode).',
        data: memoryRecord,
        storageNotice: 'MongoDB is offline; record saved in-memory.',
      });
    }
  } catch (error) {
    console.error('Error in createATPRecord:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create and save ATP record.',
      error: error.message,
    });
  }
};

/**
 * @route   GET /api/atp
 * @desc    Get all ATP score records with filtering and summary analytics
 * @access  Public
 */
const getAllATPRecords = async (req, res) => {
  try {
    const { search, grade } = req.query;

    let records = [];

    if (getDBStatus()) {
      const query = {};
      if (search) {
        query.$or = [
          { studentName: { $regex: search, $options: 'i' } },
          { rollNumber: { $regex: search, $options: 'i' } },
          { department: { $regex: search, $options: 'i' } },
          { projectTitle: { $regex: search, $options: 'i' } },
        ];
      }
      if (grade && grade !== 'ALL') {
        query.grade = grade;
      }

      records = await ATPRecord.find(query).sort({ createdAt: -1 });
    } else {
      // Filter from in-memory store
      records = [...inMemoryStore];

      if (search) {
        const s = search.toLowerCase();
        records = records.filter(
          (r) =>
            r.studentName.toLowerCase().includes(s) ||
            r.rollNumber.toLowerCase().includes(s) ||
            r.department.toLowerCase().includes(s) ||
            (r.projectTitle && r.projectTitle.toLowerCase().includes(s))
        );
      }

      if (grade && grade !== 'ALL') {
        records = records.filter((r) => r.grade === grade);
      }
    }

    // Compute Summary Statistics
    const totalRecords = records.length;
    const avgScore =
      totalRecords > 0
        ? Number((records.reduce((acc, r) => acc + r.calculatedScore, 0) / totalRecords).toFixed(2))
        : 0;
    const passedRecords = records.filter((r) => r.passed).length;
    const passRate = totalRecords > 0 ? Math.round((passedRecords / totalRecords) * 100) : 0;
    const highestScore =
      totalRecords > 0 ? Math.max(...records.map((r) => r.calculatedScore)) : 0;

    return res.status(200).json({
      success: true,
      data: records,
      stats: {
        totalRecords,
        avgScore,
        passRate,
        highestScore,
      },
    });
  } catch (error) {
    console.error('Error in getAllATPRecords:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve ATP score records.',
      error: error.message,
    });
  }
};

/**
 * @route   GET /api/atp/:id
 * @desc    Get single ATP record by ID
 * @access  Public
 */
const getATPRecordById = async (req, res) => {
  try {
    const { id } = req.params;
    let record = null;

    if (getDBStatus()) {
      record = await ATPRecord.findById(id);
    } else {
      record = inMemoryStore.find((r) => String(r._id) === String(id));
    }

    if (!record) {
      return res.status(404).json({
        success: false,
        message: `ATP Record with ID '${id}' was not found.`,
      });
    }

    return res.status(200).json({
      success: true,
      data: record,
    });
  } catch (error) {
    console.error('Error in getATPRecordById:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve record.',
      error: error.message,
    });
  }
};

/**
 * @route   DELETE /api/atp/:id
 * @desc    Delete single ATP record by ID
 * @access  Public
 */
const deleteATPRecord = async (req, res) => {
  try {
    const { id } = req.params;

    if (getDBStatus()) {
      const deleted = await ATPRecord.findByIdAndDelete(id);
      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: `Record with ID '${id}' not found.`,
        });
      }
    } else {
      const index = inMemoryStore.findIndex((r) => String(r._id) === String(id));
      if (index === -1) {
        return res.status(404).json({
          success: false,
          message: `Record with ID '${id}' not found.`,
        });
      }
      inMemoryStore.splice(index, 1);
    }

    return res.status(200).json({
      success: true,
      message: 'ATP Record deleted successfully.',
    });
  } catch (error) {
    console.error('Error in deleteATPRecord:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete record.',
      error: error.message,
    });
  }
};

module.exports = {
  getParameterSpecs,
  calculateScorePreview,
  createATPRecord,
  getAllATPRecords,
  getATPRecordById,
  deleteATPRecord,
};
