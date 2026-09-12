/**
 * =========================================================================
 * ⚙️ ATP SCORE CALCULATION ENGINE
 * =========================================================================
 * 
 * 📌 NOTICE FOR PROFESSORS / STUDENTS / REVIEWERS:
 * The ATP calculation logic is completely isolated in this file.
 * To update this system with your college's specific official ATP formula,
 * simply edit the function `calculateATPScore(inputData)` and the weights/parameters below.
 * No changes are required in the frontend or database layers!
 * 
 * =========================================================================
 * ⚠️ REPLACE WITH OFFICIAL ATP FORMULA
 * =========================================================================
 */

/**
 * Standard Academic ATP Parameter Specifications
 * Can be customized according to syllabus / rubric requirements.
 */
const ATP_PARAMETER_SPECS = {
  attendance: {
    key: 'attendance',
    label: 'Attendance',
    min: 0,
    max: 100,
    unit: '%',
    weight: 0.10, // 10% weightage
    description: 'Lecture and tutorial attendance percentage',
  },
  theoryScore1: {
    key: 'theoryScore1',
    label: 'Theory Exam 1 (Mid-Term)',
    min: 0,
    max: 100,
    unit: 'marks',
    weight: 0.175, // 17.5% weightage
    description: 'First mid-semester theory examination score',
  },
  theoryScore2: {
    key: 'theoryScore2',
    label: 'Theory Exam 2 (End-Term/Internal)',
    min: 0,
    max: 100,
    unit: 'marks',
    weight: 0.175, // 17.5% weightage
    description: 'Second internal theory examination score',
  },
  practicalScore: {
    key: 'practicalScore',
    label: 'Practical / Lab Performance',
    min: 0,
    max: 100,
    unit: 'marks',
    weight: 0.25, // 25% weightage
    description: 'Laboratory experiments, viva, and code execution',
  },
  projectScore: {
    key: 'projectScore',
    label: 'Term Project / Capstone',
    min: 0,
    max: 100,
    unit: 'marks',
    weight: 0.20, // 20% weightage
    description: 'Project deliverable, documentation, and viva defense',
  },
  continuousAssessment: {
    key: 'continuousAssessment',
    label: 'Continuous Assessment & Quizzes',
    min: 0,
    max: 100,
    unit: 'marks',
    weight: 0.10, // 10% weightage
    description: 'Class tests, assignments, and weekly lab journals',
  },
};

/**
 * Grade evaluation rules based on 100-point scale
 */
const GRADE_THRESHOLDS = [
  { min: 90, grade: 'A+', status: 'Outstanding', color: 'emerald' },
  { min: 80, grade: 'A', status: 'Excellent', color: 'green' },
  { min: 70, grade: 'B', status: 'Very Good', color: 'blue' },
  { min: 60, grade: 'C', status: 'Good', color: 'indigo' },
  { min: 50, grade: 'D', status: 'Satisfactory (Pass)', color: 'amber' },
  { min: 0,  grade: 'F', status: 'Failed (Needs Improvement)', color: 'red' },
];

/**
 * Validates input parameters before calculation
 * @param {Object} inputData 
 * @returns {Array<string>} list of validation errors
 */
const validateATPInputs = (inputData = {}) => {
  const errors = [];

  for (const [key, spec] of Object.entries(ATP_PARAMETER_SPECS)) {
    const rawVal = inputData[key];
    if (rawVal === undefined || rawVal === null || rawVal === '') {
      errors.push(`${spec.label} is required.`);
      continue;
    }

    const numVal = Number(rawVal);
    if (Number.isNaN(numVal)) {
      errors.push(`${spec.label} must be a valid numeric value.`);
    } else if (numVal < spec.min || numVal > spec.max) {
      errors.push(`${spec.label} must be between ${spec.min} and ${spec.max} ${spec.unit}.`);
    }
  }

  return errors;
};

/**
 * =========================================================================
 * ⚙️ CORE CALCULATION FUNCTION: calculateATPScore(inputData)
 * =========================================================================
 * 
 * ⚠️ REPLACE WITH OFFICIAL ATP FORMULA IF GIVEN A SPECIFIC EQUATION
 * 
 * Current Formula:
 * ATP Score = (Attendance * 10%)
 *           + (Theory1 * 17.5%)
 *           + (Theory2 * 17.5%)
 *           + (Practical * 25%)
 *           + (Project * 20%)
 *           + (ContinuousAssessment * 10%)
 * 
 * @param {Object} inputData - { attendance, theoryScore1, theoryScore2, practicalScore, projectScore, continuousAssessment }
 * @returns {Object} Full breakdown, total score, percentage, grade, status
 */
const calculateATPScore = (inputData = {}) => {
  // 1. Sanitize and normalize input numbers
  const sanitizedValues = {};
  for (const key of Object.keys(ATP_PARAMETER_SPECS)) {
    const raw = inputData[key];
    sanitizedValues[key] = Math.max(0, Math.min(100, Number(raw) || 0));
  }

  // 2. Compute individual parameter contribution
  const breakdown = [];
  let rawWeightedSum = 0;

  for (const [key, spec] of Object.entries(ATP_PARAMETER_SPECS)) {
    const userValue = sanitizedValues[key];
    const maxPossibleContribution = spec.max * spec.weight; // e.g. 100 * 0.25 = 25
    const earnedContribution = Number(((userValue / spec.max) * maxPossibleContribution).toFixed(2));

    rawWeightedSum += earnedContribution;

    breakdown.push({
      key: spec.key,
      parameter: spec.label,
      enteredValue: userValue,
      unit: spec.unit,
      weightPercentage: Math.round(spec.weight * 100),
      maxContribution: maxPossibleContribution,
      earnedContribution,
      efficiencyPercentage: Math.round((userValue / spec.max) * 100),
      description: spec.description,
    });
  }

  // 3. Final ATP Score out of 100
  const finalScore = Number(rawWeightedSum.toFixed(2));
  const percentage = finalScore; // Since scale is out of 100

  // 4. Determine Grade and Academic Status
  const matchedGrade = GRADE_THRESHOLDS.find((threshold) => finalScore >= threshold.min) || GRADE_THRESHOLDS[GRADE_THRESHOLDS.length - 1];

  return {
    finalScore,
    maxScore: 100,
    percentage,
    grade: matchedGrade.grade,
    status: matchedGrade.status,
    badgeColor: matchedGrade.color,
    passed: finalScore >= 50,
    breakdown,
    formulaNote: 'REPLACE WITH OFFICIAL ATP FORMULA (Configurable via server/utils/atpCalculator.js)',
    calculatedAt: new Date().toISOString(),
  };
};

module.exports = {
  ATP_PARAMETER_SPECS,
  GRADE_THRESHOLDS,
  validateATPInputs,
  calculateATPScore,
};
