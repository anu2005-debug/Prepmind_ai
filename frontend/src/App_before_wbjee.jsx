import React, { useState, useEffect } from "react";
import { jeeMainPhysicsUnitsQuestions } from "./jeeMainPhysicsBank";
import "./App.css";
import MyCourses from "./MyCourses";

// ==================================================
// SERVER-SIDE PRACTICE (JEE Main Physics, Chemistry, Mathematics)
// Questions come from the backend (30 per chapter); answers are
// graded on the server. Other exams still use the local bank.
// ==================================================

const PRACTICE_API_BASE = "http://127.0.0.1:8000";
const SERVER_PRACTICE_SUBJECTS = ["Physics", "Chemistry", "Mathematics"];
const OPTION_LETTERS = "ABCDEFGH";

const usesServerPractice = (exam, subject) =>
  String(exam || "").startsWith("JEE") && SERVER_PRACTICE_SUBJECTS.includes(subject);

// The page stores the chosen option TEXT; the server expects letters (A, B, ...).
const toServerAnswer = (question, answer) => {
  if (Array.isArray(answer)) {
    return answer
      .map((item) => OPTION_LETTERS[(question.options || []).indexOf(item)])
      .filter(Boolean)
      .sort()
      .join(",");
  }
  if (question.type === "Numerical") {
    return String(answer).trim();
  }
  const index = (question.options || []).indexOf(answer);
  return index >= 0 ? OPTION_LETTERS[index] : null;
};

// Turn the server's correct answer (letters) back into option text.
const fromServerAnswer = (question, correct) => {
  if (question.type === "Numerical") {
    return String(correct);
  }
  const options = question.options || [];
  const picked = String(correct)
    .split(",")
    .map((letter) => options[OPTION_LETTERS.indexOf(letter.trim())])
    .filter((value) => value !== undefined);
  return question.type === "Multiple Correct" ? picked : picked[0];
};

// ==================================================
// API ERROR HELPER
// ==================================================

const getApiErrorMessage = (data, fallbackMessage) => {
  if (!data) {
    return fallbackMessage;
  }

  if (typeof data.detail === "string") {
    return data.detail;
  }

  if (Array.isArray(data.detail)) {
    return data.detail
      .map((item) => {
        if (typeof item === "string") return item;
        return item?.msg || JSON.stringify(item);
      })
      .join(", ");
  }

  if (typeof data.message === "string") {
    return data.message;
  }

  if (typeof data === "string") {
    return data;
  }

  return fallbackMessage;
};

// ==================================================
// PRACTICE QUESTION BANK
// 30 QUESTIONS
// ==================================================

const questionChapterMap = {
  1: "Kinematics", 2: "Laws of Motion", 3: "Laws of Motion", 4: "Laws of Motion",
  5: "Laws of Motion", 6: "Units and Measurements", 7: "Kinematics",
  8: "Work, Energy and Power", 9: "Units and Measurements", 10: "Laws of Motion",
  11: "Limits, Continuity and Differentiability", 12: "Trigonometry",
  13: "Integral Calculus", 14: "Sets, Relations and Functions",
  15: "Complex Numbers and Quadratic Equations", 16: "Sets, Relations and Functions",
  17: "Algebra", 18: "Matrices and Determinants", 19: "Trigonometry", 20: "Algebra",
  21: "Classification of Elements and Periodicity", 22: "Equilibrium",
  23: "Classification of Elements and Periodicity", 24: "Some Basic Concepts of Chemistry",
  25: "Atomic Structure", 26: "States of Matter", 27: "Some Basic Concepts of Chemistry",
  28: "Environmental Chemistry", 29: "Equilibrium", 30: "Atomic Structure",
};

const practiceQuestionBank = [
  // ==================================================
  // PHYSICS - 10 QUESTIONS
  // ==================================================

  {
    id: 1,
    subject: "Physics",
    type: "MCQ",
    question:
      "A body is moving with a velocity of 10 m/s. If its velocity becomes 20 m/s in 5 seconds, what is its acceleration?",
    options: [
      "1 m/s²",
      "2 m/s²",
      "4 m/s²",
      "5 m/s²",
    ],
    answer: "2 m/s²",
  },

  {
    id: 2,
    subject: "Physics",
    type: "MCQ",
    question:
      "According to Newton's second law of motion, force is equal to:",
    options: [
      "mass × velocity",
      "mass × acceleration",
      "mass ÷ acceleration",
      "velocity × acceleration",
    ],
    answer: "mass × acceleration",
  },

  {
    id: 3,
    subject: "Physics",
    type: "MCQ",
    question:
      "A 5 kg object is acted upon by a force of 20 N. What is its acceleration?",
    options: [
      "2 m/s²",
      "4 m/s²",
      "5 m/s²",
      "10 m/s²",
    ],
    answer: "4 m/s²",
  },

  {
    id: 4,
    subject: "Physics",
    type: "MCQ",
    question:
      "The SI unit of momentum is:",
    options: [
      "Newton",
      "Joule",
      "kg m/s",
      "kg m/s²",
    ],
    answer: "kg m/s",
  },

  {
    id: 5,
    subject: "Physics",
    type: "MCQ",
    question:
      "If the net force acting on an object is zero, the object:",
    options: [
      "Must be at rest",
      "Must be accelerating",
      "May be at rest or move with constant velocity",
      "Must move in a circle",
    ],
    answer:
      "May be at rest or move with constant velocity",
  },

  {
    id: 6,
    subject: "Physics",
    type: "Multiple Correct",
    question:
      "Which of the following are vector quantities?",
    options: [
      "Velocity",
      "Acceleration",
      "Force",
      "Speed",
    ],
    answer: [
      "Velocity",
      "Acceleration",
      "Force",
    ],
  },

  {
    id: 7,
    subject: "Physics",
    type: "Numerical",
    question:
      "A car starts from rest and accelerates at 2 m/s² for 5 seconds. Find its final velocity in m/s.",
    options: [],
    answer: "10",
  },

  {
    id: 8,
    subject: "Physics",
    type: "MCQ",
    question:
      "The work done by a force is zero when the angle between force and displacement is:",
    options: [
      "0°",
      "45°",
      "90°",
      "180°",
    ],
    answer: "90°",
  },

  {
    id: 9,
    subject: "Physics",
    type: "Multiple Correct",
    question:
      "Which of the following are fundamental SI quantities?",
    options: [
      "Length",
      "Mass",
      "Time",
      "Velocity",
    ],
    answer: [
      "Length",
      "Mass",
      "Time",
    ],
  },

  {
    id: 10,
    subject: "Physics",
    type: "Numerical",
    question:
      "A force of 10 N acts on an object and produces an acceleration of 2 m/s². Find the mass of the object in kg.",
    options: [],
    answer: "5",
  },

  // ==================================================
  // MATHEMATICS - 10 QUESTIONS
  // ==================================================

  {
    id: 11,
    subject: "Mathematics",
    type: "MCQ",
    question:
      "What is the derivative of x² with respect to x?",
    options: [
      "x",
      "2x",
      "x²",
      "2",
    ],
    answer: "2x",
  },

  {
    id: 12,
    subject: "Mathematics",
    type: "MCQ",
    question:
      "What is the value of sin²θ + cos²θ?",
    options: [
      "0",
      "1",
      "2",
      "sin θ",
    ],
    answer: "1",
  },

  {
    id: 13,
    subject: "Mathematics",
    type: "MCQ",
    question:
      "What is the integral of 2x dx?",
    options: [
      "x",
      "x² + C",
      "2x² + C",
      "x²/2 + C",
    ],
    answer: "x² + C",
  },

  {
    id: 14,
    subject: "Mathematics",
    type: "MCQ",
    question:
      "If f(x) = x + 5, what is f(3)?",
    options: [
      "5",
      "7",
      "8",
      "10",
    ],
    answer: "8",
  },

  {
    id: 15,
    subject: "Mathematics",
    type: "MCQ",
    question:
      "The roots of x² - 5x + 6 = 0 are:",
    options: [
      "1 and 6",
      "2 and 3",
      "-2 and -3",
      "3 and 4",
    ],
    answer: "2 and 3",
  },

  {
    id: 16,
    subject: "Mathematics",
    type: "Multiple Correct",
    question:
      "Which of the following functions are increasing for all real x?",
    options: [
      "f(x) = x",
      "f(x) = 2x + 1",
      "f(x) = 3x - 5",
      "f(x) = -x",
    ],
    answer: [
      "f(x) = x",
      "f(x) = 2x + 1",
      "f(x) = 3x - 5",
    ],
  },

  {
    id: 17,
    subject: "Mathematics",
    type: "Numerical",
    question:
      "Find the value of 5² - 3².",
    options: [],
    answer: "16",
  },

  {
    id: 18,
    subject: "Mathematics",
    type: "MCQ",
    question:
      "The determinant of the identity matrix of order 2 is:",
    options: [
      "0",
      "1",
      "2",
      "-1",
    ],
    answer: "1",
  },

  {
    id: 19,
    subject: "Mathematics",
    type: "Multiple Correct",
    question:
      "Which of the following are trigonometric identities?",
    options: [
      "sin²x + cos²x = 1",
      "1 + tan²x = sec²x",
      "1 + cot²x = cosec²x",
      "sin x + cos x = 1",
    ],
    answer: [
      "sin²x + cos²x = 1",
      "1 + tan²x = sec²x",
      "1 + cot²x = cosec²x",
    ],
  },

  {
    id: 20,
    subject: "Mathematics",
    type: "Numerical",
    question:
      "If x + 7 = 15, find x.",
    options: [],
    answer: "8",
  },

  // ==================================================
  // CHEMISTRY - 10 QUESTIONS
  // ==================================================

  {
    id: 21,
    subject: "Chemistry",
    type: "MCQ",
    question:
      "What is the atomic number of Carbon?",
    options: [
      "4",
      "6",
      "8",
      "12",
    ],
    answer: "6",
  },

  {
    id: 22,
    subject: "Chemistry",
    type: "MCQ",
    question:
      "The pH of a neutral solution at 25°C is:",
    options: [
      "0",
      "5",
      "7",
      "14",
    ],
    answer: "7",
  },

  {
    id: 23,
    subject: "Chemistry",
    type: "MCQ",
    question:
      "Which of the following is a noble gas?",
    options: [
      "Oxygen",
      "Nitrogen",
      "Neon",
      "Hydrogen",
    ],
    answer: "Neon",
  },

  {
    id: 24,
    subject: "Chemistry",
    type: "MCQ",
    question:
      "The chemical formula of water is:",
    options: [
      "CO₂",
      "H₂O",
      "O₂",
      "H₂O₂",
    ],
    answer: "H₂O",
  },

  {
    id: 25,
    subject: "Chemistry",
    type: "MCQ",
    question:
      "Which particle has a negative charge?",
    options: [
      "Proton",
      "Neutron",
      "Electron",
      "Nucleus",
    ],
    answer: "Electron",
  },

  {
    id: 26,
    subject: "Chemistry",
    type: "Multiple Correct",
    question:
      "Which of the following are states of matter?",
    options: [
      "Solid",
      "Liquid",
      "Gas",
      "Energy",
    ],
    answer: [
      "Solid",
      "Liquid",
      "Gas",
    ],
  },

  {
    id: 27,
    subject: "Chemistry",
    type: "Numerical",
    question:
      "How many hydrogen atoms are present in one molecule of H₂O?",
    options: [],
    answer: "2",
  },

  {
    id: 28,
    subject: "Chemistry",
    type: "MCQ",
    question:
      "Which gas is most abundant in Earth's atmosphere?",
    options: [
      "Oxygen",
      "Nitrogen",
      "Carbon dioxide",
      "Hydrogen",
    ],
    answer: "Nitrogen",
  },

  {
    id: 29,
    subject: "Chemistry",
    type: "Multiple Correct",
    question:
      "Which of the following are acids?",
    options: [
      "HCl",
      "H₂SO₄",
      "HNO₃",
      "NaOH",
    ],
    answer: [
      "HCl",
      "H₂SO₄",
      "HNO₃",
    ],
  },

  {
    id: 30,
    subject: "Chemistry",
    type: "Numerical",
    question:
      "What is the atomic number of Oxygen?",
    options: [],
    answer: "8",
  },
].map((question) => ({
  ...question,
  chapter: questionChapterMap[question.id] || "General",
}));

// Additional starter questions so every subject shown for BITSAT, NEET and CUET
// can actually be opened in Practice. These can be expanded with full exam banks.
practiceQuestionBank.push(
  { id: 31, subject: "Biology", chapter: "The Living World", type: "MCQ", question: "The basic unit of classification in taxonomy is:", options: ["Genus", "Species", "Family", "Order"], answer: "Species" },
  { id: 32, subject: "Biology", chapter: "Cell: The Unit of Life", type: "MCQ", question: "Which organelle is the main site of aerobic respiration in eukaryotic cells?", options: ["Ribosome", "Mitochondrion", "Golgi apparatus", "Lysosome"], answer: "Mitochondrion" },
  { id: 33, subject: "English", chapter: "Grammar", type: "MCQ", question: "Choose the grammatically correct sentence:", options: ["She go to school daily.", "She goes to school daily.", "She going to school daily.", "She gone to school daily."], answer: "She goes to school daily." },
  { id: 34, subject: "English", chapter: "Vocabulary", type: "MCQ", question: "Choose the synonym of 'abundant':", options: ["Scarce", "Plentiful", "Rare", "Limited"], answer: "Plentiful" },
  { id: 35, subject: "Logical Reasoning", chapter: "Pattern Recognition", type: "MCQ", question: "Find the next number: 2, 4, 8, 16, __", options: ["20", "24", "30", "32"], answer: "32" },
  { id: 36, subject: "Logical Reasoning", chapter: "Logical Deduction", type: "MCQ", question: "All roses are flowers. Some flowers fade quickly. Which statement must be true?", options: ["All roses fade quickly", "Some roses fade quickly", "All roses are flowers", "No flowers are roses"], answer: "All roses are flowers" },
  { id: 37, subject: "General Test", chapter: "Numerical Ability", type: "MCQ", question: "A product costs ₹800 and is discounted by 10%. What is the sale price?", options: ["₹700", "₹720", "₹740", "₹780"], answer: "₹720" },
  { id: 38, subject: "General Test", chapter: "Quantitative Reasoning", type: "MCQ", question: "What is the average of 4, 6, 8 and 10?", options: ["6", "7", "8", "9"], answer: "7" },
  { id: 39, subject: "Accountancy", chapter: "Partnership Accounts", type: "MCQ", question: "The partnership agreement is also known as:", options: ["Memorandum", "Articles", "Partnership deed", "Prospectus"], answer: "Partnership deed" },
  { id: 40, subject: "Accountancy", chapter: "Company Accounts", type: "MCQ", question: "Shares issued above their face value are issued at:", options: ["Discount", "Premium", "Par", "Loss"], answer: "Premium" },
  { id: 41, subject: "Economics", chapter: "National Income", type: "MCQ", question: "GDP measures the value of final goods and services produced:", options: ["By citizens anywhere", "Within a country's domestic territory", "Only by government", "Only for export"], answer: "Within a country's domestic territory" },
  { id: 42, subject: "Economics", chapter: "Money and Banking", type: "MCQ", question: "Which institution is the central bank of India?", options: ["SBI", "RBI", "NABARD", "SEBI"], answer: "RBI" },
  { id: 43, subject: "History", chapter: "Modern Indian History", type: "MCQ", question: "The Quit India Movement was launched in:", options: ["1919", "1930", "1942", "1947"], answer: "1942" },
  { id: 44, subject: "History", chapter: "National Movement", type: "MCQ", question: "The Dandi March was associated with the:", options: ["Non-Cooperation Movement", "Civil Disobedience Movement", "Quit India Movement", "Swadeshi Movement"], answer: "Civil Disobedience Movement" },
  { id: 45, subject: "Geography", chapter: "Resources", type: "MCQ", question: "Which of the following is a renewable resource?", options: ["Coal", "Petroleum", "Solar energy", "Natural gas"], answer: "Solar energy" },
  { id: 46, subject: "Geography", chapter: "Human Geography", type: "MCQ", question: "Population density is generally expressed as:", options: ["People per unit area", "Births per year", "Deaths per year", "People per household"], answer: "People per unit area" },
  { id: 47, subject: "Political Science", chapter: "Indian Constitution", type: "MCQ", question: "The Constitution of India came into effect on:", options: ["15 August 1947", "26 January 1950", "26 November 1949", "2 October 1950"], answer: "26 January 1950" },
  { id: 48, subject: "Political Science", chapter: "International Relations", type: "MCQ", question: "The United Nations was established in:", options: ["1919", "1945", "1950", "1965"], answer: "1945" },
  { id: 49, subject: "Business Studies", chapter: "Principles of Management", type: "MCQ", question: "Who is associated with the 14 principles of management?", options: ["F. W. Taylor", "Henri Fayol", "Peter Drucker", "Elton Mayo"], answer: "Henri Fayol" },
  { id: 50, subject: "Business Studies", chapter: "Marketing Management", type: "MCQ", question: "The traditional marketing mix is commonly represented by:", options: ["2 Ps", "3 Ps", "4 Ps", "7 Cs"], answer: "4 Ps" },
  { id: 51, subject: "Psychology", chapter: "Self and Personality", type: "MCQ", question: "The term 'personality' broadly refers to:", options: ["A person's stable pattern of thoughts, feelings and behaviour", "Only physical appearance", "Only intelligence", "A temporary mood"], answer: "A person's stable pattern of thoughts, feelings and behaviour" },
  { id: 52, subject: "Psychology", chapter: "Meeting Life Challenges", type: "MCQ", question: "A commonly used term for the body's response to demands or pressure is:", options: ["Stress", "Memory", "Perception", "Sensation"], answer: "Stress" },
  { id: 53, subject: "Sociology", chapter: "Indian Society", type: "MCQ", question: "A social institution that is commonly considered a primary agent of socialisation is:", options: ["Family", "Stock exchange", "Airport", "Factory"], answer: "Family" },
  { id: 54, subject: "Sociology", chapter: "Social Institutions", type: "MCQ", question: "A social norm is best described as:", options: ["A shared rule or expectation for behaviour", "A biological trait", "A private possession", "A geographical boundary"], answer: "A shared rule or expectation for behaviour" }
);

