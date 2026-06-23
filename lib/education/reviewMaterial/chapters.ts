export type ReviewSubject = "science" | "math";

export type ReviewChapter = {
  id: string;
  slug: string;
  title: string;
  subject: ReviewSubject;
  outputFile: string;
};

export const REVIEW_CHAPTERS: ReviewChapter[] = [
  { id: "sci-chem-reactions", slug: "chem-reactions", title: "Chemical Reactions and Equations", subject: "science", outputFile: "chem-reactions.md" },
  { id: "sci-acids-bases", slug: "acids-bases-salts", title: "Acids, Bases and Salts", subject: "science", outputFile: "acids-bases-salts.md" },
  { id: "sci-metals-nonmetals", slug: "metals-non-metals", title: "Metals and Non-Metals", subject: "science", outputFile: "metals-non-metals.md" },
  { id: "sci-carbon-compounds", slug: "carbon-compounds", title: "Carbon and Its Compounds", subject: "science", outputFile: "carbon-compounds.md" },
  { id: "sci-life-processes", slug: "life-processes", title: "Life Processes", subject: "science", outputFile: "life-processes.md" },
  { id: "sci-control-coordination", slug: "control-coordination", title: "Control and Coordination", subject: "science", outputFile: "control-coordination.md" },
  { id: "sci-reproduction", slug: "organisms-reproduce", title: "How Do Organisms Reproduce?", subject: "science", outputFile: "organisms-reproduce.md" },
  { id: "sci-heredity", slug: "heredity", title: "Heredity", subject: "science", outputFile: "heredity.md" },
  { id: "sci-light", slug: "light-reflection-refraction", title: "Light – Reflection and Refraction", subject: "science", outputFile: "light-reflection-refraction.md" },
  { id: "sci-human-eye", slug: "human-eye-colourful-world", title: "The Human Eye and the Colourful World", subject: "science", outputFile: "human-eye-colourful-world.md" },
  { id: "sci-electricity", slug: "electricity", title: "Electricity", subject: "science", outputFile: "electricity.md" },
  { id: "sci-magnetism", slug: "magnetic-effects-current", title: "Magnetic Effects of Electric Current", subject: "science", outputFile: "magnetic-effects-current.md" },
  { id: "sci-energy", slug: "sources-energy", title: "Sources of Energy", subject: "science", outputFile: "sources-energy.md" },
  { id: "math-real-numbers", slug: "real-numbers", title: "Real Numbers", subject: "math", outputFile: "real-numbers.md" },
  { id: "math-polynomials", slug: "polynomials", title: "Polynomials", subject: "math", outputFile: "polynomials.md" },
  { id: "math-linear-equations", slug: "linear-equations", title: "Pair of Linear Equations in Two Variables", subject: "math", outputFile: "linear-equations.md" },
  { id: "math-quadratic", slug: "quadratic-equations", title: "Quadratic Equations", subject: "math", outputFile: "quadratic-equations.md" },
  { id: "math-ap", slug: "arithmetic-progressions", title: "Arithmetic Progressions", subject: "math", outputFile: "arithmetic-progressions.md" },
  { id: "math-triangles", slug: "triangles", title: "Triangles", subject: "math", outputFile: "triangles.md" },
  { id: "math-coordinate", slug: "coordinate-geometry", title: "Coordinate Geometry", subject: "math", outputFile: "coordinate-geometry.md" },
  { id: "math-trig-intro", slug: "intro-trigonometry", title: "Introduction to Trigonometry", subject: "math", outputFile: "intro-trigonometry.md" },
  { id: "math-trig-apps", slug: "applications-trigonometry", title: "Some Applications of Trigonometry", subject: "math", outputFile: "applications-trigonometry.md" },
  { id: "math-circles", slug: "circles", title: "Circles", subject: "math", outputFile: "circles.md" },
  { id: "math-constructions", slug: "constructions", title: "Constructions", subject: "math", outputFile: "constructions.md" },
  { id: "math-areas-circles", slug: "areas-circles", title: "Areas Related to Circles", subject: "math", outputFile: "areas-circles.md" },
  { id: "math-surface-volumes", slug: "surface-areas-volumes", title: "Surface Areas and Volumes", subject: "math", outputFile: "surface-areas-volumes.md" },
  { id: "math-statistics", slug: "statistics", title: "Statistics", subject: "math", outputFile: "statistics.md" },
  { id: "math-probability", slug: "probability", title: "Probability", subject: "math", outputFile: "probability.md" },
];

export function getChapterById(id: string): ReviewChapter | undefined {
  return REVIEW_CHAPTERS.find((c) => c.id === id);
}
