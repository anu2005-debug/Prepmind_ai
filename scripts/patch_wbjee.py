import re

p = "src/practice_questions.py"
s = open(p, encoding="utf-8").read()
if "WBJEE_ALIASES" in s:
    print("backend already patched")
else:
    s = s.replace(
        'return "JEE" if value.startswith("JEE") else value',
        'return "JEE" if value.startswith(("JEE", "WBJEE")) else value', 1)
    block = '''
# WBJEE chapter names -> JEE bank chapters.
WBJEE_ALIASES = {
    ("Physics", "Physical World, Units and Measurements"): ["Units and Measurements"],
    ("Physics", "Properties of Matter"): ["Properties of Solids and Liquids"],
    ("Physics", "Heat and Thermodynamics"): ["Thermodynamics", "Kinetic Theory of Gases"],
    ("Physics", "Semiconductor Electronics"): ["Electronic Devices"],
    ("Chemistry", "Chemical Energetics"): ["Chemical Thermodynamics"],
    ("Chemistry", "Chemical Equilibrium"): ["Equilibrium"],
    ("Chemistry", "Periodic Table"): ["Classification of Elements and Periodicity"],
    ("Chemistry", "s-, p-, d- and f-Block Elements"): ["Hydrogen and s-Block Elements", "p-Block Elements", "d- and f-Block Elements"],
    ("Chemistry", "Organic Chemistry Basics"): ["Some Basic Principles of Organic Chemistry"],
    ("Chemistry", "Organic Functional Groups"): ["Organic Compounds Containing Halogens", "Organic Compounds Containing Oxygen", "Organic Compounds Containing Nitrogen"],
    ("Chemistry", "Polymers and Biomolecules"): ["Biomolecules"],
    ("Mathematics", "Quadratic Equations"): ["Complex Numbers and Quadratic Equations"],
    ("Mathematics", "Logarithms"): ["Algebra"],
    ("Mathematics", "Permutation and Combination"): ["Permutations and Combinations"],
}
CHAPTER_ALIASES.update(WBJEE_ALIASES)
'''
    anchor = "def resolve_chapters("
    assert anchor in s, "resolve_chapters not found"
    s = s.replace(anchor, block + "\n\n" + anchor, 1)
    open(p, "w", encoding="utf-8").write(s)
    print("backend patched")

p = "frontend/src/App.jsx"
s = open(p, encoding="utf-8").read()
if "isServerExam" in s:
    print("frontend already patched")
else:
    n = s.count('.startsWith("JEE")')
    assert n >= 2, "expected the two JEE checks"
    s = re.sub(r'String\((exam|selectedExam) \|\| ""\)\.startsWith\("JEE"\)',
               r'/^(JEE|WBJEE)/.test(String(\1 || "").toUpperCase()) /* isServerExam */', s)
    open(p, "w", encoding="utf-8").write(s)
    print("frontend patched")