// Exam-wise subject and chapter catalog used by Learning and Practice.
// Add 30 JEE Main Physics questions for Units and Measurements
practiceQuestionBank.push(...jeeMainPhysicsUnitsQuestions);
// These are starter chapter lists; verify against the latest official exam syllabus before production.
const examCatalog = {
  "JEE Main": {
    Physics: ["Units and Measurements", "Kinematics", "Laws of Motion", "Work, Energy and Power", "Rotational Motion", "Gravitation", "Properties of Solids and Liquids", "Thermodynamics", "Kinetic Theory of Gases", "Oscillations and Waves", "Electrostatics", "Current Electricity", "Magnetic Effects of Current and Magnetism", "Electromagnetic Induction and AC", "Electromagnetic Waves", "Optics", "Dual Nature of Matter and Radiation", "Atoms and Nuclei", "Electronic Devices"],
    Chemistry: ["Some Basic Concepts of Chemistry", "Atomic Structure", "Chemical Bonding and Molecular Structure", "Chemical Thermodynamics", "Solutions", "Equilibrium", "Redox Reactions and Electrochemistry", "Chemical Kinetics", "Classification of Elements and Periodicity", "p-Block Elements", "d- and f-Block Elements", "Coordination Compounds", "Purification and Characterisation of Organic Compounds", "Some Basic Principles of Organic Chemistry", "Hydrocarbons", "Organic Compounds Containing Halogens", "Organic Compounds Containing Oxygen", "Organic Compounds Containing Nitrogen", "Biomolecules", "Principles Related to Practical Chemistry"],
    Mathematics: ["Sets, Relations and Functions", "Complex Numbers and Quadratic Equations", "Matrices and Determinants", "Permutations and Combinations", "Binomial Theorem", "Sequences and Series", "Limits, Continuity and Differentiability", "Integral Calculus", "Differential Equations", "Coordinate Geometry", "Three-Dimensional Geometry", "Vector Algebra", "Statistics and Probability", "Trigonometry"],
  },
  "JEE Advanced": {
    Physics: ["General Physics and Measurement", "Kinematics", "Laws of Motion", "Work, Energy and Power", "Rotational Motion", "Gravitation", "Mechanical Properties of Matter", "Thermal Physics", "Oscillations and Waves", "Electrostatics", "Current Electricity", "Magnetism", "Electromagnetic Induction", "Alternating Current", "Electromagnetic Waves", "Optics", "Modern Physics"],
    Chemistry: ["Basic Concepts", "Atomic Structure", "Chemical Bonding", "States of Matter", "Chemical Thermodynamics", "Chemical and Ionic Equilibrium", "Redox Reactions", "Electrochemistry", "Chemical Kinetics", "Periodic Properties", "Hydrogen and s-Block Elements", "p-Block Elements", "d- and f-Block Elements", "Coordination Compounds", "Environmental Chemistry", "Basic Organic Chemistry", "Hydrocarbons", "Organic Compounds with Functional Groups", "Biomolecules", "Chemistry in Everyday Life"],
    Mathematics: ["Sets, Relations and Functions", "Algebra", "Complex Numbers", "Matrices and Determinants", "Permutations and Combinations", "Binomial Theorem", "Sequences and Series", "Trigonometry", "Analytical Geometry", "Differential Calculus", "Integral Calculus", "Differential Equations", "Vectors", "Three-Dimensional Geometry", "Probability"],
  },
  "WBJEE": {
    Physics: ["Physical World, Units and Measurements", "Kinematics", "Laws of Motion", "Work, Energy and Power", "Gravitation", "Properties of Matter", "Heat and Thermodynamics", "Oscillations and Waves", "Electrostatics", "Current Electricity", "Magnetism", "Electromagnetic Induction and AC", "Electromagnetic Waves", "Optics", "Modern Physics", "Semiconductor Electronics"],
    Chemistry: ["Atomic Structure", "Chemical Bonding", "Chemical Energetics", "Chemical Equilibrium", "Redox Reactions", "States of Matter", "Solutions", "Electrochemistry", "Chemical Kinetics", "Periodic Table", "s-, p-, d- and f-Block Elements", "Coordination Compounds", "Organic Chemistry Basics", "Hydrocarbons", "Organic Functional Groups", "Polymers and Biomolecules"],
    Mathematics: ["Algebra", "Complex Numbers", "Quadratic Equations", "Matrices and Determinants", "Permutation and Combination", "Principle of Mathematical Induction", "Binomial Theorem", "Sequences and Series", "Logarithms", "Trigonometry", "Coordinate Geometry", "Differential Calculus", "Integral Calculus", "Differential Equations", "Vectors", "Three-Dimensional Geometry", "Probability"],
  },
  "NEET UG": {
    Physics: ["Physics and Measurement", "Kinematics", "Laws of Motion", "Work, Energy and Power", "Rotational Motion", "Gravitation", "Properties of Solids and Liquids", "Thermodynamics", "Kinetic Theory", "Oscillations and Waves", "Electrostatics", "Current Electricity", "Magnetic Effects of Current", "Electromagnetic Induction and AC", "Electromagnetic Waves", "Optics", "Dual Nature of Matter", "Atoms and Nuclei", "Electronic Devices"],
    Chemistry: ["Some Basic Concepts", "Atomic Structure", "Chemical Bonding", "Chemical Thermodynamics", "Solutions", "Equilibrium", "Redox Reactions and Electrochemistry", "Chemical Kinetics", "Periodicity", "p-Block Elements", "d- and f-Block Elements", "Coordination Compounds", "Organic Chemistry Basics", "Hydrocarbons", "Organic Compounds with Halogens", "Organic Compounds with Oxygen", "Organic Compounds with Nitrogen", "Biomolecules", "Practical Chemistry"],
    Biology: ["The Living World", "Biological Classification", "Plant Kingdom", "Animal Kingdom", "Morphology of Flowering Plants", "Anatomy of Flowering Plants", "Structural Organisation in Animals", "Cell: The Unit of Life", "Biomolecules", "Cell Cycle and Cell Division", "Photosynthesis in Higher Plants", "Respiration in Plants", "Plant Growth and Development", "Breathing and Exchange of Gases", "Body Fluids and Circulation", "Excretory Products and their Elimination", "Locomotion and Movement", "Neural Control and Coordination", "Chemical Coordination and Integration", "Sexual Reproduction in Flowering Plants", "Human Reproduction", "Reproductive Health", "Principles of Inheritance and Variation", "Molecular Basis of Inheritance", "Evolution", "Human Health and Disease", "Microbes in Human Welfare", "Biotechnology: Principles and Processes", "Biotechnology and its Applications", "Organisms and Populations", "Ecosystem", "Biodiversity and Conservation"],
  },
  "BITSAT": {
    Physics: ["Units and Measurements", "Kinematics", "Newton's Laws", "Work, Energy and Power", "Rotational Motion", "Gravitation", "Properties of Matter", "Heat and Thermodynamics", "Oscillations and Waves", "Electrostatics", "Current Electricity", "Magnetism", "Electromagnetic Induction", "Optics", "Modern Physics", "Semiconductors"],
    Chemistry: ["Atomic Structure", "Chemical Bonding", "States of Matter", "Thermodynamics", "Chemical Equilibrium", "Electrochemistry", "Chemical Kinetics", "Periodic Properties", "Hydrogen and s-Block", "p-, d- and f-Block", "Coordination Compounds", "Organic Chemistry Basics", "Hydrocarbons", "Functional Groups", "Biomolecules"],
    Mathematics: ["Algebra", "Trigonometry", "Coordinate Geometry", "Differential Calculus", "Integral Calculus", "Differential Equations", "Vectors", "Three-Dimensional Geometry", "Probability", "Statistics", "Linear Programming"],
    English: ["Grammar", "Vocabulary", "Reading Comprehension", "Composition", "Verbal Ability"],
    "Logical Reasoning": ["Verbal Reasoning", "Non-verbal Reasoning", "Analytical Reasoning", "Pattern Recognition", "Logical Deduction"],
  },
  "CUET UG": {
    English: ["Reading Comprehension", "Verbal Ability", "Vocabulary", "Grammar", "Literary Aptitude"],
    "General Test": ["General Knowledge", "Current Affairs", "Numerical Ability", "Quantitative Reasoning", "Logical and Analytical Reasoning"],
    Physics: ["Electrostatics", "Current Electricity", "Magnetism", "Electromagnetic Induction", "Optics", "Dual Nature", "Atoms and Nuclei", "Electronic Devices"],
    Chemistry: ["Solutions", "Electrochemistry", "Chemical Kinetics", "d- and f-Block Elements", "Coordination Compounds", "Haloalkanes and Haloarenes", "Alcohols, Phenols and Ethers", "Aldehydes, Ketones and Carboxylic Acids", "Amines", "Biomolecules"],
    Mathematics: ["Relations and Functions", "Matrices", "Determinants", "Continuity and Differentiability", "Applications of Derivatives", "Integrals", "Differential Equations", "Vectors", "Three-Dimensional Geometry", "Probability"],
    Biology: ["Reproduction", "Genetics and Evolution", "Biology and Human Welfare", "Biotechnology", "Ecology and Environment"],
    Accountancy: ["Accounting for Not-for-Profit Organisations", "Partnership Accounts", "Company Accounts", "Analysis of Financial Statements", "Cash Flow Statement"],
    Economics: ["Microeconomics", "Macroeconomics", "National Income", "Money and Banking", "Government Budget", "Balance of Payments", "Indian Economic Development"],
    History: ["Ancient Indian History", "Medieval Indian History", "Modern Indian History", "Colonialism", "National Movement"],
    Geography: ["Human Geography", "People and Economy", "Resources", "Transport and Communication", "Human Settlements"],
    "Political Science": ["Contemporary World Politics", "Politics in India Since Independence", "International Relations", "Indian Constitution"],
    "Business Studies": ["Nature and Significance of Management", "Principles of Management", "Business Environment", "Planning and Organising", "Staffing and Directing", "Financial Management", "Marketing Management"],
    Psychology: ["Variations in Psychological Attributes", "Self and Personality", "Meeting Life Challenges", "Psychological Disorders", "Therapeutic Approaches", "Social Influence and Group Processes"],
    Sociology: ["Indian Society", "Social Institutions", "Social Inequality", "Cultural Diversity", "Social Change and Development"],
  },
};

