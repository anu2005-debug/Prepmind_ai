const fs = require("fs");
const path = require("path");

const LETTERS = "ABCDEFGH";
const OUT_DIR = path.join("data", "questions");
fs.mkdirSync(OUT_DIR, { recursive: true });

function loadBank(file) {
  const source = fs
    .readFileSync(file, "utf8")
    .replace(/export\s+const\s+(\w+)\s*=/g, "exports.$1 =")
    .replace(/export\s+default\s+/g, "exports.default = ");
  const exported = {};
  new Function("exports", source)(exported);
  return Object.values(exported).filter(Array.isArray).flat();
}

function convert(q) {
  const kind = String(q.type || "MCQ").toLowerCase();
  const hasOptions = Array.isArray(q.options) && q.options.length > 0;
  let questionType, options = null, correct;

  if (!hasOptions) {
    questionType = "numerical";
    correct = String(q.answer).trim();
  } else {
    options = Object.fromEntries(q.options.map((text, i) => [LETTERS[i], text]));
    const answers = Array.isArray(q.answer) ? q.answer : [q.answer];
    const letters = answers.map((a) => {
      const index = q.options.indexOf(a);
      if (index >= 0) return LETTERS[index];
      if (/^[A-H]$/.test(String(a))) return String(a);
      throw new Error(`answer "${a}" not found in options`);
    });
    questionType = answers.length > 1 || kind.includes("multi") ? "multiple" : "mcq";
    correct = [...new Set(letters)].sort().join(",");
  }

  return {
    exam: "JEE",
    subject: q.subject,
    chapter: q.chapter,
    question_type: questionType,
    question_text: q.question,
    options,
    correct_answer: correct,
    explanation: q.explanation || null,
    difficulty: q.difficulty || "medium",
  };
}

const files = process.argv.slice(2);
if (!files.length) {
  console.error("Give at least one bank file, e.g. src/jeeMainPhysicsBank.js");
  process.exit(1);
}

for (const file of files) {
  const converted = [];
  const problems = [];
  for (const q of loadBank(file)) {
    try { converted.push(convert(q)); }
    catch (error) { problems.push(`id ${q.id}: ${error.message}`); }
  }
  const outFile = path.join(OUT_DIR, path.basename(file, ".js") + ".json");
  fs.writeFileSync(outFile, JSON.stringify(converted, null, 2), "utf8");

  const perChapter = {};
  converted.forEach((q) => { perChapter[q.chapter] = (perChapter[q.chapter] || 0) + 1; });
  console.log(`\n${file} -> ${outFile}  (${converted.length} questions)`);
  Object.entries(perChapter).forEach(([c, n]) => console.log(`  ${c}: ${n}`));
  problems.forEach((p) => console.log("  SKIPPED", p));
}
