// JEE Main Physics — Units and Measurements
// 30 questions with answers, explanations, difficulty and provenance metadata.
// All questions are original exam-pattern practice questions.
// IDs 2001–2030 are reserved for this bank.

export const jeeMainPhysicsUnitsQuestions = [
  {
    id: 2001,
    subject: "Physics",
    chapter: "Units and Measurements",
    type: "MCQ",
    question: "Which of the following is an SI base quantity?",
    options: ["Force", "Pressure", "Electric current", "Energy"],
    answer: "Electric current",
    difficulty: "Easy",
    explanation:
      "Electric current is one of the seven SI base quantities. Force, pressure and energy are derived quantities.",
    sourceType: "Original exam-pattern"
  },
  {
    id: 2002,
    subject: "Physics",
    chapter: "Units and Measurements",
    type: "MCQ",
    question: "The dimensional formula of impulse is:",
    options: ["[MLT⁻¹]", "[MLT⁻²]", "[ML²T⁻²]", "[ML⁻¹T⁻²]"],
    answer: "[MLT⁻¹]",
    difficulty: "Medium",
    explanation:
      "Impulse = force × time = [MLT⁻²] × [T] = [MLT⁻¹]. It is also equal to the change in momentum.",
    sourceType: "Original exam-pattern"
  },
  {
    id: 2003,
    subject: "Physics",
    chapter: "Units and Measurements",
    type: "MCQ",
    question: "The dimensional formula of Planck's constant is:",
    options: ["[ML²T⁻¹]", "[ML²T⁻²]", "[MLT⁻¹]", "[M⁰L²T⁻¹]"],
    answer: "[ML²T⁻¹]",
    difficulty: "Medium",
    explanation:
      "From E = hν, h = E/ν. Therefore [h] = [ML²T⁻²]/[T⁻¹] = [ML²T⁻¹].",
    sourceType: "Original exam-pattern"
  },
  {
    id: 2004,
    subject: "Physics",
    chapter: "Units and Measurements",
    type: "MCQ",
    question:
      "If x = at + bt², where x is displacement and t is time, the dimensions of a and b respectively are:",
    options: [
      "[LT⁻¹], [LT⁻²]",
      "[LT⁻²], [LT⁻¹]",
      "[L], [LT⁻¹]",
      "[T⁻¹], [T⁻²]"
    ],
    answer: "[LT⁻¹], [LT⁻²]",
    difficulty: "Medium",
    explanation:
      "Each term must have the dimensions of displacement [L]. Thus [a][T]=[L], giving [a]=[LT⁻¹], and [b][T²]=[L], giving [b]=[LT⁻²].",
    sourceType: "Original exam-pattern"
  },
  {
    id: 2005,
    subject: "Physics",
    chapter: "Units and Measurements",
    type: "MCQ",
    question: "The number of significant figures in 0.004050 is:",
    options: ["3", "4", "5", "6"],
    answer: "4",
    difficulty: "Easy",
    explanation:
      "Leading zeros are not significant. The digits 4, 0, 5 and the final zero after the decimal are significant, so there are four significant figures.",
    sourceType: "Original exam-pattern"
  },
  {
    id: 2006,
    subject: "Physics",
    chapter: "Units and Measurements",
    type: "MCQ",
    question: "The value 12.746 rounded to three significant figures is:",
    options: ["12.7", "12.8", "12.74", "12.75"],
    answer: "12.7",
    difficulty: "Easy",
    explanation:
      "The first three significant digits are 1, 2 and 7. The next digit is 4, so the third significant digit remains unchanged.",
    sourceType: "Original exam-pattern"
  },
  {
    id: 2007,
    subject: "Physics",
    chapter: "Units and Measurements",
    type: "MCQ",
    question:
      "A length is measured as (5.2 ± 0.1) cm. The percentage error is approximately:",
    options: ["0.52%", "1.92%", "2.0%", "5.2%"],
    answer: "1.92%",
    difficulty: "Medium",
    explanation:
      "Percentage error = (absolute error / measured value) × 100 = (0.1/5.2) × 100 ≈ 1.92%.",
    sourceType: "Original exam-pattern"
  },
  {
    id: 2008,
    subject: "Physics",
    chapter: "Units and Measurements",
    type: "MCQ",
    question:
      "The dimensional formula of the universal gravitational constant G is:",
    options: [
      "[M⁻¹L³T⁻²]",
      "[ML³T⁻²]",
      "[M⁻¹L²T⁻²]",
      "[M⁻²L³T⁻¹]"
    ],
    answer: "[M⁻¹L³T⁻²]",
    difficulty: "Medium",
    explanation:
      "From F = Gm₁m₂/r², G = Fr²/(m₁m₂). Substituting dimensions gives [G] = [M⁻¹L³T⁻²].",
    sourceType: "Original exam-pattern"
  },
  {
    id: 2009,
    subject: "Physics",
    chapter: "Units and Measurements",
    type: "MCQ",
    question: "Which pair has the same dimensions?",
    options: [
      "Work and torque",
      "Force and pressure",
      "Momentum and energy",
      "Power and impulse"
    ],
    answer: "Work and torque",
    difficulty: "Easy",
    explanation:
      "Work = force × displacement and torque = force × perpendicular distance. Both have dimensions [ML²T⁻²], although they represent different physical quantities.",
    sourceType: "Original exam-pattern"
  },
  {
    id: 2010,
    subject: "Physics",
    chapter: "Units and Measurements",
    type: "MCQ",
    question: "The SI unit of the coefficient of viscosity is:",
    options: ["N m⁻¹", "Pa s", "J s", "kg m s⁻¹"],
    answer: "Pa s",
    difficulty: "Easy",
    explanation:
      "Dynamic viscosity has SI unit pascal-second (Pa s), equivalent to kg m⁻¹ s⁻¹.",
    sourceType: "Original exam-pattern"
  },
  {
    id: 2011,
    subject: "Physics",
    chapter: "Units and Measurements",
    type: "MCQ",
    question:
      "If the percentage errors in measuring mass and velocity are 2% and 3%, respectively, the maximum percentage error in kinetic energy is:",
    options: ["5%", "6%", "8%", "11%"],
    answer: "8%",
    difficulty: "Medium",
    explanation:
      "K = ½mv². For maximum fractional error, percentage errors add with powers: 2% + 2(3%) = 8%.",
    sourceType: "Original exam-pattern"
  },
  {
    id: 2012,
    subject: "Physics",
    chapter: "Units and Measurements",
    type: "MCQ",
    question:
      "A physical quantity Q is given by Q = A²B³/C. If the percentage errors in A, B and C are 1%, 2% and 1%, respectively, the maximum percentage error in Q is:",
    options: ["5%", "7%", "9%", "11%"],
    answer: "9%",
    difficulty: "Medium",
    explanation:
      "For Q = A²B³/C, maximum percentage error = 2(1%) + 3(2%) + 1(1%) = 9%.",
    sourceType: "Original exam-pattern"
  },
  {
    id: 2013,
    subject: "Physics",
    chapter: "Units and Measurements",
    type: "MCQ",
    question: "The dimensional formula of surface tension is:",
    options: ["[MT⁻²]", "[MLT⁻²]", "[ML⁻¹T⁻²]", "[M⁰LT⁻¹]"],
    answer: "[MT⁻²]",
    difficulty: "Medium",
    explanation:
      "Surface tension = force/length. Its dimensions are [MLT⁻²]/[L] = [MT⁻²].",
    sourceType: "Original exam-pattern"
  },
  {
    id: 2014,
    subject: "Physics",
    chapter: "Units and Measurements",
    type: "MCQ",
    question: "Which of the following equations is dimensionally incorrect?",
    options: [
      "v = u + at",
      "s = ut + ½at²",
      "v² = u² + 2as",
      "s = ut + ½at"
    ],
    answer: "s = ut + ½at",
    difficulty: "Easy",
    explanation:
      "In the last equation, ut has dimension [L], but at has dimension [LT⁻¹]. The terms being added must have identical dimensions.",
    sourceType: "Original exam-pattern"
  },
  {
    id: 2015,
    subject: "Physics",
    chapter: "Units and Measurements",
    type: "MCQ",
    question: "One parsec is approximately equal to:",
    options: [
      "3.08 × 10¹³ km",
      "1.50 × 10⁸ km",
      "9.46 × 10¹² km",
      "3.00 × 10⁸ km"
    ],
    answer: "3.08 × 10¹³ km",
    difficulty: "Easy",
    explanation:
      "One parsec is approximately 3.086 × 10¹⁶ m, which is 3.086 × 10¹³ km.",
    sourceType: "Original exam-pattern"
  },
  {
    id: 2016,
    subject: "Physics",
    chapter: "Units and Measurements",
    type: "MCQ",
    question: "The least count of a vernier calipers is equal to:",
    options: [
      "1 MSD + 1 VSD",
      "1 MSD − 1 VSD",
      "1 MSD × 1 VSD",
      "1 MSD / 1 VSD"
    ],
    answer: "1 MSD − 1 VSD",
    difficulty: "Easy",
    explanation:
      "For a direct vernier, least count is the difference between one main-scale division and one vernier-scale division.",
    sourceType: "Original exam-pattern"
  },
  {
    id: 2017,
    subject: "Physics",
    chapter: "Units and Measurements",
    type: "MCQ",
    question:
      "A screw gauge has pitch 1 mm and 100 divisions on its circular scale. Its least count is:",
    options: ["0.1 mm", "0.01 mm", "0.001 mm", "1 mm"],
    answer: "0.01 mm",
    difficulty: "Easy",
    explanation:
      "Least count = pitch / number of circular-scale divisions = 1 mm/100 = 0.01 mm.",
    sourceType: "Original exam-pattern"
  },
  {
    id: 2018,
    subject: "Physics",
    chapter: "Units and Measurements",
    type: "MCQ",
    question:
      "The dimensional formula of the Planck constant multiplied by frequency is the same as that of:",
    options: ["Force", "Energy", "Power", "Momentum"],
    answer: "Energy",
    difficulty: "Easy",
    explanation:
      "Planck's constant has dimensions [ML²T⁻¹] and frequency has [T⁻¹]. Their product is [ML²T⁻²], the dimensions of energy.",
    sourceType: "Original exam-pattern"
  },
  {
    id: 2019,
    subject: "Physics",
    chapter: "Units and Measurements",
    type: "MCQ",
    question:
      "If the radius of a sphere is measured with a maximum error of 2%, the maximum percentage error in its volume is:",
    options: ["2%", "4%", "6%", "8%"],
    answer: "6%",
    difficulty: "Medium",
    explanation:
      "For a sphere, V = (4/3)πr³. Therefore percentage error in volume = 3 × percentage error in radius = 6%.",
    sourceType: "Original exam-pattern"
  },
  {
    id: 2020,
    subject: "Physics",
    chapter: "Units and Measurements",
    type: "MCQ",
    question:
      "The dimensional formula of the coefficient of thermal conductivity is:",
    options: [
      "[MLT⁻³K⁻¹]",
      "[ML²T⁻²K⁻¹]",
      "[ML⁻¹T⁻²K⁻¹]",
      "[M⁰LT⁻¹K⁻¹]"
    ],
    answer: "[MLT⁻³K⁻¹]",
    difficulty: "Hard",
    explanation:
      "From heat flow per unit time = kA(ΔT)/L, k = power × length/(area × temperature). Its dimensions are [MLT⁻³K⁻¹].",
    sourceType: "Original exam-pattern"
  },
  {
    id: 2021,
    subject: "Physics",
    chapter: "Units and Measurements",
    type: "MCQ",
    question: "Which of the following is dimensionless?",
    options: ["Strain", "Stress", "Surface tension", "Young's modulus"],
    answer: "Strain",
    difficulty: "Easy",
    explanation:
      "Strain is the ratio of change in length to original length, so its dimensions cancel. Stress and Young's modulus have pressure dimensions.",
    sourceType: "Original exam-pattern"
  },
  {
    id: 2022,
    subject: "Physics",
    chapter: "Units and Measurements",
    type: "MCQ",
    question: "The dimensional formula of angular momentum is:",
    options: [
      "[ML²T⁻¹]",
      "[MLT⁻¹]",
      "[ML²T⁻²]",
      "[M⁰L²T⁻¹]"
    ],
    answer: "[ML²T⁻¹]",
    difficulty: "Medium",
    explanation:
      "Angular momentum = position vector × linear momentum. Its dimensions are [L] × [MLT⁻¹] = [ML²T⁻¹].",
    sourceType: "Original exam-pattern"
  },
  {
    id: 2023,
    subject: "Physics",
    chapter: "Units and Measurements",
    type: "MCQ",
    question: "A length is recorded as 2.50 m. The number of significant figures is:",
    options: ["2", "3", "4", "5"],
    answer: "3",
    difficulty: "Easy",
    explanation:
      "The digits 2 and 5 are significant, and the trailing zero after the decimal point is also significant. Total = three.",
    sourceType: "Original exam-pattern"
  },
  {
    id: 2024,
    subject: "Physics",
    chapter: "Units and Measurements",
    type: "MCQ",
    question: "The dimensional formula of pressure is:",
    options: [
      "[ML⁻¹T⁻²]",
      "[MLT⁻²]",
      "[ML²T⁻²]",
      "[M⁻¹LT⁻²]"
    ],
    answer: "[ML⁻¹T⁻²]",
    difficulty: "Easy",
    explanation:
      "Pressure = force/area = [MLT⁻²]/[L²] = [ML⁻¹T⁻²].",
    sourceType: "Original exam-pattern"
  },
  {
    id: 2025,
    subject: "Physics",
    chapter: "Units and Measurements",
    type: "MCQ",
    question:
      "If 10 vernier scale divisions coincide with 9 main scale divisions and 1 MSD = 1 mm, the least count is:",
    options: ["0.1 mm", "0.9 mm", "1.0 mm", "1.1 mm"],
    answer: "0.1 mm",
    difficulty: "Medium",
    explanation:
      "10 VSD = 9 MSD = 9 mm, so 1 VSD = 0.9 mm. Least count = 1 MSD − 1 VSD = 0.1 mm.",
    sourceType: "Original exam-pattern"
  },
  {
    id: 2026,
    subject: "Physics",
    chapter: "Units and Measurements",
    type: "MCQ",
    question: "The SI unit of the universal gas constant R is:",
    options: [
      "J mol⁻¹ K⁻¹",
      "J K⁻¹",
      "Pa m³",
      "N mol⁻¹"
    ],
    answer: "J mol⁻¹ K⁻¹",
    difficulty: "Easy",
    explanation:
      "From PV = nRT, R = PV/(nT). Its SI unit is J mol⁻¹ K⁻¹.",
    sourceType: "Original exam-pattern"
  },
  {
    id: 2027,
    subject: "Physics",
    chapter: "Units and Measurements",
    type: "MCQ",
    question:
      "A quantity is calculated as y = a/b. If the fractional errors in a and b are 0.02 and 0.03, the maximum fractional error in y is:",
    options: ["0.01", "0.02", "0.03", "0.05"],
    answer: "0.05",
    difficulty: "Medium",
    explanation:
      "For a quotient, maximum fractional errors add: Δy/y = Δa/a + Δb/b = 0.02 + 0.03 = 0.05.",
    sourceType: "Original exam-pattern"
  },
  {
    id: 2028,
    subject: "Physics",
    chapter: "Units and Measurements",
    type: "MCQ",
    question:
      "Which of the following cannot be obtained using dimensional analysis alone?",
    options: [
      "Checking dimensional consistency",
      "Converting units",
      "Finding a dimensionless constant in a formula",
      "Finding powers of variables in a relation"
    ],
    answer: "Finding a dimensionless constant in a formula",
    difficulty: "Hard",
    explanation:
      "Dimensional analysis can test consistency, convert units and help determine powers of variables, but it cannot determine a pure numerical dimensionless constant such as 2 or π.",
    sourceType: "Original exam-pattern"
  },
  {
    id: 2029,
    subject: "Physics",
    chapter: "Units and Measurements",
    type: "MCQ",
    question:
      "The dimensional formula of energy density (energy per unit volume) is:",
    options: [
      "[ML⁻¹T⁻²]",
      "[MLT⁻²]",
      "[ML²T⁻²]",
      "[M⁰L⁻¹T⁻²]"
    ],
    answer: "[ML⁻¹T⁻²]",
    difficulty: "Medium",
    explanation:
      "Energy density = energy/volume = [ML²T⁻²]/[L³] = [ML⁻¹T⁻²], the same dimensions as pressure.",
    sourceType: "Original exam-pattern"
  },
  {
    id: 2030,
    subject: "Physics",
    chapter: "Units and Measurements",
    type: "MCQ",
    question:
      "A stopwatch measures a time interval as 20.0 s with an uncertainty of 0.2 s. The percentage uncertainty is:",
    options: ["0.1%", "1%", "2%", "10%"],
    answer: "1%",
    difficulty: "Easy",
    explanation:
      "Percentage uncertainty = (0.2/20.0) × 100 = 1%.",
    sourceType: "Original exam-pattern"
  }
];