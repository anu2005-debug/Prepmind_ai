import React, { useEffect, useMemo, useState } from "react";

const API_BASE_URL = "http://127.0.0.1:8000";

/* =========================================================
   SYLLABUS DATA
   ========================================================= */

const syllabusData = {
  "JEE Main": {
    Physics: [
      "Units and Measurements",
      "Kinematics",
      "Laws of Motion",
      "Work, Energy and Power",
      "Rotational Motion",
      "Gravitation",
      "Properties of Solids and Liquids",
      "Thermodynamics",
      "Kinetic Theory of Gases",
      "Oscillations",
      "Waves",
      "Electrostatics",
      "Current Electricity",
      "Magnetic Effects of Current and Magnetism",
      "Electromagnetic Induction and Alternating Currents",
      "Electromagnetic Waves",
      "Optics",
      "Dual Nature of Matter and Radiation",
      "Atoms and Nuclei",
      "Electronic Devices",
      "Experimental Skills",
      "Communication Systems",
      "Semiconductor Electronics",
      "Modern Physics",
      "Properties of Matter",
      "Error Analysis"
    ],

    Mathematics: [
      "Sets, Relations and Functions",
      "Complex Numbers and Quadratic Equations",
      "Matrices and Determinants",
      "Permutations and Combinations",
      "Binomial Theorem",
      "Sequence and Series",
      "Limit, Continuity and Differentiability",
      "Integral Calculus",
      "Differential Equations",
      "Coordinate Geometry",
      "Three Dimensional Geometry",
      "Vector Algebra",
      "Statistics and Probability",
      "Trigonometry",
      "Mathematical Reasoning"
    ],

    Chemistry: [
      "Some Basic Concepts of Chemistry",
      "Atomic Structure",
      "Chemical Bonding and Molecular Structure",
      "Chemical Thermodynamics",
      "Equilibrium",
      "Redox Reactions",
      "Solutions",
      "Electrochemistry",
      "Chemical Kinetics",
      "Classification of Elements and Periodicity",
      "P-Block Elements",
      "D and F Block Elements",
      "Coordination Compounds",
      "Organic Chemistry – Basic Principles",
      "Hydrocarbons",
      "Haloalkanes and Haloarenes",
      "Alcohols, Phenols and Ethers",
      "Aldehydes, Ketones and Carboxylic Acids",
      "Amines",
      "Biomolecules",
      "Polymers",
      "Chemistry in Everyday Life",
      "Environmental Chemistry"
    ]
  },

  "JEE Advanced": {
    Physics: [
      "General Physics",
      "Units and Dimensions",
      "Kinematics",
      "Newton's Laws of Motion",
      "Work, Energy and Power",
      "Centre of Mass",
      "Rotational Motion",
      "Gravitation",
      "Properties of Matter",
      "Fluid Mechanics",
      "Thermal Physics",
      "Kinetic Theory",
      "Oscillations",
      "Waves",
      "Electrostatics",
      "Current Electricity",
      "Magnetism",
      "Electromagnetic Induction",
      "Alternating Current",
      "Electromagnetic Waves",
      "Ray Optics",
      "Wave Optics",
      "Modern Physics",
      "Atoms and Nuclei",
      "Semiconductors",
      "Experimental Physics"
    ],

    Mathematics: [
      "Sets and Relations",
      "Functions",
      "Complex Numbers",
      "Quadratic Equations",
      "Matrices and Determinants",
      "Permutations and Combinations",
      "Binomial Theorem",
      "Sequences and Series",
      "Trigonometry",
      "Limits",
      "Continuity and Differentiability",
      "Differential Calculus",
      "Integral Calculus",
      "Differential Equations",
      "Coordinate Geometry",
      "Vector Algebra",
      "Three Dimensional Geometry",
      "Probability and Statistics"
    ],

    Chemistry: [
      "Basic Concepts of Chemistry",
      "Atomic Structure",
      "Chemical Bonding",
      "States of Matter",
      "Thermodynamics",
      "Chemical Equilibrium",
      "Ionic Equilibrium",
      "Redox Reactions",
      "Electrochemistry",
      "Chemical Kinetics",
      "Periodic Table",
      "Chemical Families",
      "Coordination Chemistry",
      "Metallurgy",
      "Organic Chemistry Basics",
      "Hydrocarbons",
      "Haloalkanes",
      "Alcohols and Phenols",
      "Aldehydes and Ketones",
      "Carboxylic Acids",
      "Amines",
      "Biomolecules",
      "Polymers"
    ]
  },

  WBJEE: {
    Physics: [
      "Physical World and Measurement",
      "Kinematics",
      "Laws of Motion",
      "Work Energy and Power",
      "Rotational Motion",
      "Gravitation",
      "Properties of Matter",
      "Thermodynamics",
      "Kinetic Theory",
      "Oscillations",
      "Waves",
      "Electrostatics",
      "Current Electricity",
      "Magnetic Effects of Current",
      "Electromagnetic Induction",
      "Alternating Current",
      "Electromagnetic Waves",
      "Optics",
      "Dual Nature",
      "Atoms and Nuclei",
      "Electronic Devices",
      "Communication Systems"
    ],

    Mathematics: [
      "Algebra",
      "Complex Numbers",
      "Quadratic Equations",
      "Matrices",
      "Determinants",
      "Sequences and Series",
      "Permutations and Combinations",
      "Binomial Theorem",
      "Probability",
      "Statistics",
      "Trigonometry",
      "Coordinate Geometry",
      "Straight Lines",
      "Circles",
      "Conic Sections",
      "Calculus",
      "Differential Calculus",
      "Integral Calculus",
      "Differential Equations",
      "Vector Algebra",
      "Three Dimensional Geometry",
      "Mathematical Reasoning"
    ],

    Chemistry: [
      "Basic Concepts",
      "Atomic Structure",
      "Chemical Bonding",
      "States of Matter",
      "Thermodynamics",
      "Equilibrium",
      "Redox Reactions",
      "Solutions",
      "Electrochemistry",
      "Chemical Kinetics",
      "Periodic Table",
      "P-Block Elements",
      "D-Block Elements",
      "Coordination Compounds",
      "Organic Chemistry Basics",
      "Hydrocarbons",
      "Haloalkanes",
      "Alcohols and Phenols",
      "Aldehydes and Ketones",
      "Carboxylic Acids",
      "Amines",
      "Biomolecules"
    ]
  },

  "NEET UG": {
    Physics: [
      "Physical World and Measurement",
      "Kinematics",
      "Laws of Motion",
      "Work Energy and Power",
      "System of Particles and Rotational Motion",
      "Gravitation",
      "Properties of Bulk Matter",
      "Thermodynamics",
      "Kinetic Theory",
      "Oscillations",
      "Waves",
      "Electrostatics",
      "Current Electricity",
      "Magnetic Effects of Current",
      "Electromagnetic Induction",
      "Alternating Current",
      "Electromagnetic Waves",
      "Optics",
      "Dual Nature of Matter",
      "Atoms and Nuclei",
      "Electronic Devices"
    ],

    Chemistry: [
      "Some Basic Concepts of Chemistry",
      "Structure of Atom",
      "Classification of Elements",
      "Chemical Bonding",
      "Thermodynamics",
      "Equilibrium",
      "Redox Reactions",
      "Solutions",
      "Electrochemistry",
      "Chemical Kinetics",
      "P-Block Elements",
      "D and F Block Elements",
      "Coordination Compounds",
      "Organic Chemistry Basics",
      "Hydrocarbons",
      "Haloalkanes and Haloarenes",
      "Alcohols Phenols and Ethers",
      "Aldehydes Ketones and Carboxylic Acids",
      "Amines",
      "Biomolecules",
      "Polymers"
    ],

    Biology: [
      "Diversity in Living World",
      "Structural Organisation in Plants and Animals",
      "Cell Structure and Function",
      "Plant Physiology",
      "Human Physiology",
      "Reproduction",
      "Genetics and Evolution",
      "Ecology and Environment",
      "Biology and Human Welfare",
      "Biotechnology and Its Applications"
    ]
  }
};