const getSubjectsForExam = (exam) => Object.keys(examCatalog[exam] || examCatalog["JEE Main"]);
const getChaptersForExam = (exam, subject) => (examCatalog[exam] || examCatalog["JEE Main"])[subject] || [];
// Chapter-wise Chemistry practice bank. Each chapter has its own questions;
// aliases handle small syllabus-name differences between JEE, NEET, WBJEE and BITSAT.
const chemistryChapterQuestionSets = [
  { keys: ["basic concepts", "some basic concepts", "mole concept", "basic concepts of chemistry"], chapter: "Some Basic Concepts of Chemistry", questions: [
    ["How many moles are present in 18 g of water? (Molar mass = 18 g mol⁻¹)", ["0.5 mol", "1 mol", "2 mol", "18 mol"], "1 mol"],
    ["The number of molecules in 0.5 mol of a substance is:", ["Nₐ", "0.5 Nₐ", "2 Nₐ", "Nₐ/2"], "0.5 Nₐ"]
  ]},
  { keys: ["atomic structure", "atomic"], chapter: "Atomic Structure", questions: [
    ["The maximum number of electrons in the shell with n = 3 is:", ["8", "18", "32", "9"], "18"],
    ["Which quantum number determines the shape of an orbital?", ["Principal", "Azimuthal", "Magnetic", "Spin"], "Azimuthal"]
  ]},
  { keys: ["chemical bonding", "molecular structure", "bonding"], chapter: "Chemical Bonding", questions: [
    ["The shape of a methane (CH₄) molecule is:", ["Linear", "Trigonal planar", "Tetrahedral", "Pyramidal"], "Tetrahedral"],
    ["Which bond is formed by sharing of electron pairs?", ["Ionic", "Covalent", "Metallic", "Hydrogen"], "Covalent"]
  ]},
  { keys: ["thermodynamics", "thermodynamic", "chemical energetics", "thermal"], chapter: "Chemical Thermodynamics", questions: [
    ["For an exothermic reaction, the enthalpy change (ΔH) is:", ["Positive", "Negative", "Zero", "Always infinite"], "Negative"],
    ["The SI unit of entropy is:", ["J mol⁻¹ K⁻¹", "J mol⁻¹", "K mol⁻¹", "Pa"], "J mol⁻¹ K⁻¹"]
  ]},
  { keys: ["solution", "solutions"], chapter: "Solutions", questions: [
    ["Molarity is defined as moles of solute per:", ["kg of solvent", "litre of solution", "litre of solvent", "gram of solution"], "litre of solution"],
    ["Which concentration term is independent of temperature?", ["Molarity", "Normality", "Molality", "Volume percent"], "Molality"]
  ]},
  { keys: ["equilibrium"], chapter: "Equilibrium", questions: [
    ["For a system at equilibrium, the forward and reverse reaction rates are:", ["Both zero", "Equal", "Unequal", "Unrelated"], "Equal"],
    ["At 25°C, the pH of a neutral aqueous solution is:", ["1", "5", "7", "14"], "7"]
  ]},
  { keys: ["redox", "electrochemistry"], chapter: "Redox Reactions and Electrochemistry", questions: [
    ["Oxidation is defined as:", ["Gain of electrons", "Loss of electrons", "Gain of neutrons", "Loss of protons"], "Loss of electrons"],
    ["The SI unit of electric charge is:", ["Volt", "Ohm", "Coulomb", "Ampere"], "Coulomb"]
  ]},
  { keys: ["chemical kinetics", "kinetics"], chapter: "Chemical Kinetics", questions: [
    ["The rate of a chemical reaction generally increases when:", ["Temperature decreases", "Temperature increases", "Concentration is always zero", "Catalyst is removed"], "Temperature increases"],
    ["The unit of the rate constant for a first-order reaction is:", ["mol L⁻¹ s⁻¹", "s⁻¹", "L mol⁻¹ s⁻¹", "mol² L⁻² s⁻¹"], "s⁻¹"]
  ]},
  { keys: ["periodicity", "periodic table", "classification of elements", "periodic properties"], chapter: "Classification of Elements and Periodicity", questions: [
    ["Across a period from left to right, atomic radius generally:", ["Increases", "Decreases", "Remains constant", "First doubles"], "Decreases"],
    ["The most electronegative element is:", ["Oxygen", "Chlorine", "Fluorine", "Nitrogen"], "Fluorine"]
  ]},
  { keys: ["p-block", "p block"], chapter: "p-Block Elements", questions: [
    ["Which element belongs to group 18?", ["Nitrogen", "Neon", "Sulphur", "Chlorine"], "Neon"],
    ["The oxidation state of oxygen in most of its compounds is:", ["+2", "+1", "−1", "−2"], "−2"]
  ]},
  { keys: ["d- and f-block", "d- and f-block elements", "d-block", "f-block", "transition elements", "s-, p-, d- and f-block"], chapter: "d- and f-Block Elements", questions: [
    ["Transition elements commonly show variable oxidation states because they have:", ["Only filled s orbitals", "Partially filled d orbitals", "No valence electrons", "Only p electrons"], "Partially filled d orbitals"],
    ["Which of these is a transition metal?", ["Sodium", "Calcium", "Iron", "Neon"], "Iron"]
  ]},
  { keys: ["coordination", "complex compounds"], chapter: "Coordination Compounds", questions: [
    ["The coordination number of cobalt in [Co(NH₃)₆]³⁺ is:", ["3", "4", "6", "9"], "6"],
    ["NH₃ acts as which type of ligand?", ["Monodentate", "Bidentate", "Tridentate", "Hexadentate"], "Monodentate"]
  ]},
  { keys: ["organic chemistry basics", "basic organic", "principles of organic", "purification", "characterisation", "functional groups"], chapter: "Organic Chemistry Basics", questions: [
    ["The IUPAC name of CH₃CH₂OH is:", ["Methanol", "Ethanol", "Propanol", "Ethanal"], "Ethanol"],
    ["A nucleophile is a species that:", ["Accepts an electron pair", "Donates an electron pair", "Always loses a proton", "Has no electrons"], "Donates an electron pair"]
  ]},
  { keys: ["hydrocarbon"], chapter: "Hydrocarbons", questions: [
    ["The general formula of an open-chain alkane is:", ["CₙH₂ₙ", "CₙH₂ₙ₊₂", "CₙH₂ₙ₋₂", "CₙHₙ"], "CₙH₂ₙ₊₂"],
    ["Which reagent is commonly used to test for unsaturation?", ["Bromine water", "Lime water", "Fehling's solution", "Litmus"], "Bromine water"]
  ]},
  { keys: ["halogen", "haloalkane", "haloarene", "organic compounds containing halogens"], chapter: "Organic Compounds Containing Halogens", questions: [
    ["The functional group in chloroethane is:", ["−OH", "−CHO", "−Cl", "−COOH"], "−Cl"],
    ["Which bond is present in an alkyl halide?", ["C–X", "C=C", "O–H", "C≡N"], "C–X"]
  ]},
  { keys: ["oxygen", "alcohol", "phenol", "ether", "aldehyde", "ketone", "carboxylic"], chapter: "Organic Compounds Containing Oxygen", questions: [
    ["The functional group of alcohols is:", ["−CHO", "−OH", "−COOH", "−NH₂"], "−OH"],
    ["Which compound contains the aldehyde group?", ["CH₃OH", "CH₃CHO", "CH₃COCH₃", "CH₃COOH"], "CH₃CHO"]
  ]},
  { keys: ["nitrogen", "amine", "organic compounds containing nitrogen"], chapter: "Organic Compounds Containing Nitrogen", questions: [
    ["The functional group of a primary amine is:", ["−OH", "−NH₂", "−CHO", "−COOH"], "−NH₂"],
    ["Aniline is an example of:", ["Aromatic amine", "Alcohol", "Ether", "Aldehyde"], "Aromatic amine"]
  ]},
  { keys: ["biomolecule", "polymers"], chapter: "Biomolecules", questions: [
    ["The monomers of proteins are:", ["Monosaccharides", "Amino acids", "Nucleotides", "Fatty acids"], "Amino acids"],
    ["Which carbohydrate is commonly called blood sugar?", ["Sucrose", "Starch", "Glucose", "Cellulose"], "Glucose"]
  ]},
  { keys: ["practical chemistry", "principles related to practical"], chapter: "Practical Chemistry", questions: [
    ["Which indicator is commonly used in an acid–base titration?", ["Phenolphthalein", "Starch only", "Iodine crystals", "Copper sulphate"], "Phenolphthalein"],
    ["A burette is primarily used to measure:", ["Mass", "Variable volume of liquid delivered", "Temperature", "Pressure"], "Variable volume of liquid delivered"]
  ]},
  { keys: ["hydrogen and s-block", "hydrogen and s block"], chapter: "Hydrogen and s-Block Elements", questions: [
    ["Which alkali metal is stored under kerosene because of its high reactivity with air and water?", ["Lithium", "Sodium", "Copper", "Silver"], "Sodium"],
    ["The oxidation state of hydrogen in metal hydrides such as NaH is:", ["+1", "−1", "0", "+2"], "−1"]
  ]},
  { keys: ["states of matter", "gas laws"], chapter: "States of Matter", questions: [
    ["At constant temperature, Boyle's law states that pressure is:", ["Directly proportional to volume", "Inversely proportional to volume", "Equal to volume", "Independent of volume"], "Inversely proportional to volume"],
    ["The SI unit of pressure is:", ["Atmosphere", "Bar", "Pascal", "Torr"], "Pascal"]
  ]},
  { keys: ["environmental chemistry", "chemistry in everyday life"], chapter: "Environmental Chemistry", questions: [
    ["Which gas is a major contributor to acid rain?", ["Oxygen", "Sulphur dioxide", "Hydrogen", "Helium"], "Sulphur dioxide"],
    ["Ozone depletion is strongly associated with:", ["CFCs", "O₂", "N₂", "Argon"], "CFCs"]
  ]}
];

let nextChemistryQuestionId = 1000;
chemistryChapterQuestionSets.forEach((set) => {
  set.questions.forEach(([question, options, answer]) => {
    practiceQuestionBank.push({
      id: nextChemistryQuestionId++, subject: "Chemistry", chapter: set.chapter,
      type: "MCQ", question, options, answer
    });
  });
});

const getChemistryPracticeQuestions = (chapter) => {
  const exact = practiceQuestionBank.filter((q) => q.subject === "Chemistry" && q.chapter === chapter);
  if (exact.length) return exact;
  const normalized = String(chapter || "").toLowerCase().replace(/[^a-z0-9]/g, "");
  const matchingSet = chemistryChapterQuestionSets.find((set) =>
    set.keys.some((key) => normalized.includes(key.toLowerCase().replace(/[^a-z0-9]/g, "")) || key.toLowerCase().replace(/[^a-z0-9]/g, "").includes(normalized))
  );
  if (!matchingSet) return [];
  return practiceQuestionBank.filter((q) => q.subject === "Chemistry" && q.chapter === matchingSet.chapter);
};



const getPracticeQuestions = (subject, chapter = "") => {
  if (subject === "Chemistry" && chapter) {
    return getChemistryPracticeQuestions(chapter);
  }

  if (subject === "Physics" && chapter === "Units and Measurements") {
    return jeeMainPhysicsUnitsQuestions;
  }

  return practiceQuestionBank.filter(
    (q) =>
      q.subject === subject &&
      (!chapter || q.chapter === chapter)
  );
};




// In-app revision notes. The fallback keeps every syllabus chapter readable,
// while the topic rules add relevant definitions/formulas for common chapters.
const getChapterNotes = (subject, chapter) => {
  const name = String(chapter || "Selected chapter");
  const lower = name.toLowerCase();
  let overview = `This chapter focuses on ${name}. Start by understanding the definitions, the assumptions behind each concept, and how the ideas connect to earlier chapters.`;
  let concepts = [
    `Write the meaning and scope of ${name} in your own words.`,
    "Identify the main terms, laws, principles or processes used in this chapter.",
    "Understand the conditions under which each result is valid; do not memorise a formula without its assumptions.",
    "Practise a few basic examples before attempting timed exam-level questions."
  ];
  let formulas = [];
  let examFocus = "Prepare definitions, concept-based MCQs, worked examples and questions that combine this chapter with related topics.";

  if (subject === "Physics") {
    if (lower.includes("kinematic") || lower.includes("motion")) {
      overview = "Kinematics describes motion using displacement, velocity and acceleration without analysing the force causing the motion.";
      concepts = ["Displacement is the change in position and is a vector; distance is the total path length and is a scalar.", "Average velocity = total displacement / total time; average speed = total distance / total time.", "Acceleration is the rate of change of velocity. For constant acceleration, use the standard equations of motion.", "Read position-time and velocity-time graphs carefully: their slope and area have physical meanings."];
      formulas = ["v = u + at", "s = ut + ½at²", "v² = u² + 2as", "a = (v − u) / t"];
    } else if (lower.includes("law") || lower.includes("force")) {
      overview = "Newton's laws connect the motion of a body with the net external force acting on it.";
      concepts = ["First law: a body maintains rest or uniform straight-line motion unless acted on by a net external force.", "Second law: net force equals the rate of change of momentum; for constant mass, F = ma.", "Third law: action and reaction are equal and opposite, and act on different bodies.", "Draw a free-body diagram and resolve forces along convenient axes before solving a problem."];
      formulas = ["ΣF = ma", "p = mv", "fₛ ≤ μₛN", "fₖ = μₖN"];
    } else if (lower.includes("work") || lower.includes("energy")) {
      overview = "Work and energy methods relate forces, displacement and changes in the state of motion.";
      concepts = ["Work by a constant force is the dot product of force and displacement.", "Kinetic energy depends on mass and the square of speed.", "The work-energy theorem states that net work equals change in kinetic energy.", "Mechanical energy is conserved when only conservative forces do work."];
      formulas = ["W = Fs cos θ", "K = ½mv²", "U₉ = mgh", "Wₙₑₜ = ΔK"];
    } else if (lower.includes("electrostat") || lower.includes("electric")) {
      overview = "Electrostatics studies electric charges at rest, the forces between them, and the electric field and potential they create.";
      concepts = ["Like charges repel and unlike charges attract.", "Coulomb's law gives the magnitude of force between two point charges.", "Electric field is force per unit positive test charge.", "Electric potential is potential energy per unit charge; potential is a scalar quantity."];
      formulas = ["F = k|q₁q₂|/r²", "E = F/q", "V = kq/r", "C = Q/V"];
    } else if (lower.includes("current electricity")) {
      overview = "Current electricity studies the flow of charge through conductors and the circuits that control it.";
      concepts = ["Electric current is the rate of flow of charge.", "Ohm's law applies to an ohmic conductor at constant physical conditions.", "Resistors in series carry the same current; resistors in parallel have the same potential difference.", "Use Kirchhoff's junction and loop rules for multi-loop circuits."];
      formulas = ["I = Q/t", "V = IR", "P = VI = I²R = V²/R", "R(series) = ΣR; 1/R(parallel) = Σ(1/R)"];
    } else if (lower.includes("wave") || lower.includes("oscillation")) {
      overview = "Oscillations describe repeated motion about equilibrium, while waves transfer energy through space or a medium.";
      concepts = ["Simple harmonic motion has restoring acceleration proportional to displacement and directed towards equilibrium.", "Amplitude is maximum displacement; period is time for one cycle; frequency is cycles per second.", "Wave speed depends on frequency and wavelength.", "Distinguish transverse and longitudinal waves by the direction of particle vibration."];
      formulas = ["a = −ω²x", "T = 2π/ω", "f = 1/T", "v = fλ"];
    } else {
      concepts = ["List the physical quantities and SI units used in this chapter.", "Identify the governing laws and the assumptions in which they apply.", "Practise dimensional checks and draw a labelled diagram before substituting values.", "Keep track of vector directions, signs and units throughout calculations."];
      formulas = ["Write each chapter-specific law with its SI units", "Check dimensions on both sides of every equation"];
    }
    examFocus = "Expect conceptual questions, graph interpretation, unit/dimension checks and numerical problems. Show the governing equation and substitute values with units.";
  } else if (subject === "Mathematics") {
    if (lower.includes("trigon")) {
      overview = "Trigonometry studies relationships between angles and sides and the identities connecting trigonometric functions.";
      concepts = ["Know the unit-circle signs in all four quadrants.", "Convert between degrees and radians correctly.", "Use identities to simplify expressions before solving equations.", "Check the domain and general solution when solving trigonometric equations."];
      formulas = ["sin²x + cos²x = 1", "1 + tan²x = sec²x", "1 + cot²x = cosec²x", "sin(A ± B) = sinA cosB ± cosA sinB"];
    } else if (lower.includes("integral")) {
      overview = "Integral calculus studies accumulation and the reverse process of differentiation.";
      concepts = ["An indefinite integral represents a family of antiderivatives and includes a constant of integration.", "A definite integral gives signed area/accumulation over an interval.", "Choose substitution, parts or partial fractions based on the integrand.", "Use limits carefully when applying the Fundamental Theorem of Calculus."];
      formulas = ["∫xⁿ dx = xⁿ⁺¹/(n+1) + C, n ≠ −1", "∫1/x dx = ln|x| + C", "∫ₐᵇ f(x)dx = F(b) − F(a)"];
    } else if (lower.includes("differential") || lower.includes("continuity") || lower.includes("limit")) {
      overview = "Differential calculus studies limits, continuity and instantaneous rates of change.";
      concepts = ["A limit describes the value approached by a function near a point.", "Continuity at a point requires the function value and the two-sided limit to agree.", "The derivative is the instantaneous rate of change and the slope of the tangent.", "Use product, quotient and chain rules carefully; simplify before substituting a point."];
      formulas = ["d(xⁿ)/dx = nxⁿ⁻¹", "d(sin x)/dx = cos x", "d(eˣ)/dx = eˣ", "(uv)' = u'v + uv'"];
    } else if (lower.includes("matrix") || lower.includes("determinant")) {
      overview = "Matrices organise numbers in rows and columns; determinants provide a scalar associated with a square matrix.";
      concepts = ["Matrix addition requires equal dimensions.", "Matrix multiplication is generally not commutative.", "A square matrix is invertible when its determinant is non-zero.", "Use row/column operations carefully when evaluating determinants."];
      formulas = ["For A = [[a,b],[c,d]], det(A) = ad − bc", "A⁻¹ = adj(A)/det(A), when det(A) ≠ 0"];
    } else {
      concepts = ["Write down the definitions and standard results used in this topic.", "Learn the conditions for applying each theorem or formula.", "Solve one direct example, one application problem and one mixed-concept problem.", "Check domains, excluded values and boundary cases in the final answer."];
      formulas = ["Maintain a compact formula sheet for this chapter", "Verify answers by substitution or an alternate method when possible"];
    }
    examFocus = "Focus on accurate algebra, domain restrictions, standard identities/theorems and multi-step problems. Avoid skipping intermediate steps in calculations.";
  } else if (subject === "Chemistry") {
    if (lower.includes("basic concept") || lower.includes("mole")) {
      overview = "The mole concept connects microscopic particles with measurable mass and volume.";
      concepts = ["One mole contains Avogadro's number of specified entities.", "Molar mass is the mass of one mole of a substance.", "Balance a chemical equation before using mole ratios.", "For limiting-reagent problems, compare available moles divided by stoichiometric coefficients."];
      formulas = ["n = m/M", "N = nNₐ", "Molarity = moles of solute / volume of solution in litres", "At STP, use the molar volume specified by the question"];
    } else if (lower.includes("atomic")) {
      overview = "Atomic structure explains the arrangement and behaviour of electrons, protons and neutrons.";
      concepts = ["Atomic number is the number of protons; mass number is protons plus neutrons.", "Isotopes have the same atomic number but different mass numbers.", "Electrons occupy quantised energy levels and orbitals.", "Apply Aufbau, Pauli exclusion and Hund's rule when writing electronic configurations."];
      formulas = ["A = Z + N", "Maximum electrons in shell n = 2n²", "For a photon: E = hν = hc/λ"];
    } else if (lower.includes("equilibrium")) {
      overview = "Chemical equilibrium is a dynamic state in which forward and reverse reaction rates are equal.";
      concepts = ["At equilibrium, concentrations remain constant, but reactions continue microscopically.", "The equilibrium constant is written using equilibrium activities/concentrations as appropriate.", "A catalyst changes the rate of reaching equilibrium, not the equilibrium constant.", "Le Chatelier's principle predicts how a system responds to a disturbance."];
      formulas = ["For aA + bB ⇌ cC + dD: Kc = [C]ᶜ[D]ᵈ / ([A]ᵃ[B]ᵇ)", "pH = −log₁₀[H⁺]"];
    } else if (lower.includes("bond")) {
      overview = "Chemical bonding explains how atoms combine and how bonding affects molecular structure and properties.";
      concepts = ["Ionic bonding involves electrostatic attraction between oppositely charged ions.", "Covalent bonding involves shared electron pairs.", "Lewis structures help count valence electrons and identify bonding/lone pairs.", "Molecular shape depends on electron-pair repulsions around the central atom."];
      formulas = ["Formal charge = valence e⁻ − nonbonding e⁻ − ½(bonding e⁻)"];
    } else {
      concepts = ["Identify the important definitions, laws, reactions and exceptions in the chapter.", "For reactions, learn reactants, conditions, products and the reason the reaction occurs.", "For numerical topics, write the given data and select the governing relation before calculation.", "Use periodic trends and bonding concepts to explain chemical behaviour where relevant."];
      formulas = ["Prepare a chapter-wise list of key reactions and formulae", "Always balance chemical equations before calculations"];
    }
    examFocus = "Revise NCERT terminology, trends, reactions, exceptions and numerical formulae. Practise both direct recall and reasoning-based MCQs.";
  } else if (subject === "Biology") {
    if (lower.includes("cell")) {
      overview = "Cell biology studies the structure and function of cells, the basic structural and functional units of life.";
      concepts = ["Prokaryotic cells lack a membrane-bound nucleus; eukaryotic cells possess one.", "The plasma membrane is selectively permeable.", "Mitochondria generate most ATP during aerobic respiration; ribosomes synthesise proteins.", "The nucleus stores genetic information and helps regulate cellular activities."];
    } else if (lower.includes("genetic") || lower.includes("inheritance") || lower.includes("molecular basis")) {
      overview = "Genetics explains inheritance and variation through genes, chromosomes and nucleic acids.";
      concepts = ["Genes are functional units of heredity located at specific positions on chromosomes.", "DNA stores hereditary information; RNA participates in gene expression.", "Mendelian inheritance describes segregation and independent assortment under stated conditions.", "Mutation and recombination contribute to genetic variation."];
    } else if (lower.includes("ecolog") || lower.includes("ecosystem")) {
      overview = "Ecology studies interactions among organisms and between organisms and their environment.";
      concepts = ["An ecosystem includes biotic and abiotic components.", "Energy flows through trophic levels and is not recycled in the same way as nutrients.", "Food chains and food webs represent feeding relationships.", "Biodiversity supports ecosystem stability and resilience."];
    } else {
      concepts = ["Learn the key terms and biological processes in the chapter.", "Study labelled diagrams and identify the function of each structure.", "Compare related groups/processes using a table of distinguishing features.", "Connect structure with function and revise examples given in the textbook."];
    }
    examFocus = "Prioritise NCERT facts, diagrams, examples, terminology and sequence-based questions. Revise similar terms together to avoid confusion.";
  } else if (subject === "English") {
    concepts = ["Read the full passage before attempting comprehension questions.", "Use context clues to infer unfamiliar words.", "Revise parts of speech, subject–verb agreement, tenses, articles and prepositions.", "For sentence correction, check grammar, meaning and consistency together."];
    examFocus = "Practise timed reading comprehension, vocabulary in context, sentence rearrangement and grammar correction.";
  } else if (subject === "Logical Reasoning") {
    concepts = ["Identify the rule connecting the first terms before extending a series.", "For syllogisms, use only the information stated in the premises.", "For arrangements, translate conditions into a small table or diagram.", "Check every option against all conditions; do not rely on assumptions."];
    examFocus = "Practise series, analogy, coding-decoding, directions, arrangements and logical deductions under time limits.";
  } else if (subject === "General Test") {
    concepts = ["For quantitative questions, identify the required quantity and select a direct method.", "For data interpretation, read units, scales and labels before calculating.", "Revise static general knowledge separately from date-sensitive current affairs.", "For reasoning questions, write down constraints and eliminate impossible options."];
    examFocus = "Build accuracy in numerical ability, reasoning, general awareness and current affairs; revise current-affairs material regularly.";
  } else {
    concepts = [
      `Understand the central ideas and terminology of ${name}.`,
      "Make a one-page summary of definitions, principles, examples and exceptions.",
      "Connect the chapter to practical or real-world examples where relevant.",
      "Practise factual recall and application-based MCQs after revising the notes."
    ];
    examFocus = `For ${subject}, revise textbook definitions, important examples, key concepts and application-based questions from ${name}.`;
  }

  return { overview, concepts, formulas, examFocus };
};

// ==================================================
// APP
// ==================================================

function App() {
  // ==================================================
  // GENERAL STATE
  // ==================================================

  const [activePage, setActivePage] = useState("Login");

  const [selectedExam, setSelectedExam] =
    useState("JEE Main");

  // Learning module state
  const [learningSubject, setLearningSubject] = useState("Physics");
  const [learningChapter, setLearningChapter] = useState("");
  const [chapterProgress, setChapterProgress] = useState([]);
  const [loadingChapterProgress, setLoadingChapterProgress] = useState(false);
  const [savingChapter, setSavingChapter] = useState("");
  const [learningVideos, setLearningVideos] = useState([]);
  const [selectedLearningVideoId, setSelectedLearningVideoId] = useState("");
  const [loadingLearningVideos, setLoadingLearningVideos] = useState(false);
  const [learningVideoError, setLearningVideoError] = useState("");

  // ==================================================
  // PRACTICE QUIZ STATE
  // ==================================================

  const [practiceSubject, setPracticeSubject] =
    useState("");
  const [practiceChapter, setPracticeChapter] = useState("");

  const [practiceQuestions, setPracticeQuestions] =
    useState([]);

  const [currentQuestionIndex, setCurrentQuestionIndex] =
    useState(0);

  const [practiceAnswers, setPracticeAnswers] =
    useState({});

  const [markedForReview, setMarkedForReview] =
    useState({});

  const [practiceScore, setPracticeScore] =
    useState(0);

  const [practiceSubmitted, setPracticeSubmitted] =
    useState(false);

  // Set only for server-graded tests (JEE Main PCM).
  const [practiceTestId, setPracticeTestId] = useState(null);
  const [serverPracticeCounts, setServerPracticeCounts] = useState({});

  const [practiceStarted, setPracticeStarted] =
    useState(false);

  const [practiceSubmitting, setPracticeSubmitting] =
    useState(false);

  // Every chapter practice test has a 30-minute countdown.
  const PRACTICE_DURATION_SECONDS = 30 * 60;
  const [practiceTimeLeft, setPracticeTimeLeft] =
    useState(PRACTICE_DURATION_SECONDS);

  // ==================================================
  // LOGIN STATE
  // ==================================================

  const [loginEmail, setLoginEmail] =
    useState("");

  const [loginPassword, setLoginPassword] =
    useState("");

  const [loginMessage, setLoginMessage] =
    useState("");

  const [loggedInStudent, setLoggedInStudent] =
    useState(null);

  // ==================================================
  // STUDENT NAME
  // ==================================================

  const studentName =
    loggedInStudent?.name ||
    loggedInStudent?.full_name ||
    loggedInStudent?.student_name ||
    loggedInStudent?.username ||
    "Student";

  // ==================================================
  // RECOMMENDATIONS
  // ==================================================

  const [recommendations, setRecommendations] =
    useState([]);

  const [loadingRecommendations, setLoadingRecommendations] =
    useState(false);

  // ==================================================
  // PROGRESS
  // ==================================================

  const [progressData, setProgressData] =
    useState(null);

  const [loadingProgress, setLoadingProgress] =
    useState(false);

  // ==================================================
  // REGISTRATION
  // ==================================================

  const [registrationName, setRegistrationName] =
    useState("");

  const [registrationEmail, setRegistrationEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [exam, setExam] =
    useState("JEE Main");

  const [classNumber, setClassNumber] =
    useState("12");

  const [registrationMessage, setRegistrationMessage] =
    useState("");

  const [generatedStudentId, setGeneratedStudentId] =
    useState("");

  const [registeredEmailForLogin, setRegisteredEmailForLogin] =
    useState("");

  // ==================================================
  // FORGOT / RESET PASSWORD
  // ==================================================

  const [forgotEmail, setForgotEmail] =
    useState("");

  const [resetToken, setResetToken] =
    useState("");

  const [newPassword, setNewPassword] =
    useState("");

  const [confirmNewPassword, setConfirmNewPassword] =
    useState("");

  const [resetMessage, setResetMessage] =
    useState("");

  const [sendingReset, setSendingReset] =
    useState(false);

  const [resettingPassword, setResettingPassword] =
    useState(false);

  // ==================================================
  // START PRACTICE
  // ==================================================

  const startPractice = async (subject, chapter = "") => {
    const exam = selectedExam || loggedInStudent?.exam || "JEE Main";
    let questions;
    let testId = null;

    if (usesServerPractice(exam, subject)) {
      try {
        const params = new URLSearchParams({ exam, subject });
        if (chapter) {
          params.set("chapter", chapter);
        }

        const response = await fetch(
          `${PRACTICE_API_BASE}/practice/questions?${params.toString()}`
        );
        const data = await response.json();

        if (!response.ok) {
          window.alert(
            getApiErrorMessage(
              data,
              "Unable to load practice questions. Please try again."
            )
          );
          return;
        }

        questions = data.questions || [];
        testId = data.test_id;
      } catch (error) {
        console.error("Practice questions error:", error);
        window.alert("Unable to reach the server. Please try again.");
        return;
      }
    } else {
      questions = getPracticeQuestions(subject, chapter);
    }

    if (questions.length === 0) {
      window.alert(`The ${subject} question bank is being prepared. Please choose a subject with available questions for now.`);
      return;
    }

    setPracticeTestId(testId);
    setActivePage("Practice");
    setPracticeSubject(subject);
    setPracticeChapter(chapter);
    setPracticeQuestions(questions);
    setCurrentQuestionIndex(0);

    setPracticeAnswers({});
    setMarkedForReview({});

    setPracticeScore(0);
    setPracticeSubmitted(false);
    setPracticeSubmitting(false);
    setPracticeTimeLeft(PRACTICE_DURATION_SECONDS);
    setPracticeStarted(true);
  };

  // ==================================================
  // RESET PRACTICE
  // ==================================================

  const resetPractice = () => {
    setPracticeSubject("");
    setPracticeChapter("");
    setPracticeQuestions([]);
    setCurrentQuestionIndex(0);

    setPracticeAnswers({});
    setMarkedForReview({});

    setPracticeScore(0);
    setPracticeSubmitted(false);
    setPracticeSubmitting(false);
    setPracticeTimeLeft(PRACTICE_DURATION_SECONDS);
    setPracticeStarted(false);
  };

  // ==================================================
  // PRACTICE ANSWER HANDLER
  // ==================================================

  const handlePracticeAnswer = (
    questionId,
    answer
  ) => {
    setPracticeAnswers(
      (previousAnswers) => ({
        ...previousAnswers,
        [questionId]: answer,
      })
    );
  };

  // ==================================================
  // MULTIPLE CORRECT ANSWER HANDLER
  // ==================================================

  const handleMultipleAnswer = (
    questionId,
    option
  ) => {
    setPracticeAnswers(
      (previousAnswers) => {
        const existing =
          previousAnswers[questionId] || [];

        const alreadySelected =
          existing.includes(option);

        let updated;

        if (alreadySelected) {
          updated = existing.filter(
            (item) => item !== option
          );
        } else {
          updated = [
            ...existing,
            option,
          ];
        }

        return {
          ...previousAnswers,
          [questionId]: updated,
        };
      }
    );
  };

  // ==================================================
  // NUMERICAL ANSWER HANDLER
  // ==================================================

  const handleNumericalAnswer = (
    questionId,
    value
  ) => {
    setPracticeAnswers(
      (previousAnswers) => ({
        ...previousAnswers,
        [questionId]: value,
      })
    );
  };

  // ==================================================
  // MARK FOR REVIEW
  // ==================================================

  const toggleMarkForReview = (
    questionId
  ) => {
    setMarkedForReview(
      (previousMarks) => ({
        ...previousMarks,
        [questionId]:
          !previousMarks[questionId],
      })
    );
  };

  // ==================================================
  // CLEAR ANSWER
  // ==================================================

  const clearCurrentAnswer = () => {
    const currentQuestion =
      practiceQuestions[
        currentQuestionIndex
      ];

    if (!currentQuestion) {
      return;
    }

    setPracticeAnswers(
      (previousAnswers) => {
        const updated = {
          ...previousAnswers,
        };

        delete updated[
          currentQuestion.id
        ];

        return updated;
      }
    );
  };

  // ==================================================
  // CHECK ANSWERED
  // ==================================================

  const isQuestionAnswered = (
    question
  ) => {
    const answer =
      practiceAnswers[question.id];

    if (
      answer === undefined ||
      answer === null
    ) {
      return false;
    }

    if (Array.isArray(answer)) {
      return answer.length > 0;
    }

    return (
      String(answer).trim() !== ""
    );
  };

  // ==================================================
  // QUESTION STATUS
  // ==================================================

  const getQuestionStatus = (
    question
  ) => {
    const answered =
      isQuestionAnswered(question);

    const review =
      markedForReview[question.id];

    if (answered && review) {
      return "answered-review";
    }

    if (answered) {
      return "answered";
    }

    if (review) {
      return "review";
    }

    return "unanswered";
  };

  // ==================================================
  // CHECK CORRECT ANSWER
  // ==================================================

  const checkPracticeAnswer = (
    question
  ) => {
    const userAnswer =
      practiceAnswers[question.id];

    if (
      userAnswer === undefined ||
      userAnswer === null
    ) {
      return false;
    }

    // Multiple correct
    if (
      question.type ===
      "Multiple Correct"
    ) {
      if (!Array.isArray(userAnswer)) {
        return false;
      }

      if (!Array.isArray(question.answer)) {
        return false;
      }

      if (
        userAnswer.length !==
        question.answer.length
      ) {
        return false;
      }

      const sortedUser = [
        ...userAnswer,
      ].sort();

      const sortedCorrect = [
        ...question.answer,
      ].sort();

      return sortedUser.every(
        (value, index) =>
          value ===
          sortedCorrect[index]
      );
    }

    // Numerical
    if (
      question.type === "Numerical"
    ) {
      const userValue = Number(
        String(userAnswer).trim()
      );

      const correctValue = Number(
        String(question.answer).trim()
      );

      return (
        !Number.isNaN(userValue) &&
        !Number.isNaN(correctValue) &&
        userValue === correctValue
      );
    }

    // Normal MCQ
    return (
      String(userAnswer) ===
      String(question.answer)
    );
  };

  // ==================================================
  // SUBMIT PRACTICE
  // ==================================================

  const submitPractice = async () => {
    // Prevent duplicate submissions.
    if (practiceSubmitting || practiceSubmitted) {
      return;
    }

    if (!loggedInStudent?.student_id) {
      window.alert("Please log in before submitting your practice test.");
      return;
    }

    if (practiceQuestions.length === 0) {
      window.alert("There are no questions to submit.");
      return;
    }

    setPracticeSubmitting(true);

    const score = practiceQuestions.reduce(
      (total, question) =>
        total + (checkPracticeAnswer(question) ? 1 : 0),
      0
    );

    const serverMode = Boolean(practiceTestId);

    const attempts = practiceQuestions.map((question) => {
      const answered = isQuestionAnswered(question);
      const answer = practiceAnswers[question.id];

      if (serverMode) {
        // The server knows the answers and grades the test itself.
        return {
          question_id: question.id,
          selected_answer: answered ? toServerAnswer(question, answer) : null,
          marked_for_review: Boolean(markedForReview[question.id]),
        };
      }

      return {
        question_id: question.id,
        question_text: question.question,
        question_type: question.type,
        selected_answer: answered ? JSON.stringify(answer) : null,
        correct_answer: JSON.stringify(question.answer),
        is_correct: checkPracticeAnswer(question),
        marked_for_review: Boolean(markedForReview[question.id]),
      };
    });

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/practice/submit",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            student_id: loggedInStudent.student_id,
            subject: practiceSubject,
            chapter: practiceChapter || null,
            test_id: practiceTestId || window.crypto.randomUUID(),
            graded_on_server: serverMode,
            attempts,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          getApiErrorMessage(
            data,
            "Unable to save your practice test. Please try again."
          )
        );
      }

      console.log("Practice test saved successfully:", data);
      if (serverMode) {
        // Reveal the correct answers so the review screen can show them.
        const resultsById = Object.fromEntries(
          (data.results || []).map((result) => [result.question_id, result])
        );
        setPracticeQuestions((previous) =>
          previous.map((question) => {
            const result = resultsById[question.id];
            if (!result) {
              return question;
            }
            return {
              ...question,
              answer: fromServerAnswer(question, result.correct_answer),
              explanation: result.explanation,
            };
          })
        );
      }

      setPracticeScore(data.score ?? score);
      setPracticeSubmitted(true);
    } catch (error) {
      console.error("Practice submission error:", error);
      window.alert(
        error.message ||
          "Unable to save your practice test. Please try again."
      );
    } finally {
      setPracticeSubmitting(false);
    }
  };

  // 30-minute countdown. When it reaches zero, save the test automatically.
  useEffect(() => {
    if (!practiceStarted || practiceSubmitted || practiceSubmitting) {
      return undefined;
    }

    if (practiceTimeLeft <= 0) {
      submitPractice();
      return undefined;
    }

    const timerId = window.setTimeout(() => {
      setPracticeTimeLeft((seconds) => Math.max(0, seconds - 1));
    }, 1000);

    return () => window.clearTimeout(timerId);
  }, [
    practiceStarted,
    practiceSubmitted,
    practiceSubmitting,
    practiceTimeLeft,
  ]);

  // Question counts per chapter for the Practice page (JEE Main).
  useEffect(() => {
    if (activePage !== "Practice" || !String(selectedExam || "").startsWith("JEE")) {
      return undefined;
    }

    let cancelled = false;

    fetch(
      `${PRACTICE_API_BASE}/practice/counts?exam=${encodeURIComponent(selectedExam)}`
    )
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (!cancelled && data?.counts) {
          setServerPracticeCounts(data.counts);
        }
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [activePage, selectedExam, practiceStarted]);

  // ==================================================
  // LEARNING MODULE DATA AND PROGRESS
  // ==================================================

  const openLearning = (subject, chapter = "") => {
    const availableSubjects = getSubjectsForExam(selectedExam);
    const nextSubject = availableSubjects.includes(subject) ? subject : availableSubjects[0];
    const chapters = getChaptersForExam(selectedExam, nextSubject);
    const requestedChapter = String(chapter || "").trim().toLowerCase();
    const matchedChapter = chapters.find((item) => {
      const candidate = item.toLowerCase();
      return candidate === requestedChapter || candidate.includes(requestedChapter) || requestedChapter.includes(candidate);
    });

    setLearningSubject(nextSubject);
    setLearningChapter(matchedChapter || chapters[0] || "");
    resetPractice();
    setActivePage("Learning");
  };

  const saveChapterCompletion = async (subject, chapter, completed) => {
    if (!loggedInStudent?.student_id) return;
    const key = `${subject}::${chapter}`;
    setSavingChapter(key);

    try {
      const response = await fetch("http://127.0.0.1:8000/chapter-progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          student_id: loggedInStudent.student_id,
          exam: selectedExam,
          subject,
          chapter,
          progress: completed ? 100 : 0,
          completed,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(getApiErrorMessage(data, "Unable to save chapter progress."));

      setChapterProgress((previous) => {
        const withoutCurrent = previous.filter((item) => !(item.subject === subject && item.chapter === chapter));
        return [...withoutCurrent, { subject, chapter, progress: completed ? 100 : 0, completed }];
      });
    } catch (error) {
      console.error("Chapter progress save error:", error);
      window.alert(error.message || "Unable to save chapter progress.");
    } finally {
      setSavingChapter("");
    }
  };

  useEffect(() => {
    const subjects = getSubjectsForExam(selectedExam);
    if (!subjects.includes(learningSubject)) {
      const nextSubject = subjects[0] || "Physics";
      setLearningSubject(nextSubject);
      setLearningChapter(getChaptersForExam(selectedExam, nextSubject)[0] || "");
    }
  }, [selectedExam, learningSubject]);

  useEffect(() => {
    if (!loggedInStudent?.student_id) return;
    setLoadingChapterProgress(true);
    fetch(`http://127.0.0.1:8000/chapter-progress/${loggedInStudent.student_id}?exam=${encodeURIComponent(selectedExam)}`)
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(getApiErrorMessage(data, "Unable to load chapter progress."));
        setChapterProgress(Array.isArray(data.chapters) ? data.chapters : []);
      })
      .catch((error) => {
        console.error("Chapter progress load error:", error);
        setChapterProgress([]);
      })
      .finally(() => setLoadingChapterProgress(false));
  }, [loggedInStudent, selectedExam]);


  // Search YouTube for real, embeddable videos whenever the learning chapter changes.
  useEffect(() => {
    if (activePage !== "Learning" || !learningSubject || !learningChapter) return;

    const controller = new AbortController();
    const loadVideos = async () => {
      setLoadingLearningVideos(true);
      setLearningVideoError("");
      setLearningVideos([]);
      setSelectedLearningVideoId("");

      try {
        const params = new URLSearchParams({
          exam: selectedExam,
          subject: learningSubject,
          chapter: learningChapter,
        });
        const response = await fetch(`http://127.0.0.1:8000/videos/search?${params.toString()}`, { signal: controller.signal });
        const data = await response.json();
        if (!response.ok) throw new Error(getApiErrorMessage(data, "Unable to find videos for this chapter."));

        const videos = Array.isArray(data.videos) ? data.videos : [];
        setLearningVideos(videos);
        setSelectedLearningVideoId(videos[0]?.video_id || "");
        if (videos.length === 0) setLearningVideoError("No embeddable videos were found for this chapter. Try another chapter or use the YouTube search link below.");
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Learning video search error:", error);
          setLearningVideoError(error.message || "Unable to load videos right now.");
        }
      } finally {
        if (!controller.signal.aborted) setLoadingLearningVideos(false);
      }
    };

    loadVideos();
    return () => controller.abort();
  }, [activePage, selectedExam, learningSubject, learningChapter]);

  // ==================================================
  // READ RESET TOKEN
  // ==================================================

  useEffect(() => {
    const params =
      new URLSearchParams(
        window.location.search
      );

    const token =
      params.get("reset_token");

    if (token) {
      setResetToken(token);
      setActivePage(
        "Reset Password"
      );
    }
  }, []);

  // ==================================================
  // BACKEND HEALTH CHECK
  // ==================================================

  useEffect(() => {
    fetch("http://127.0.0.1:8000/")
      .then((response) =>
        response.json()
      )
      .then((data) => {
        console.log(
          "Backend:",
          data
        );
      })
      .catch((error) => {
        console.error(
          "Backend connection error:",
          error
        );
      });
  }, []);

  // ==================================================
  // LOAD RECOMMENDATIONS AFTER LOGIN
  // ==================================================

  useEffect(() => {
    if (
      !loggedInStudent?.student_id
    ) {
      return;
    }

    setLoadingRecommendations(true);

    fetch(
      `http://127.0.0.1:8000/recommendations/${loggedInStudent.student_id}`
    )
      .then(async (response) => {
        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            getApiErrorMessage(
              data,
              "Unable to load recommendations."
            )
          );
        }

        return data;
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setRecommendations(data);
        } else if (
          Array.isArray(
            data.recommendations
          )
        ) {
          setRecommendations(
            data.recommendations
          );
        } else {
          setRecommendations([]);
        }
      })
      .catch((error) => {
        console.error(
          "Recommendation error:",
          error
        );

        setRecommendations([]);
      })
      .finally(() => {
        setLoadingRecommendations(
          false
        );
      });
  }, [loggedInStudent]);

  // ==================================================
  // LOAD PROGRESS AFTER LOGIN
  // ==================================================

  useEffect(() => {
    if (
      !loggedInStudent?.student_id
    ) {
      return;
    }

    setLoadingProgress(true);

    fetch(
      `http://127.0.0.1:8000/progress/${loggedInStudent.student_id}`
    )
      .then(async (response) => {
        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            getApiErrorMessage(
              data,
              "Unable to load progress."
            )
          );
        }

        return data;
      })
      .then((data) => {
        setProgressData(data);
      })
      .catch((error) => {
        console.error(
          "Progress error:",
          error
        );

        setProgressData(null);
      })
      .finally(() => {
        setLoadingProgress(false);
      });
  }, [loggedInStudent]);

  // ==================================================
  // LOGIN
  // ==================================================

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoginMessage("");

    const email = loginEmail.trim();
    const password = loginPassword;

    if (!email || !password) {
      setLoginMessage("Please enter your email and password.");
      return;
    }

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            password: password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          getApiErrorMessage(data, "Login failed.")
        );
      }

      const student = data.student || data;

      if (!student.student_id) {
        throw new Error(
          "Student information was not returned."
        );
      }

      setLoggedInStudent(student);

      if (student.exam) {
        setSelectedExam(student.exam);
      }

      setLoginEmail("");
      setLoginPassword("");
      setLoginMessage("");
      setActivePage("Dashboard");
    } catch (error) {
      console.error("Login error:", error);
      setLoginMessage(
        error.message || "Unable to login. Please try again."
      );
    }
  };

  // ==================================================
  // LOGOUT
  // ==================================================

  const handleLogout = () => {
    setLoggedInStudent(null);

    setRecommendations([]);
    setProgressData(null);

    setLoginEmail("");
    setLoginPassword("");
    setLoginMessage("");

    resetPractice();

    setActivePage("Login");
  };

  // ==================================================
  // REGISTRATION
  // ==================================================

  const handleRegistration =
    async (event) => {
      event.preventDefault();

      setRegistrationMessage("");

      if (
        !registrationName ||
        !registrationEmail ||
        !password ||
        !exam ||
        !classNumber
      ) {
        setRegistrationMessage(
          "Please fill in all required fields."
        );

        return;
      }

      try {
        const response =
          await fetch(
            "http://127.0.0.1:8000/register",
            {
              method: "POST",
              headers: {
                "Content-Type":
                  "application/json",
              },
              body: JSON.stringify({
                name: registrationName,
                email: registrationEmail,
                password:
                  password,
                exam: exam,
                class_number:
                  Number(classNumber),
              }),
            }
          );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            getApiErrorMessage(
              data,
              "Registration failed."
            )
          );
        }

        setGeneratedStudentId(
          data.student_id ||
            data.student?.student_id ||
            ""
        );

        setRegisteredEmailForLogin(
          registrationEmail
        );

        setRegistrationMessage(
          "Student registered successfully."
        );

        setRegistrationName("");
        setRegistrationEmail("");
        setPassword("");
        setExam("JEE Main");
        setClassNumber("12");
      } catch (error) {
        console.error(
          "Registration error:",
          error
        );

        setRegistrationMessage(
          error.message ||
            "Unable to register. Please try again."
        );
      }
    };

  // ==================================================
  // FORGOT PASSWORD
  // ==================================================

  const handleForgotPassword =
    async (event) => {
      event.preventDefault();

      setResetMessage("");

      if (!forgotEmail) {
        setResetMessage(
          "Please enter your registered email."
        );

        return;
      }

      setSendingReset(true);

      try {
        const response =
          await fetch(
            "http://127.0.0.1:8000/forgot-password",
            {
              method: "POST",
              headers: {
                "Content-Type":
                  "application/json",
              },
              body: JSON.stringify({
                email: forgotEmail,
              }),
            }
          );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            getApiErrorMessage(
              data,
              "Unable to send reset link."
            )
          );
        }

        setResetMessage(
          data.message ||
            "Password reset link has been sent successfully."
        );
      } catch (error) {
        console.error(
          "Forgot password error:",
          error
        );

        setResetMessage(
          error.message ||
            "Unable to send reset link."
        );
      } finally {
        setSendingReset(false);
      }
    };

  // ==================================================
  // RESET PASSWORD
  // ==================================================

  const handleResetPassword =
    async (event) => {
      event.preventDefault();

      setResetMessage("");

      if (!resetToken) {
        setResetMessage(
          "Reset token is missing."
        );

        return;
      }

      if (
        !newPassword ||
        !confirmNewPassword
      ) {
        setResetMessage(
          "Please enter and confirm your new password."
        );

        return;
      }

      if (
        newPassword !==
        confirmNewPassword
      ) {
        setResetMessage(
          "Passwords do not match."
        );

        return;
      }

      setResettingPassword(true);

      try {
        const response =
          await fetch(
            "http://127.0.0.1:8000/reset-password",
            {
              method: "POST",
              headers: {
                "Content-Type":
                  "application/json",
              },
              body: JSON.stringify({
                token: resetToken,
                new_password:
                  newPassword,
              }),
            }
          );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            getApiErrorMessage(
              data,
              "Unable to reset password."
            )
          );
        }

        setResetMessage(
          data.message ||
            "Password reset successfully."
        );

        setTimeout(() => {
          window.history.replaceState(
            {},
            document.title,
            window.location.pathname
          );

          setResetToken("");
          setNewPassword("");
          setConfirmNewPassword("");

          setActivePage("Login");
        }, 1200);
      } catch (error) {
        console.error(
          "Reset password error:",
          error
        );

        setResetMessage(
          error.message ||
            "Unable to reset password."
        );
      } finally {
        setResettingPassword(false);
      }
    };

  // ==================================================
  // ALERT CLASSES
  // ==================================================

  const getLoginAlertClass = () => {
    if (!loginMessage) {
      return "";
    }

    if (
      loginMessage
        .toLowerCase()
        .includes("success")
    ) {
      return "alert success";
    }

    return "alert error";
  };

  const getRegistrationAlertClass =
    () => {
      if (!registrationMessage) {
        return "";
      }

      if (
        registrationMessage
          .toLowerCase()
          .includes("success")
      ) {
        return "alert success";
      }

      return "alert error";
    };

  const getResetAlertClass = () => {
    if (!resetMessage) {
      return "";
    }

    if (
      resetMessage
        .toLowerCase()
        .includes("success") ||
      resetMessage
        .toLowerCase()
        .includes("sent")
    ) {
      return "alert success";
    }

    return "alert error";
  };

  // ==================================================
  // AUTH PAGE
  // ==================================================

  const renderAuthPage = () => {
    // ==================================================
    // LOGIN
    // ==================================================

    if (activePage === "Login") {
      return (
        <div className="auth-page">
          <div className="blob blob-peach"></div>
          <div className="blob blob-pink"></div>
          <div className="blob blob-blue"></div>
          <div className="blob blob-lilac"></div>

          <div className="auth-card">
            <div className="auth-header">
              <div className="brand-mark">
                P
              </div>

              <div>
                <h1>
                  PREPMIND AI
                </h1>

                <p>
                  Intelligent Learning •
                  Personalized Growth
                </p>
              </div>

              <span className="brand-chip">
                AI POWERED
              </span>
            </div>

            <div className="auth-body">
              <div className="student-avatar">
                🎓
              </div>

              <h2>
                Welcome Back!
              </h2>

              <p className="auth-description">
                Continue your personalized
                learning journey.
              </p>

              <form
                onSubmit={
                  handleLogin
                }
              >
                <label>
                  Email Address
                </label>

                <input
                  type="email"
                  placeholder="Enter your email"
                  value={loginEmail}
                  onChange={(e) =>
                    setLoginEmail(
                      e.target.value
                    )
                  }
                />

                <label>
                  Password
                </label>

                <input
                  type="password"
                  placeholder="Enter your password"
                  value={
                    loginPassword
                  }
                  onChange={(e) =>
                    setLoginPassword(
                      e.target.value
                    )
                  }
                />

                {loginMessage && (
                  <div
                    className={getLoginAlertClass()}
                  >
                    {loginMessage}
                  </div>
                )}

                <button
                  type="submit"
                  className="auth-main-button"
                >
                  Login to PrepMind AI
                </button>
              </form>

              <button
                className="text-link"
                onClick={() => {
                  setForgotEmail("");
                  setResetMessage("");

                  setActivePage(
                    "Forgot Password"
                  );
                }}
              >
                Forgot Password?
              </button>

              <div className="switch-auth">
                Don't have an account?{" "}
                <button
                  onClick={() => {
                    setRegistrationMessage(
                      ""
                    );

                    setGeneratedStudentId(
                      ""
                    );

                    setActivePage(
                      "Register"
                    );
                  }}
                >
                  Create Account
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // ==================================================
    // REGISTER
    // ==================================================

    if (
      activePage === "Register"
    ) {
      return (
        <div className="auth-page">
          <div className="blob blob-peach"></div>
          <div className="blob blob-pink"></div>
          <div className="blob blob-blue"></div>
          <div className="blob blob-lilac"></div>

          <div className="auth-card">
            <div className="auth-header">
              <div className="brand-mark">
                P
              </div>

              <div>
                <h1>
                  PREPMIND AI
                </h1>

                <p>
                  Create your personalized
                  learning profile
                </p>
              </div>

              <span className="brand-chip">
                JOIN US
              </span>
            </div>

            <div className="auth-body">
              {!generatedStudentId ? (
                <>
                  <h2>
                    Create Your Profile
                  </h2>

                  <p className="auth-description">
                    Start your personalized
                    learning journey.
                  </p>

                  <form
                    onSubmit={
                      handleRegistration
                    }
                  >
                    <label>
                      Full Name
                    </label>

                    <input
                      type="text"
                      placeholder="Enter your full name"
                      value={
                        registrationName
                      }
                      onChange={(e) =>
                        setRegistrationName(
                          e.target.value
                        )
                      }
                    />

                    <label>
                      Email Address
                    </label>

                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={
                        registrationEmail
                      }
                      onChange={(e) =>
                        setRegistrationEmail(
                          e.target.value
                        )
                      }
                    />

                    <label>
                      Password
                    </label>

                    <input
                      type="password"
                      placeholder="Create a password"
                      value={password}
                      onChange={(e) =>
                        setPassword(
                          e.target.value
                        )
                      }
                    />

                    <div className="auth-row">
                      <div>
                        <label>
                          Select Exam
                        </label>

                        <select
                          value={exam}
                          onChange={(e) =>
                            setExam(
                              e.target.value
                            )
                          }
                        >
                          <option>
                            JEE Main
                          </option>

                          <option>
                            JEE Advanced
                          </option>

                          <option>
                            WBJEE
                          </option>

                          <option>
                            NEET UG
                          </option>

                          <option>
                            CUET UG
                          </option>

                          <option>
                            BITSAT
                          </option>
                        </select>
                      </div>

                      <div>
                        <label>
                          Class
                        </label>

                        <select
                          value={
                            classNumber
                          }
                          onChange={(e) =>
                            setClassNumber(
                              e.target.value
                            )
                          }
                        >
                          <option value="11">
                            Class 11
                          </option>

                          <option value="12">
                            Class 12
                          </option>
                        </select>
                      </div>
                    </div>

                    {registrationMessage && (
                      <div
                        className={getRegistrationAlertClass()}
                      >
                        {
                          registrationMessage
                        }
                      </div>
                    )}

                    <button
                      type="submit"
                      className="auth-main-button"
                    >
                      Create Your Account
                    </button>
                  </form>
                </>
              ) : (
                <div className="registration-success">
                  <div className="success-icon">
                    ✓
                  </div>

                  <h2>
                    Registration Successful!
                  </h2>

                  <p>
                    Your PrepMind AI profile
                    has been created.
                  </p>

                  <div className="student-id-box">
                    <span>
                      Your Student ID
                    </span>

                    <strong>
                      {
                        generatedStudentId
                      }
                    </strong>
                  </div>

                  {registeredEmailForLogin && (
                    <p>
                      Login using:
                      <br />

                      <strong>
                        {
                          registeredEmailForLogin
                        }
                      </strong>
                    </p>
                  )}

                  <button
                    className="auth-main-button"
                    onClick={() => {
                      setLoginEmail(
                        registeredEmailForLogin
                      );

                      setGeneratedStudentId(
                        ""
                      );

                      setRegistrationMessage(
                        ""
                      );

                      setActivePage(
                        "Login"
                      );
                    }}
                  >
                    Continue to Login
                  </button>
                </div>
              )}

              <div className="switch-auth">
                Already have an account?{" "}
                <button
                  onClick={() => {
                    setRegistrationMessage(
                      ""
                    );

                    setGeneratedStudentId(
                      ""
                    );

                    setActivePage(
                      "Login"
                    );
                  }}
                >
                  Login
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // ==================================================
    // FORGOT PASSWORD
    // ==================================================

    if (
      activePage ===
      "Forgot Password"
    ) {
      return (
        <div className="auth-page">
          <div className="blob blob-peach"></div>
          <div className="blob blob-pink"></div>
          <div className="blob blob-blue"></div>
          <div className="blob blob-lilac"></div>

          <div className="auth-card">
            <div className="auth-header">
              <div className="brand-mark">
                P
              </div>

              <div>
                <h1>
                  PREPMIND AI
                </h1>

                <p>
                  Reset your account
                  password
                </p>
              </div>
            </div>

            <div className="auth-body">
              <h2>
                Forgot Password?
              </h2>

              <p className="auth-description">
                Enter your registered email
                to receive a password reset
                link.
              </p>

              <form
                onSubmit={
                  handleForgotPassword
                }
              >
                <label>
                  Registered Email
                </label>

                <input
                  type="email"
                  placeholder="Enter your email"
                  value={forgotEmail}
                  onChange={(e) =>
                    setForgotEmail(
                      e.target.value
                    )
                  }
                />

                {resetMessage && (
                  <div
                    className={getResetAlertClass()}
                  >
                    {resetMessage}
                  </div>
                )}

                <button
                  type="submit"
                  className="auth-main-button"
                  disabled={sendingReset}
                >
                  {sendingReset
                    ? "Sending..."
                    : "Send Reset Link"}
                </button>
              </form>

              <div className="switch-auth">
                Remember your password?{" "}
                <button
                  onClick={() =>
                    setActivePage(
                      "Login"
                    )
                  }
                >
                  Login
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // ==================================================
    // RESET PASSWORD
    // ==================================================

    if (
      activePage ===
      "Reset Password"
    ) {
      return (
        <div className="auth-page">
          <div className="blob blob-peach"></div>
          <div className="blob blob-pink"></div>
          <div className="blob blob-blue"></div>
          <div className="blob blob-lilac"></div>

          <div className="auth-card">
            <div className="auth-header">
              <div className="brand-mark">
                P
              </div>

              <div>
                <h1>
                  PREPMIND AI
                </h1>

                <p>
                  Create a new secure
                  password
                </p>
              </div>
            </div>

            <div className="auth-body">
              <h2>
                Reset Password
              </h2>

              <p className="auth-description">
                Enter your new password
                below.
              </p>

              <form
                onSubmit={
                  handleResetPassword
                }
              >
                <label>
                  New Password
                </label>

                <input
                  type="password"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) =>
                    setNewPassword(
                      e.target.value
                    )
                  }
                />

                <label>
                  Confirm Password
                </label>

                <input
                  type="password"
                  placeholder="Confirm new password"
                  value={
                    confirmNewPassword
                  }
                  onChange={(e) =>
                    setConfirmNewPassword(
                      e.target.value
                    )
                  }
                />

                {resetMessage && (
                  <div
                    className={getResetAlertClass()}
                  >
                    {resetMessage}
                  </div>
                )}

                <button
                  type="submit"
                  className="auth-main-button"
                  disabled={
                    resettingPassword
                  }
                >
                  {resettingPassword
                    ? "Resetting..."
                    : "Reset Password"}
                </button>
              </form>
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  // ==================================================
  // SIDEBAR
  // ==================================================

  const renderSidebar = () => {
    const pages = [
      "Dashboard",
      "Learning",
      "My Courses",
      "Practice",
      "Live Classes",
      "Progress",
      "Profile",
    ];

    return (
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="sidebar-logo">
            P
          </div>

          <div>
            <h2>
              PrepMind AI
            </h2>

            <span>
              Learn Smarter
            </span>
          </div>
        </div>

        <nav>
          {pages.map((page) => (
            <button
              key={page}
              className={
                activePage === page
                  ? "nav-button active"
                  : "nav-button"
              }
              onClick={() => {
                if (
                  page !== "Practice"
                ) {
                  resetPractice();
                }

                setActivePage(page);
              }}
            >
              {page}
            </button>
          ))}

          <button
            className="nav-button logout-button"
            onClick={handleLogout}
          >
            Logout
          </button>
        </nav>
      </aside>
    );
  };

  // ==================================================
  // DASHBOARD
  // ==================================================

  const renderDashboard = () => {
    const overallProgress =
      progressData?.overall_progress ??
      progressData?.progress ??
      0;

    const averageScore =
      progressData?.average_score ??
      progressData?.avg_score ??
      0;

    const questionsSolved =
      progressData?.questions_solved ??
      progressData?.total_questions ??
      0;

    const streak =
      progressData?.study_streak ??
      progressData?.streak ??
      progressData?.current_streak ??
      0;

    return (
      <>
        <div className="dashboard-topbar">
          <div>
            <h1>
              Welcome back,{" "}
              {studentName}! 👋
            </h1>

            <p>
              Your personalized learning
              dashboard
            </p>
          </div>

          <div className="exam-selector">
            <label>
              Target Exam
            </label>

            <select
              value={selectedExam}
              onChange={(e) =>
                setSelectedExam(
                  e.target.value
                )
              }
            >
              <option>
                JEE Main
              </option>

              <option>
                JEE Advanced
              </option>

              <option>
                WBJEE
              </option>

              <option>
                NEET UG
              </option>

              <option>
                CUET UG
              </option>

              <option>
                BITSAT
              </option>
            </select>
          </div>
        </div>

        <section>
          <div className="page-header">
            <div>
              <h2>
                Your Learning Overview
              </h2>

              <p>
                Track your progress and
                keep improving.
              </p>
            </div>
          </div>

          <div className="dashboard-grid">
            <div className="card">
              <span>
                Overall Progress
              </span>

              <div className="big-number">
                {overallProgress}%
              </div>

              <p>
                Keep going!
              </p>
            </div>

            <div className="card">
              <span>
                Average Score
              </span>

              <div className="big-number">
                {averageScore}%
              </div>

              <p>
                Your recent performance
              </p>
            </div>

            <div className="card">
              <span>
                Questions Solved
              </span>

              <div className="big-number">
                {questionsSolved}
              </div>

              <p>
                Practice makes progress
              </p>
            </div>

            <div className="card">
              <span>
                Learning Streak
              </span>

              <div className="big-number">
                {streak}
              </div>

              <p>
                Days
              </p>
            </div>
          </div>
        </section>

        <section>
          <div className="page-header">
            <div>
              <h2>
                Select Your Exam
              </h2>

              <p>
                PrepMind AI supports multiple
                competitive exams.
              </p>
            </div>
          </div>

          <div className="exam-cards">
            {[
              "JEE Main",
              "JEE Advanced",
              "WBJEE",
              "NEET UG",
              "CUET UG",
              "BITSAT",
            ].map(
              (examName) => (
                <button
                  key={examName}
                  className={
                    selectedExam ===
                    examName
                      ? "exam-card selected"
                      : "exam-card"
                  }
                  onClick={() =>
                    setSelectedExam(
                      examName
                    )
                  }
                >
                  <strong>
                    {examName}
                  </strong>

                  <span>
                    Personalized
                    preparation
                  </span>
                </button>
              )
            )}
          </div>
        </section>

        <section>
          <div className="page-header">
            <div>
              <h2>
                AI Recommendations
              </h2>

              <p>
                Personalized content based
                on your learning behavior.
              </p>
            </div>
          </div>

          {loadingRecommendations ? (
            <div className="loading">
              Loading your
              recommendations...
            </div>
          ) : recommendations.length ===
            0 ? (
            <div className="empty-state">
              <h3>
                No recommendations
                available yet
              </h3>

              <p>
                Complete learning activities
                to receive personalized
                recommendations.
              </p>
            </div>
          ) : (
            <div className="content-grid">
              {recommendations.map(
                (item, index) => (
                  <div
                    className="content-card"
                    key={
                      item.content_id ||
                      item.id ||
                      index
                    }
                  >
                    <div className="content-card-top">
                      <span className="content-badge">
                        {item.content_type ||
                          item.type ||
                          "Learning"}
                      </span>

                      <span className="difficulty-badge">
                        {item.difficulty ||
                          "Medium"}
                      </span>
                    </div>

                    <h3>
                      {item.topic ||
                        item.title ||
                        item.content_id ||
                        "Recommended Content"}
                    </h3>

                    <p>
                      {item.subject ||
                        "Personalized learning content"}
                    </p>

                    <div className="recommendation-score">
                      AI Score:{" "}
                      {Number(
                        item.hybrid_score ||
                          0
                      ).toFixed(2)}
                    </div>

                    {item.reason && (
                      <p className="recommendation-reason">
                        {item.reason}
                      </p>
                    )}

                    <button
                      className="primary-button"
                      onClick={() =>
                        openLearning(
                          String(item.subject || "Physics").trim(),
                          item.topic || item.title || ""
                        )
                      }
                    >
                      Start Learning
                    </button>
                  </div>
                )
              )}
            </div>
          )}
        </section>

      </>
    );
  };

  // ==================================================
  // LEARNING MODULE — NOTES AND VIDEO LECTURES
  // ==================================================

  const renderLearning = () => {
    const subjects = getSubjectsForExam(selectedExam);
    const chapters = getChaptersForExam(selectedExam, learningSubject);
    const currentChapter = chapters.includes(learningChapter) ? learningChapter : (chapters[0] || "");
    const status = chapterProgress.find((item) => item.subject === learningSubject && item.chapter === currentChapter);
    const notes = getChapterNotes(learningSubject, currentChapter);
    const videoSearch = `${selectedExam} ${learningSubject} ${currentChapter} full chapter lecture`;
    const videoSearchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(videoSearch)}`;
    const selectedLearningVideo = learningVideos.find((video) => video.video_id === selectedLearningVideoId);
    const subjectChapters = chapters.length;
    const completedChapters = chapters.filter((chapter) => chapterProgress.some((item) => item.subject === learningSubject && item.chapter === chapter && item.completed)).length;
    const chapterPracticeCount = practiceQuestionBank.filter((question) => question.subject === learningSubject && question.chapter === currentChapter).length;

    return (
      <>
        <div className="page-header">
          <div>
            <h1>Learning Centre</h1>
            <p>{selectedExam} · In-app chapter notes, video lectures and saved progress</p>
          </div>
          <button className="secondary-button" onClick={() => setActivePage("Dashboard")}>Back to Dashboard</button>
        </div>

        <div className="practice-overview-banner">
          <div>
            <h2>Learn chapter by chapter</h2>
            <p>Select a subject and chapter. Read the revision notes, watch a lecture, and mark the chapter complete when you finish.</p>
          </div>
          <div className="practice-total-badge">{subjects.length} Subjects</div>
        </div>

        <div className="exam-cards" style={{ marginBottom: 22 }}>
          {subjects.map((subject) => {
            const subjectChapters = getChaptersForExam(selectedExam, subject);
            const subjectCompleted = subjectChapters.filter((chapter) => chapterProgress.some((item) => item.subject === subject && item.chapter === chapter && item.completed)).length;
            return (
              <button key={subject} className={learningSubject === subject ? "exam-card selected" : "exam-card"}
                onClick={() => { setLearningSubject(subject); setLearningChapter(subjectChapters[0] || ""); }}>
                <strong>{subject}</strong>
                <span>{subjectCompleted}/{subjectChapters.length} chapters completed</span>
              </button>
            );
          })}
        </div>

        <section className="content-card" style={{ marginBottom: 22 }}>
          <div className="page-header">
            <div>
              <h2>{learningSubject}</h2>
              <p>{completedChapters} of {subjectChapters} chapters completed</p>
            </div>
            <span className="content-badge">{subjectChapters ? Math.round((completedChapters / subjectChapters) * 100) : 0}% complete</span>
          </div>
          <div className="progress-bar" style={{ marginBottom: 18 }}>
            <div className="progress-fill" style={{ width: `${subjectChapters ? (completedChapters / subjectChapters) * 100 : 0}%` }} />
          </div>
          {loadingChapterProgress && <p className="loading">Loading saved chapter progress...</p>}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: 10 }}>
            {chapters.map((chapter, index) => {
              const chapterStatus = chapterProgress.find((item) => item.subject === learningSubject && item.chapter === chapter);
              const selected = chapter === currentChapter;
              return (
                <button key={chapter} type="button" onClick={() => setLearningChapter(chapter)}
                  style={{ textAlign: "left", border: selected ? "2px solid #7563a8" : "1px solid #e5e1ed", background: selected ? "#f5f1ff" : "#fff", borderRadius: 12, padding: 13, cursor: "pointer", color: "#302a43" }}>
                  <strong>{index + 1}. {chapter}</strong>
                  <span style={{ display: "block", marginTop: 6, fontSize: 12, color: chapterStatus?.completed ? "#16805d" : "#777" }}>{chapterStatus?.completed ? "✓ Completed" : "Not completed"}</span>
                </button>
              );
            })}
          </div>
        </section>

        {currentChapter ? (
          <>
            <section className="content-card" style={{ marginBottom: 22 }}>
              <div className="page-header">
                <div>
                  <span className="content-badge">CHAPTER NOTES</span>
                  <h2 style={{ marginTop: 10 }}>{currentChapter}</h2>
                  <p>{learningSubject} · {selectedExam}</p>
                </div>
                <span className="difficulty-badge">Revision material</span>
              </div>
              <p style={{ lineHeight: 1.8 }}>{notes.overview}</p>
              <h3>Key concepts</h3>
              <ol style={{ paddingLeft: 22, lineHeight: 1.9 }}>
                {notes.concepts.map((point, index) => <li key={index} style={{ marginBottom: 7 }}>{point}</li>)}
              </ol>
              {notes.formulas.length > 0 && <>
                <h3>Important formulas / relations</h3>
                <ul style={{ paddingLeft: 22, lineHeight: 1.9 }}>
                  {notes.formulas.map((formula, index) => <li key={index}><code>{formula}</code></li>)}
                </ul>
              </>}
              <div style={{ background: "#f7f5fb", borderRadius: 10, padding: 14, marginTop: 14 }}>
                <strong>Exam focus</strong>
                <p style={{ marginBottom: 0, lineHeight: 1.7 }}>{notes.examFocus}</p>
              </div>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 18 }}>
                <button className="primary-button" onClick={() => saveChapterCompletion(learningSubject, currentChapter, !status?.completed)} disabled={savingChapter === `${learningSubject}::${currentChapter}`}>
                  {savingChapter === `${learningSubject}::${currentChapter}` ? "Saving..." : status?.completed ? "Mark as Incomplete" : "Mark as Completed"}
                </button>
                <button className="secondary-button" onClick={() => startPractice(learningSubject, chapterPracticeCount > 0 ? currentChapter : "")} disabled={!practiceQuestionBank.some((question) => question.subject === learningSubject)}>
                  {chapterPracticeCount > 0 ? "Practice This Chapter" : "Practice This Subject"}
                </button>
              </div>
            </section>

            <section className="content-card" style={{ marginBottom: 22 }}>
              <div className="page-header">
                <div>
                  <span className="content-badge">VIDEO LECTURE</span>
                  <h2 style={{ marginTop: 10 }}>Watch {currentChapter}</h2>
                  <p>Embedded YouTube lecture search for this exact subject and chapter.</p>
                </div>
              </div>
              {loadingLearningVideos ? (
                <p className="loading">Searching YouTube for embeddable {learningSubject} lectures on {currentChapter}...</p>
              ) : learningVideoError ? (
                <div className="empty-state" style={{ marginBottom: 14 }}>
                  <p style={{ marginBottom: 8 }}>No embedded lecture is available right now. You can watch lectures for this chapter directly on YouTube.</p>
                  <a href={videoSearchUrl} target="_blank" rel="noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 16px", borderRadius: 8, background: "#7563a8", color: "#fff", textDecoration: "none", fontWeight: 600 }}>
                    Redirect to YouTube <span aria-hidden="true">↗</span>
                  </a>
                </div>
              ) : null}

              {selectedLearningVideo ? (
                <>
                  <div style={{ position: "relative", width: "100%", paddingTop: "56.25%", overflow: "hidden", borderRadius: 12, background: "#15131b" }}>
                    <iframe key={selectedLearningVideo.video_id} title={selectedLearningVideo.title || `${learningSubject} ${currentChapter} video lecture`} src={`https://www.youtube.com/embed/${selectedLearningVideo.video_id}`} loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }} />
                  </div>
                  <p style={{ marginTop: 10, marginBottom: 12 }}><strong>{selectedLearningVideo.title}</strong> · {selectedLearningVideo.channel_title}</p>
                  {learningVideos.length > 1 && (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 10 }}>
                      {learningVideos.map((video) => (
                        <button key={video.video_id} type="button" onClick={() => setSelectedLearningVideoId(video.video_id)}
                          style={{ display: "flex", gap: 10, alignItems: "center", textAlign: "left", padding: 10, borderRadius: 10, border: selectedLearningVideoId === video.video_id ? "2px solid #7563a8" : "1px solid #e5e1ed", background: selectedLearningVideoId === video.video_id ? "#f5f1ff" : "#fff", cursor: "pointer", color: "#302a43" }}>
                          {video.thumbnail_url && <img src={video.thumbnail_url} alt="" style={{ width: 100, aspectRatio: "16 / 9", objectFit: "cover", borderRadius: 6, flexShrink: 0 }} />}
                          <span><strong style={{ display: "block", fontSize: 13 }}>{video.title}</strong><small style={{ display: "block", marginTop: 4, color: "#777" }}>{video.channel_title}</small></span>
                        </button>
                      ))}
                    </div>
                  )}
                </>
              ) : null}
              {!selectedLearningVideo && !loadingLearningVideos ? null : <p style={{ marginTop: 12 }}>Want to see more lectures? <a href={videoSearchUrl} target="_blank" rel="noreferrer">Search this chapter directly on YouTube</a>.</p>}
            </section>
          </>
        ) : <div className="empty-state"><h3>No chapters found</h3><p>Choose another subject or check the exam syllabus catalog.</p></div>}
      </>
    );
  };

  // ==================================================
  // MY COURSES
  // ==================================================

  const renderCourses = () => {
    return (
      <MyCourses
        student={loggedInStudent}
        selectedExam={
          selectedExam ||
          loggedInStudent?.exam ||
          "JEE Main"
        }
        onStartPractice={(subject) => {
          setActivePage("Practice");
          startPractice(subject);
        }}
      />
    );
  };

  // ==================================================
  // PRACTICE
  // ==================================================

  const renderPractice = () => {
    // ==================================================
    // RESULT SCREEN
    // ==================================================

    if (
      practiceStarted &&
      practiceSubmitted
    ) {
      const totalQuestions =
        practiceQuestions.length;

      const percentage =
        totalQuestions > 0
          ? Math.round(
              (practiceScore /
                totalQuestions) *
                100
            )
          : 0;

      const answeredCount =
        practiceQuestions.filter(
          (question) =>
            isQuestionAnswered(
              question
            )
        ).length;

      const reviewCount =
        practiceQuestions.filter(
          (question) =>
            markedForReview[
              question.id
            ]
        ).length;

      return (
        <>
          <div className="page-header">
            <div>
              <h1>
                Practice Complete 🎉
              </h1>

              <p>
                Great work! Here is your
                practice result.
              </p>
            </div>
          </div>

          <div className="practice-result">
            <div className="practice-result-icon">
              ✓
            </div>

            <h2>
              {practiceSubject} Practice
            </h2>

            <div className="practice-score">
              {practiceScore} /{" "}
              {totalQuestions}
            </div>

            <p className="practice-percentage">
              You scored {percentage}%
            </p>

            <div className="practice-result-stats">
              <div>
                <strong>
                  {answeredCount}
                </strong>

                <span>
                  Answered
                </span>
              </div>

              <div>
                <strong>
                  {totalQuestions -
                    answeredCount}
                </strong>

                <span>
                  Unanswered
                </span>
              </div>

              <div>
                <strong>
                  {reviewCount}
                </strong>

                <span>
                  Marked for Review
                </span>
              </div>
            </div>

            <p>
              {percentage >= 80
                ? "Excellent performance! Keep it up."
                : percentage >= 60
                ? "Good job! A little more practice will make you stronger."
                : "Keep practicing. You will improve with every attempt."}
            </p>

            <div className="feedback-actions">
              <button
                className="primary-button"
                onClick={() =>
                  startPractice(practiceSubject, practiceChapter)
                }
              >
                Practice Again
              </button>

              <button
                className="primary-button"
                onClick={
                  resetPractice
                }
              >
                Back to Practice
              </button>
            </div>
          </div>
        </>
      );
    }

    // ==================================================
    // ACTIVE QUIZ
    // ==================================================

    if (
      practiceStarted &&
      practiceQuestions.length > 0
    ) {
      const currentQuestion =
        practiceQuestions[
          currentQuestionIndex
        ];

      if (!currentQuestion) {
        return null;
      }

      const currentAnswer =
        practiceAnswers[
          currentQuestion.id
        ];

      const isLastQuestion =
        currentQuestionIndex ===
        practiceQuestions.length - 1;

      const answeredCount =
        practiceQuestions.filter(
          (question) =>
            isQuestionAnswered(
              question
            )
        ).length;

      const reviewCount =
        practiceQuestions.filter(
          (question) =>
            markedForReview[
              question.id
            ]
        ).length;

      return (
        <div className="practice-container">
          {/* ==============================================
              TEST HEADER
             ============================================== */}

          <div className="practice-test-header">
            <div>
              <h1>
                {practiceSubject} Practice
              </h1>

              <p>
                Question{" "}
                {currentQuestionIndex +
                  1}{" "}
                of{" "}
                {practiceQuestions.length}
              </p>
              <p className="practice-timer" role="timer" aria-live="off">
                Time Remaining: {String(Math.floor(practiceTimeLeft / 60)).padStart(2, "0")}:{String(practiceTimeLeft % 60).padStart(2, "0")}
              </p>
            </div>

            <button
              className="exit-practice-button"
              onClick={
                resetPractice
              }
            >
              Exit Practice
            </button>
          </div>

          {/* ==============================================
              TEST STATS
             ============================================== */}

          <div className="practice-status-summary">
            <div>
              <strong>
                {answeredCount}
              </strong>

              <span>
                Answered
              </span>
            </div>

            <div>
              <strong>
                {practiceQuestions.length -
                  answeredCount}
              </strong>

              <span>
                Unanswered
              </span>
            </div>

            <div>
              <strong>
                {reviewCount}
              </strong>

              <span>
                Review
              </span>
            </div>
          </div>

          {/* ==============================================
              MAIN TEST LAYOUT
             ============================================== */}

          <div className="practice-test-layout">
            {/* ============================================
                QUESTION AREA
               ============================================ */}

            <div className="practice-question-card">
              <div className="practice-question-header">
                <span className="practice-subject">
                  {currentQuestion.subject}{practiceChapter ? ` · ${practiceChapter}` : ""}
                </span>

                <span className="practice-type-badge">
                  {currentQuestion.type}
                </span>

                <span className="practice-question-number">
                  Question{" "}
                  {currentQuestionIndex +
                    1}
                </span>
              </div>

              <div className="practice-question-instruction">
                {currentQuestion.type ===
                  "MCQ" &&
                  "Choose the single correct answer."}

                {currentQuestion.type ===
                  "Multiple Correct" &&
                  "Select all correct answers."}

                {currentQuestion.type ===
                  "Numerical" &&
                  "Enter your numerical answer."}
              </div>

              <h2 className="practice-question-text">
                {
                  currentQuestion.question
                }
              </h2>

              {/* MCQ */}

              {currentQuestion.type ===
                "MCQ" && (
                <div className="practice-options">
                  {currentQuestion.options.map(
                    (option, index) => (
                      <button
                        key={index}
                        type="button"
                        className={
                          currentAnswer ===
                          option
                            ? "practice-option selected"
                            : "practice-option"
                        }
                        onClick={() =>
                          handlePracticeAnswer(
                            currentQuestion.id,
                            option
                          )
                        }
                      >
                        <span className="practice-option-letter">
                          {String.fromCharCode(
                            65 + index
                          )}
                        </span>

                        <span>
                          {option}
                        </span>
                      </button>
                    )
                  )}
                </div>
              )}

              {/* MULTIPLE CORRECT */}

              {currentQuestion.type ===
                "Multiple Correct" && (
                <div className="practice-options">
                  {currentQuestion.options.map(
                    (option, index) => {
                      const selected =
                        Array.isArray(
                          currentAnswer
                        ) &&
                        currentAnswer.includes(
                          option
                        );

                      return (
                        <button
                          key={index}
                          type="button"
                          className={
                            selected
                              ? "practice-option selected multiple"
                              : "practice-option multiple"
                          }
                          onClick={() =>
                            handleMultipleAnswer(
                              currentQuestion.id,
                              option
                            )
                          }
                        >
                          <span className="practice-option-checkbox">
                            {selected
                              ? "✓"
                              : ""}
                          </span>

                          <span className="practice-option-letter">
                            {String.fromCharCode(
                              65 + index
                            )}
                          </span>

                          <span>
                            {option}
                          </span>
                        </button>
                      );
                    }
                  )}
                </div>
              )}

              {/* NUMERICAL */}

              {currentQuestion.type ===
                "Numerical" && (
                <div className="numerical-answer-box">
                  <label>
                    Your Answer
                  </label>

                  <input
                    type="number"
                    step="any"
                    placeholder="Enter numerical answer"
                    value={
                      currentAnswer ||
                      ""
                    }
                    onChange={(e) =>
                      handleNumericalAnswer(
                        currentQuestion.id,
                        e.target.value
                      )
                    }
                  />

                  <p>
                    Enter only the numerical
                    value.
                  </p>
                </div>
              )}

              {/* QUESTION ACTIONS */}

              <div className="practice-question-actions">
                <button
                  type="button"
                  className={
                    markedForReview[
                      currentQuestion.id
                    ]
                      ? "practice-review-button marked"
                      : "practice-review-button"
                  }
                  onClick={() =>
                    toggleMarkForReview(
                      currentQuestion.id
                    )
                  }
                >
                  {markedForReview[
                    currentQuestion.id
                  ]
                    ? "★ Marked for Review"
                    : "☆ Mark for Review"}
                </button>

                <button
                  type="button"
                  className="practice-clear-button"
                  onClick={
                    clearCurrentAnswer
                  }
                  disabled={
                    !isQuestionAnswered(
                      currentQuestion
                    )
                  }
                >
                  Clear Answer
                </button>
              </div>

              {/* NAVIGATION */}

              <div className="practice-navigation">
                <button
                  type="button"
                  className="practice-nav-button"
                  disabled={
                    currentQuestionIndex ===
                    0
                  }
                  onClick={() =>
                    setCurrentQuestionIndex(
                      (previousIndex) =>
                        previousIndex - 1
                    )
                  }
                >
                  ← Previous
                </button>

                <button
                  type="button"
                  className="practice-next-button"
                  disabled={practiceSubmitting}
                  onClick={() => {
                    if (isLastQuestion) {
                      submitPractice();
                    } else {
                      setCurrentQuestionIndex(
                        (previousIndex) => previousIndex + 1
                      );
                    }
                  }}
                >
                  {isLastQuestion
                    ? practiceSubmitting
                      ? "Saving..."
                      : "Submit Test"
                    : "Save & Next →"}
                </button>
              </div>
            </div>

            {/* QUESTION PALETTE */}

            <div className="question-palette-card">
              <div className="question-palette-header">
                <h3>
                  Question Palette
                </h3>

                <span>
                  {
                    practiceQuestions.length
                  }{" "}
                  Questions
                </span>
              </div>

              <div className="question-status-legend">
                <div>
                  <span className="legend-box unanswered"></span>

                  <span>
                    Unanswered
                  </span>
                </div>

                <div>
                  <span className="legend-box answered"></span>

                  <span>
                    Answered
                  </span>
                </div>

                <div>
                  <span className="legend-box review"></span>

                  <span>
                    Marked for Review
                  </span>
                </div>

                <div>
                  <span className="legend-box answered-review"></span>

                  <span>
                    Answered + Review
                  </span>
                </div>
              </div>

              <div className="question-palette-grid">
                {practiceQuestions.map(
                  (
                    question,
                    index
                  ) => {
                    const status =
                      getQuestionStatus(
                        question
                      );

                    const isCurrent =
                      index ===
                      currentQuestionIndex;

                    return (
                      <button
                        key={
                          question.id
                        }
                        type="button"
                        className={`question-palette-button ${status} ${
                          isCurrent
                            ? "current"
                            : ""
                        }`}
                        onClick={() =>
                          setCurrentQuestionIndex(
                            index
                          )
                        }
                        title={`Question ${
                          index + 1
                        } - ${
                          question.type
                        }`}
                      >
                        {index + 1}
                      </button>
                    );
                  }
                )}
              </div>

              <div className="palette-bottom-info">
                <div>
                  <span>
                    Current:
                  </span>

                  <strong>
                    Q
                    {currentQuestionIndex +
                      1}
                  </strong>
                </div>

                <div>
                  <span>
                    Remaining:
                  </span>

                  <strong>
                    {
                      practiceQuestions.length -
                        answeredCount
                    }
                  </strong>
                </div>
              </div>

              <button
                type="button"
                className="palette-submit-button"
                onClick={submitPractice}
                disabled={practiceSubmitting || practiceSubmitted}
              >
                {practiceSubmitting ? "Saving..." : "Submit Test"}
              </button>
            </div>
          </div>
        </div>
      );
    }

    // ==================================================
    // PRACTICE SUBJECT SELECTION
    // ==================================================

    const examSubjects = getSubjectsForExam(selectedExam);
    const practiceItems = examSubjects.map((subject) => ({
      subject,
      title: `${subject} Practice`,
      description: `Practice ${subject} topics and chapter-wise questions for ${selectedExam}.`,
      count: usesServerPractice(selectedExam, subject)
        ? Object.values(serverPracticeCounts[subject] || {}).reduce((total, n) => total + n, 0)
        : practiceQuestionBank.filter((question) => question.subject === subject).length,
      chapters: getChaptersForExam(selectedExam, subject),
    }));

    return (
      <>
        <div className="page-header">
          <div>
            <h1>
              Practice
            </h1>

            <p>
              Strengthen your concepts with
              focused practice.
            </p>
          </div>
        </div>

        <div className="practice-overview-banner">
          <div>
            <h2>
              {selectedExam} Practice
            </h2>

            <p>
              Choose any subject and explore its chapters. Available question banks are shown on each subject card.
            </p>
          </div>

          <div className="practice-total-badge">
            {practiceItems.reduce((total, item) => total + item.count, 0)} Available Questions
          </div>
        </div>

        <div className="cards">
          {practiceItems.map(
            (item) => (
              <div
                className="content-card"
                key={item.title}
              >
                <span className="content-badge">
                  {item.subject}
                </span>

                <h3>
                  {item.title}
                </h3>

                <p>
                  {item.description}
                </p>

                <div className="practice-card-meta">
                  <span>{item.count} available questions</span>
                  <span>{item.chapters.length} syllabus chapters</span>
                </div>

                <details style={{ margin: "12px 0" }}>
                  <summary style={{ cursor: "pointer", fontWeight: 600 }}>View chapters and practice</summary>
                  <ul style={{ paddingLeft: 20, lineHeight: 1.9 }}>
                    {item.chapters.map((chapter) => {
                      const chapterCount = usesServerPractice(selectedExam, item.subject)
                        ? (serverPracticeCounts[item.subject]?.[chapter] || 0)
                        : getPracticeQuestions(item.subject, chapter).length;
                      return (
                        <li key={chapter} style={{ marginBottom: 6 }}>
                          <span>{chapter} ({chapterCount} questions)</span>{" "}
                          {chapterCount > 0 && <button type="button" className="primary-button" style={{ marginLeft: 8, padding: "5px 10px" }} onClick={() => startPractice(item.subject, chapter)}>Practice</button>}
                        </li>
                      );
                    })}
                  </ul>
                </details>

                <button
                  className="primary-button"
                  disabled={item.count === 0}
                  onClick={() => startPractice(item.subject)}
                  title={item.count === 0 ? "Question bank is being prepared" : "Start practice"}
                >
                  {item.count > 0 ? "Start Practice" : "Questions Coming Soon"}
                </button>
              </div>
            )
          )}
        </div>
      </>
    );
  };

  // ==================================================
  // LIVE CLASSES
  // ==================================================

  const renderLiveClasses = () => {
    return (
      <>
        <div className="page-header">
          <div>
            <h1>
              Live Classes
            </h1>

            <p>
              Join interactive classes and
              upcoming sessions.
            </p>
          </div>
        </div>

        <div className="cards">
          <div className="content-card">
            <span className="live-badge">
              ● LIVE NOW
            </span>

            <h3>
              Physics — Mechanics
            </h3>

            <p>
              Interactive problem-solving
              session.
            </p>

            <button
              className="primary-button"
              onClick={() =>
                setActivePage(
                  "Dashboard"
                )
              }
            >
              Join Class
            </button>
          </div>

          <div className="content-card">
            <span className="upcoming-badge">
              UPCOMING
            </span>

            <h3>
              Mathematics — Calculus
            </h3>

            <p>
              Scheduled for tomorrow.
            </p>
          </div>

          <div className="content-card">
            <span className="upcoming-badge">
              UPCOMING
            </span>

            <h3>
              Chemistry — Organic
            </h3>

            <p>
              Scheduled for this weekend.
            </p>
          </div>
        </div>
      </>
    );
  };

  // ==================================================
  // PROGRESS
  // ==================================================

  const renderProgress = () => {
    const overallProgress =
      progressData?.overall_progress ??
      progressData?.progress ??
      0;

    const averageScore =
      progressData?.average_score ??
      progressData?.avg_score ??
      0;

    const questionsSolved =
      progressData?.questions_solved ??
      progressData?.total_questions ??
      0;

    const streak =
      progressData?.study_streak ??
      progressData?.streak ??
      progressData?.current_streak ??
      0;

    return (
      <>
        <div className="page-header">
          <div>
            <h1>
              Your Progress
            </h1>

            <p>
              Track your learning journey
              and performance.
            </p>
          </div>
        </div>

        {loadingProgress ? (
          <div className="loading">
            Loading progress...
          </div>
        ) : (
          <>
            <div className="dashboard-grid">
              <div className="card">
                <span>
                  Overall Progress
                </span>

                <div className="big-number">
                  {overallProgress}%
                </div>
              </div>

              <div className="card">
                <span>
                  Average Score
                </span>

                <div className="big-number">
                  {averageScore}%
                </div>
              </div>

              <div className="card">
                <span>
                  Questions Solved
                </span>

                <div className="big-number">
                  {questionsSolved}
                </div>
              </div>

              <div className="card">
                <span>
                  Current Streak
                </span>

                <div className="big-number">
                  {streak}
                </div>
              </div>
            </div>

            <section>
              <div className="page-header">
                <div>
                  <h2>
                    Subject Progress
                  </h2>
                </div>
              </div>

              <div className="cards">
                {getSubjectsForExam(selectedExam).map((subject) => {
                  const chapters = getChaptersForExam(selectedExam, subject);
                  const completed = chapters.filter((chapter) => chapterProgress.some((item) => item.subject === subject && item.chapter === chapter && item.completed)).length;
                  const value = chapters.length ? Math.round((completed / chapters.length) * 100) : 0;
                  return (
                    <div className="content-card" key={subject}>
                      <h3>{subject}</h3>
                      <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${value}%` }}></div>
                      </div>
                      <strong>{value}%</strong>
                      <p>{completed} of {chapters.length} chapters completed</p>
                    </div>
                  );
                })}
              </div>
            </section>

            <section>
              <div className="page-header">
                <div>
                  <h2>
                    Recent Performance
                  </h2>
                </div>
              </div>

              <div className="content-card">
                <p>
                  Your recent learning
                  performance will appear
                  here as you complete more
                  activities.
                </p>
              </div>
            </section>
          </>
        )}
      </>
    );
  };

  // ==================================================
  // PROFILE
  // ==================================================

  const renderProfile = () => {
    return (
      <>
        <div className="page-header">
          <div>
            <h1>
              My Profile
            </h1>

            <p>
              Manage your PrepMind AI
              student profile.
            </p>
          </div>
        </div>

        <div className="student-profile">
          <div className="avatar">
            {studentName
              ?.charAt(0)
              ?.toUpperCase() ||
              "S"}
          </div>

          <div>
            <h2>
              {studentName}
            </h2>

            <p>
              {loggedInStudent?.exam ||
                selectedExam}
            </p>
          </div>
        </div>

        <div className="cards">
          <div className="content-card">
            <h3>
              Student Information
            </h3>

            <p>
              <strong>
                Name:
              </strong>{" "}
              {studentName}
            </p>

            <p>
              <strong>
                Student ID:
              </strong>{" "}
              {loggedInStudent?.student_id ||
                "N/A"}
            </p>

            <p>
              <strong>
                Email:
              </strong>{" "}
              {loggedInStudent?.email ||
                "N/A"}
            </p>

            <p>
              <strong>
                Class:
              </strong>{" "}
              {loggedInStudent?.class ||
                loggedInStudent?.class_number ||
                "N/A"}
            </p>

            <p>
              <strong>
                Target Exam:
              </strong>{" "}
              {loggedInStudent?.exam ||
                selectedExam}
            </p>
          </div>

          <div className="content-card">
            <h3>
              Learning Statistics
            </h3>

            <p>
              Questions Solved:{" "}
              {progressData?.questions_solved ||
                0}
            </p>

            <p>
              Average Score:{" "}
              {progressData?.average_score ||
                0}
              %
            </p>

            <p>
              Current Streak:{" "}
              {progressData?.study_streak ??
                progressData?.streak ??
                progressData?.current_streak ??
                0}{" "}
              days
            </p>
          </div>
        </div>
      </>
    );
  };

  // ==================================================
  // MAIN PAGE
  // ==================================================

  const renderMainPage = () => {
    switch (activePage) {
      case "Dashboard":
        return renderDashboard();

      case "Learning":
        return renderLearning();

      case "My Courses":
        return renderCourses();

      case "Practice":
        return renderPractice();

      case "Live Classes":
        return renderLiveClasses();

      case "Progress":
        return renderProgress();

      case "Profile":
        return renderProfile();

      default:
        return renderDashboard();
    }
  };

  // ==================================================
  // AUTH PAGES
  // ==================================================

  if (
    activePage === "Login" ||
    activePage === "Register" ||
    activePage ===
      "Forgot Password" ||
    activePage ===
      "Reset Password"
  ) {
    return renderAuthPage();
  }

  // ==================================================
  // APPLICATION
  // ==================================================

  return (
    <div className="app">
      {renderSidebar()}

      <main className="main-content">
        {renderMainPage()}
      </main>

    </div>
  );
}

export default App;