/* =========================================================
   SUBJECT ICONS
   ========================================================= */

const subjectIcons = {
  Physics: "⚛",
  Mathematics: "∑",
  Chemistry: "⚗",
  Biology: "🧬"
};


/* =========================================================
   MY COURSES
   ========================================================= */

function MyCourses({ student, selectedExam }) {

  const exam =
    selectedExam ||
    student?.exam ||
    "JEE Main";

  const subjects =
    syllabusData[exam] ||
    syllabusData["JEE Main"];

  const [openSubject, setOpenSubject] = useState(null);

  const [completedChapters, setCompletedChapters] =
    useState({});

  const [loading, setLoading] = useState(true);


  /* =======================================================
     LOCAL STORAGE KEY
     ======================================================= */

  const storageKey =
    `prepmind_chapter_progress_${
      student?.student_id || "guest"
    }_${exam}`;


  /* =======================================================
     LOAD PROGRESS
     ======================================================= */

  useEffect(() => {
    loadChapterProgress();
  }, [exam, student?.student_id]);


  const loadChapterProgress = async () => {

    setLoading(true);

    try {

      if (student?.student_id) {

        const response = await fetch(
          `${API_BASE_URL}/chapter-progress/${student.student_id}?exam=${encodeURIComponent(
            exam
          )}`
        );

        if (response.ok) {

          const data =
            await response.json();

          if (
            data &&
            data.completed_chapters
          ) {

            setCompletedChapters(
              data.completed_chapters
            );

            localStorage.setItem(
              storageKey,
              JSON.stringify(
                data.completed_chapters
              )
            );

            setLoading(false);

            return;
          }
        }

      }

    } catch (error) {

      console.log(
        "Backend chapter progress unavailable."
      );

    }


    /* Fallback to localStorage */

    try {

      const saved =
        localStorage.getItem(
          storageKey
        );

      if (saved) {

        setCompletedChapters(
          JSON.parse(saved)
        );

      } else {

        setCompletedChapters({});

      }

    } catch (error) {

      setCompletedChapters({});

    }

    setLoading(false);
  };


  /* =======================================================
     SAVE LOCAL PROGRESS
     ======================================================= */

  const saveLocalProgress = (
    updatedProgress
  ) => {

    setCompletedChapters(
      updatedProgress
    );

    try {

      localStorage.setItem(
        storageKey,
        JSON.stringify(
          updatedProgress
        )
      );

    } catch (error) {

      console.log(
        "Unable to save chapter progress."
      );

    }
  };


  /* =======================================================
     SAVE BACKEND PROGRESS
     ======================================================= */

  const saveBackendProgress = async (
    subject,
    chapter,
    completed
  ) => {

    if (!student?.student_id) {
      return;
    }

    try {

      await fetch(
        `${API_BASE_URL}/chapter-progress`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json"
          },

          body: JSON.stringify({
            student_id:
              student.student_id,

            exam,

            subject,

            chapter,

            completed
          })
        }
      );

    } catch (error) {

      console.log(
        "Backend progress save unavailable."
      );

    }
  };


  /* =======================================================
     TOGGLE CHAPTER
     ======================================================= */

  const toggleChapter = (
    subject,
    chapter
  ) => {

    const key =
      `${subject}::${chapter}`;

    const updatedProgress = {
      ...completedChapters,

      [key]:
        !completedChapters[key]
    };

    saveLocalProgress(
      updatedProgress
    );

    saveBackendProgress(
      subject,
      chapter,
      updatedProgress[key]
    );
  };


  /* =======================================================
     TOTAL CHAPTERS
     ======================================================= */

  const totalChapters =
    useMemo(() => {

      return Object.values(
        subjects
      ).reduce(
        (total, chapters) =>
          total + chapters.length,
        0
      );

    }, [subjects]);


  /* =======================================================
     COMPLETED CHAPTERS
     ======================================================= */

  const completedCount =
    useMemo(() => {

      return Object.values(
        completedChapters
      ).filter(Boolean).length;

    }, [completedChapters]);


  /* =======================================================
     OVERALL PERCENTAGE
     ======================================================= */

  const overallPercentage =
    totalChapters > 0
      ? Math.round(
          (completedCount /
            totalChapters) *
            100
        )
      : 0;


  /* =======================================================
     SUBJECT PROGRESS
     ======================================================= */

  const getSubjectProgress = (
    subject,
    chapters
  ) => {

    const completed =
      chapters.filter(
        (chapter) =>
          completedChapters[
            `${subject}::${chapter}`
          ]
      ).length;

    const percentage =
      chapters.length > 0
        ? Math.round(
            (completed /
              chapters.length) *
              100
          )
        : 0;

    return {
      completed,
      total: chapters.length,
      percentage
    };
  };


  /* =======================================================
     OPEN / CLOSE SUBJECT
     ======================================================= */

  const toggleSubject = (
    subject
  ) => {

    setOpenSubject(
      (previous) =>
        previous === subject
          ? null
          : subject
    );
  };


  /* =======================================================
     LOADING
     ======================================================= */

  if (loading) {

    return (
      <div className="courses-loading">

        <div className="loading-spinner"></div>

        <p>
          Loading your course progress...
        </p>

      </div>
    );
  }


  /* =======================================================
     PAGE
     ======================================================= */

  return (

    <div className="courses-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="courses-header">

        <div>

          <h1>
            My Courses
          </h1>

          <p>
            Your personalized {exam} syllabus.
          </p>

        </div>

        <div className="exam-badge">
          {exam}
        </div>

      </div>


      {/* =================================================
          OVERALL PROGRESS
      ================================================= */}

      <div className="overall-course-card">

        <div className="overall-course-left">

          <div className="overall-icon">
            🎓
          </div>

          <div>

            <h2>
              {exam} Preparation
            </h2>

            <p>
              Complete chapters and track
              your syllabus progress
              subject by subject.
            </p>

            <div className="overall-course-stat">

              <strong>
                {completedCount}
              </strong>

              <span>
                of {totalChapters} chapters completed
              </span>

            </div>

          </div>

        </div>


        <div className="overall-progress-card">

          <div className="overall-progress-top">

            <span>
              Overall Progress
            </span>

            <strong>
              {overallPercentage}%
            </strong>

          </div>

          <div className="course-progress-track">

            <div
              className="course-progress-fill"
              style={{
                width:
                  `${overallPercentage}%`
              }}
            />

          </div>

          <p>

            {overallPercentage === 100
              ? "🎉 Syllabus completed!"
              : `${totalChapters - completedCount} chapters remaining`}

          </p>

        </div>

      </div>


      {/* =================================================
          SUBJECTS
      ================================================= */}

      <div className="subjects-section">

        <div className="section-heading">

          <div>

            <h2>
              Your Subjects
            </h2>

            <p>
              Select a subject to view
              its chapters.
            </p>

          </div>

          <span>
            {Object.keys(subjects).length} Subjects
          </span>

        </div>


        {/* ===============================================
            IMPORTANT:
            3 COLUMN GRID
        =============================================== */}

        <div className="subject-list">

          {Object.entries(
            subjects
          ).map(
            ([subject, chapters]) => {

              const progress =
                getSubjectProgress(
                  subject,
                  chapters
                );

              const isOpen =
                openSubject === subject;


              return (

                <div
                  className={
                    `subject-course-card ${
                      isOpen
                        ? "subject-open"
                        : ""
                    }`
                  }

                  key={subject}
                >

                  {/* SUBJECT HEADER */}

                  <button
                    type="button"
                    className="subject-course-header"
                    onClick={() =>
                      toggleSubject(
                        subject
                      )
                    }
                  >

                    <div className="subject-course-info">

                      <div className="subject-course-icon">

                        {
                          subjectIcons[
                            subject
                          ] || "📚"
                        }

                      </div>

                      <div>

                        <h3>
                          {subject}
                        </h3>

                        <div className="subject-course-summary">

                          <span className="subject-count">

                            {progress.completed}
                            {" / "}
                            {progress.total}
                            {" completed"}

                          </span>

                          <span className="subject-percentage">

                            {progress.percentage}%

                          </span>

                        </div>

                      </div>

                    </div>


                    <div className="chapter-toggle-button">

                      {isOpen
                        ? "▲"
                        : "▼"}

                    </div>

                  </button>


                  {/* SUBJECT PROGRESS */}

                  <div className="subject-progress-area">

                    <div className="subject-progress-track">

                      <div
                        className="subject-progress-fill"
                        style={{
                          width:
                            `${progress.percentage}%`
                        }}
                      />

                    </div>

                  </div>


                  {/* =================================================
                      CHAPTERS
                  ================================================= */}

                  {isOpen && (

                    <div className="chapters-dropdown">

                      <div className="chapters-header">

                        <div>

                          <strong>
                            {subject} Chapters
                          </strong>

                          <span>
                            Tick a chapter when
                            you complete it.
                          </span>

                        </div>

                        <span className="chapter-total">

                          {chapters.length}
                          {" Chapters"}

                        </span>

                      </div>


                      <div className="chapters-list">

                        {chapters.map(
                          (
                            chapter,
                            index
                          ) => {

                            const key =
                              `${subject}::${chapter}`;

                            const isCompleted =
                              Boolean(
                                completedChapters[
                                  key
                                ]
                              );


                            return (

                              <label
                                key={chapter}
                                className={
                                  `chapter-row ${
                                    isCompleted
                                      ? "chapter-completed"
                                      : ""
                                  }`
                                }
                              >

                                <span className="chapter-number">

                                  {index + 1}

                                </span>


                                <input
                                  type="checkbox"
                                  checked={
                                    isCompleted
                                  }
                                  onChange={() =>
                                    toggleChapter(
                                      subject,
                                      chapter
                                    )
                                  }
                                />


                                <span className="chapter-name">

                                  {chapter}

                                </span>


                                <span
                                  className={
                                    `chapter-status ${
                                      isCompleted
                                        ? "completed-status"
                                        : "pending-status"
                                    }`
                                  }
                                >

                                  {isCompleted
                                    ? "Completed"
                                    : "Not Started"}

                                </span>

                              </label>

                            );
                          }
                        )}

                      </div>

                    </div>

                  )}

                </div>

              );

            }
          )}

        </div>

      </div>


      {/* =================================================
          STUDY TIP
      ================================================= */}

      <div className="course-tip">

        <div className="course-tip-icon">
          💡
        </div>

        <div>

          <strong>
            Study Tip
          </strong>

          <p>
            Complete chapters as you
            finish them. PrepMind AI can
            use your progress along with
            your practice performance to
            improve your personalized
            recommendations.
          </p>

        </div>

      </div>

    </div>
  );
}


export default MyCourses;