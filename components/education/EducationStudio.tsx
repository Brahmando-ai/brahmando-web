"use client";

import { useMemo, useState } from "react";
import {
  BookOpen,
  Building2,
  GraduationCap,
  Loader2,
  PenLine,
  Play,
  School,
  Sparkles,
} from "lucide-react";
import {
  type EducationActor,
  formatEducationResponse,
  postActorChat,
} from "@/lib/education-api";

type WorkflowId =
  | "trend"
  | "practice"
  | "self_grade"
  | "scholarship"
  | "question_paper"
  | "grade_paper"
  | "lesson_plan"
  | "chapter_hours"
  | "term_syllabus"
  | "mock_test"
  | "diagnostic";

type FieldDef = {
  key: string;
  label: string;
  placeholder?: string;
  type?: "text" | "number" | "textarea";
  default?: string;
};

type Workflow = {
  id: WorkflowId;
  title: string;
  blurb: string;
  messageTemplate: (v: Record<string, string>) => string;
  contextFromFields: (v: Record<string, string>) => Record<string, unknown>;
  fields: FieldDef[];
};

const ACTORS: {
  id: EducationActor;
  label: string;
  icon: typeof GraduationCap;
  tagline: string;
  color: string;
}[] = [
  {
    id: "student",
    label: "Student",
    icon: GraduationCap,
    tagline: "Explore trends, practice, get graded",
    color: "from-cyan-500/20 to-blue-600/10 border-cyan-400/30",
  },
  {
    id: "teacher",
    label: "Teacher",
    icon: BookOpen,
    tagline: "Papers, rubrics, lesson plans",
    color: "from-violet-500/20 to-purple-600/10 border-violet-400/30",
  },
  {
    id: "school",
    label: "School",
    icon: School,
    tagline: "Syllabus hours & term planning",
    color: "from-emerald-500/20 to-teal-600/10 border-emerald-400/30",
  },
  {
    id: "coaching_center",
    label: "Coaching",
    icon: Building2,
    tagline: "Mock tests & diagnostics",
    color: "from-amber-500/20 to-orange-600/10 border-amber-400/30",
  },
];

const WORKFLOWS: Record<EducationActor, Workflow[]> = {
  student: [
    {
      id: "trend",
      title: "CBSE past-paper trends",
      blurb: "Which chapters appear most in board exams?",
      fields: [
        { key: "subject", label: "Subject", default: "History" },
        { key: "board", label: "Board", default: "CBSE" },
        { key: "years", label: "Years to analyze", default: "5" },
      ],
      messageTemplate: (v) =>
        `Which chapters from ${v.subject} had the maximum number of questions in ${v.board} board exams in the last ${v.years} years? Rank chapters by frequency.`,
      contextFromFields: (v) => ({ subject: v.subject, board: v.board }),
    },
    {
      id: "practice",
      title: "Practice MCQs",
      blurb: "Generate exam-style questions",
      fields: [
        { key: "subject", label: "Subject", default: "Science" },
        { key: "topic", label: "Topic", default: "Photosynthesis" },
        { key: "grade", label: "Class", default: "10" },
        { key: "count", label: "Questions", default: "5", type: "number" },
      ],
      messageTemplate: (v) =>
        `Generate ${v.count} medium difficulty MCQs for Class ${v.grade} ${v.board || "CBSE"} ${v.subject} on ${v.topic}.`,
      contextFromFields: (v) => ({
        subject: v.subject,
        topic: v.topic,
        grade: v.grade,
        count: Number(v.count) || 5,
        board: "CBSE",
      }),
    },
    {
      id: "self_grade",
      title: "Get my answer graded",
      blurb: "Submit work for AI feedback",
      fields: [
        { key: "question", label: "Question", type: "textarea", placeholder: "Exam question…" },
        { key: "answer", label: "Your answer", type: "textarea", placeholder: "Your response…" },
      ],
      messageTemplate: (v) => `Grade my answer.\nQuestion: ${v.question}\nMy answer: ${v.answer}`,
      contextFromFields: (v) => ({ grade_submission: true, question: v.question, answer: v.answer }),
    },
    {
      id: "scholarship",
      title: "FAFSA & scholarships",
      blurb: "Aid and scholarship strategy",
      fields: [
        { key: "question", label: "Your question", type: "textarea", default: "I'm a first-gen 12th grader — how do I find scholarships after FAFSA?" },
        { key: "country", label: "Country", default: "US" },
      ],
      messageTemplate: (v) => v.question,
      contextFromFields: (v) => ({ country: v.country, grade_level: "12th", financial_need: true }),
    },
  ],
  teacher: [
    {
      id: "question_paper",
      title: "Build question paper",
      blurb: "NEET, CBSE, or board-style paper",
      fields: [
        { key: "board", label: "Exam", default: "NEET" },
        { key: "subject", label: "Subject", default: "Mathematics" },
        { key: "topic", label: "Topics", default: "Calculus + Algebra mix" },
        { key: "count", label: "Questions", default: "15", type: "number" },
      ],
      messageTemplate: (v) =>
        `Create a dummy ${v.board} ${v.subject} question paper covering ${v.topic} with ${v.count} questions.`,
      contextFromFields: (v) => ({
        generate_exam: true,
        board: v.board,
        subject: v.subject,
        topic: v.topic,
        count: Number(v.count) || 15,
        difficulty: "medium",
      }),
    },
    {
      id: "grade_paper",
      title: "Grade student work",
      blurb: "Rubric-based scoring",
      fields: [
        { key: "question", label: "Question", type: "textarea" },
        { key: "answer", label: "Student answer", type: "textarea" },
        { key: "rubric", label: "Rubric (optional)", type: "textarea", placeholder: "Partial credit rules…" },
      ],
      messageTemplate: (v) =>
        `Grade this response.\nQ: ${v.question}\nA: ${v.answer}\nRubric: ${v.rubric || "Standard partial credit"}`,
      contextFromFields: (v) => ({ question: v.question, student_answer: v.answer, rubric: v.rubric }),
    },
    {
      id: "lesson_plan",
      title: "Lesson plan (SWAN)",
      blurb: "Smart-board ready plan",
      fields: [
        { key: "subject", label: "Subject", default: "Science" },
        { key: "grade", label: "Grade", default: "8" },
        { key: "topic", label: "Topic", default: "Ecosystems" },
        { key: "minutes", label: "Duration (min)", default: "45", type: "number" },
      ],
      messageTemplate: (v) =>
        `${v.minutes}-minute Grade ${v.grade} ${v.subject} lesson on ${v.topic} with SWAN smart board activities.`,
      contextFromFields: (v) => ({
        subject: v.subject,
        grade: v.grade,
        topic: v.topic,
        duration_minutes: Number(v.minutes) || 45,
        objectives: [`Understand ${v.topic}`],
        smart_board: true,
      }),
    },
  ],
  school: [
    {
      id: "chapter_hours",
      title: "Chapter hour allocation",
      blurb: "Plan periods for one unit",
      fields: [
        { key: "grade", label: "Class", default: "11" },
        { key: "subject", label: "Subject", default: "Physics" },
        { key: "chapter", label: "Chapter", default: "Sound" },
        { key: "weeks", label: "Weeks", default: "4", type: "number" },
        { key: "periods", label: "Periods/week", default: "5", type: "number" },
      ],
      messageTemplate: (v) =>
        `Allocate teaching hours for Class ${v.grade} ${v.subject} chapter "${v.chapter}" over ${v.weeks} weeks with ${v.periods} periods per week (45 min each). Include revision and assessment slots.`,
      contextFromFields: (v) => ({
        grade: v.grade,
        subject: v.subject,
        chapter: v.chapter,
        total_weeks: Number(v.weeks) || 4,
        periods_per_week: Number(v.periods) || 5,
        period_minutes: 45,
        board: "CBSE",
      }),
    },
    {
      id: "term_syllabus",
      title: "Term syllabus planner",
      blurb: "Board-aligned term schedule",
      fields: [
        { key: "grade", label: "Class", default: "10" },
        { key: "subject", label: "Subject", default: "Science" },
        { key: "term", label: "Term", default: "Full year" },
      ],
      messageTemplate: (v) =>
        `Design a ${v.term} CBSE Class ${v.grade} ${v.subject} syllabus with weekly topics, revision blocks, and pre-board mock exam dates.`,
      contextFromFields: (v) => ({ grade: v.grade, subject: v.subject, board: "CBSE" }),
    },
  ],
  coaching_center: [
    {
      id: "mock_test",
      title: "Full mock test",
      blurb: "Timed paper for a batch",
      fields: [
        { key: "grade", label: "Class", default: "7" },
        { key: "subject", label: "Subject", default: "Science" },
        { key: "duration", label: "Minutes", default: "60", type: "number" },
        { key: "marks", label: "Question count", default: "20", type: "number" },
      ],
      messageTemplate: (v) =>
        `Create a ${v.duration}-minute mock test for Class ${v.grade} CBSE ${v.subject} with about ${v.marks} questions and marking scheme.`,
      contextFromFields: (v) => ({
        grade: v.grade,
        subject: v.subject,
        duration_minutes: Number(v.duration) || 60,
        count: Number(v.marks) || 20,
        board: "CBSE",
        mock_test: true,
      }),
    },
    {
      id: "diagnostic",
      title: "Diagnostic paper",
      blurb: "Find weak topics for a batch",
      fields: [
        { key: "grade", label: "Class", default: "12" },
        { key: "subject", label: "Subject", default: "Physics" },
        { key: "unit", label: "Unit", default: "Electrostatics" },
      ],
      messageTemplate: (v) =>
        `Design a diagnostic test for Class ${v.grade} ${v.subject} unit "${v.unit}" to identify weak areas before full mock series.`,
      contextFromFields: (v) => ({
        grade: v.grade,
        subject: v.subject,
        topic: v.unit,
        board: "CBSE",
        mock_test: true,
      }),
    },
  ],
};

function defaultFieldValues(workflow: Workflow): Record<string, string> {
  return Object.fromEntries(
    workflow.fields.map((f) => [f.key, f.default ?? ""])
  );
}

export function EducationStudio() {
  const [actor, setActor] = useState<EducationActor>("student");
  const [workflowId, setWorkflowId] = useState<WorkflowId>("trend");
  const [fields, setFields] = useState<Record<string, string>>({});
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const workflows = WORKFLOWS[actor];
  const workflow = useMemo(
    () => workflows.find((w) => w.id === workflowId) ?? workflows[0],
    [workflows, workflowId]
  );

  const activeFields = useMemo(() => {
    if (!workflow) return {};
    const base = defaultFieldValues(workflow);
    return { ...base, ...fields };
  }, [workflow, fields]);

  function selectActor(next: EducationActor) {
    setActor(next);
    const first = WORKFLOWS[next][0];
    setWorkflowId(first.id);
    setFields(defaultFieldValues(first));
    setOutput("");
    setError(null);
  }

  function selectWorkflow(id: WorkflowId) {
    const w = workflows.find((x) => x.id === id);
    if (!w) return;
    setWorkflowId(id);
    setFields(defaultFieldValues(w));
    setOutput("");
    setError(null);
  }

  async function run() {
    if (!workflow) return;
    setLoading(true);
    setError(null);
    setOutput("");
    try {
      const values = { ...defaultFieldValues(workflow), ...fields };
      const data = await postActorChat(
        actor,
        workflow.messageTemplate(values),
        workflow.contextFromFields(values)
      );
      setOutput(formatEducationResponse(data));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Request failed");
    } finally {
      setLoading(false);
    }
  }

  const ActorIcon = ACTORS.find((a) => a.id === actor)?.icon ?? GraduationCap;

  return (
    <div className="mx-auto max-w-7xl px-4 pb-24 pt-8 sm:px-6">
      <div className="mb-10 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">
          ManjuLab CSR · Education Studio
        </p>
        <h1 className="mt-2 text-3xl font-bold text-slate-100 sm:text-4xl">
          Who are you today?
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-400">
          Pick a role, choose a workflow, and run real Education Portal tasks — syllabus planning,
          question papers, grading, mock tests, and CBSE trend analysis powered by your knowledge base.
        </p>
      </div>

      {/* Role cards */}
      <div className="mb-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {ACTORS.map(({ id, label, icon: Icon, tagline, color }) => (
          <button
            key={id}
            type="button"
            onClick={() => selectActor(id)}
            className={`rounded-2xl border bg-gradient-to-br p-4 text-left transition-all ${
              actor === id ? `${color} ring-2 ring-cyan-400/50` : "border-slate-700/50 bg-slate-900/40 opacity-80 hover:opacity-100"
            }`}
          >
            <Icon className="mb-2 h-6 w-6 text-cyan-300" />
            <p className="font-semibold text-slate-100">{label}</p>
            <p className="mt-1 text-xs text-slate-400">{tagline}</p>
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Workflows */}
        <div className="lg:col-span-4">
          <p className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
            <Sparkles size={14} /> Workflows for {ACTORS.find((a) => a.id === actor)?.label}
          </p>
          <div className="space-y-2">
            {workflows.map((w) => (
              <button
                key={w.id}
                type="button"
                onClick={() => selectWorkflow(w.id)}
                className={`w-full rounded-xl border px-4 py-3 text-left transition-colors ${
                  workflowId === w.id
                    ? "border-cyan-400/40 bg-cyan-500/10"
                    : "border-slate-700/50 bg-slate-900/30 hover:border-slate-600"
                }`}
              >
                <p className="text-sm font-medium text-slate-100">{w.title}</p>
                <p className="mt-0.5 text-xs text-slate-400">{w.blurb}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Form + output */}
        <div className="lg:col-span-8">
          <div className="rounded-2xl border border-slate-700/50 bg-slate-900/40 p-5 sm:p-6">
            <div className="mb-5 flex items-center gap-2 border-b border-slate-700/50 pb-4">
              <ActorIcon size={20} className="text-cyan-300" />
              <h2 className="text-lg font-semibold text-slate-100">{workflow?.title}</h2>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {workflow?.fields.map((f) => (
                <label key={f.key} className={f.type === "textarea" ? "sm:col-span-2" : ""}>
                  <span className="mb-1 block text-xs font-medium text-slate-400">{f.label}</span>
                  {f.type === "textarea" ? (
                    <textarea
                      className="w-full rounded-lg border border-slate-600/50 bg-slate-950/60 px-3 py-2 text-sm text-slate-100"
                      rows={3}
                      placeholder={f.placeholder}
                      value={activeFields[f.key] ?? ""}
                      onChange={(e) => setFields((prev) => ({ ...prev, [f.key]: e.target.value }))}
                    />
                  ) : (
                    <input
                      type={f.type === "number" ? "number" : "text"}
                      className="w-full rounded-lg border border-slate-600/50 bg-slate-950/60 px-3 py-2 text-sm text-slate-100"
                      placeholder={f.placeholder}
                      value={activeFields[f.key] ?? ""}
                      onChange={(e) => setFields((prev) => ({ ...prev, [f.key]: e.target.value }))}
                    />
                  )}
                </label>
              ))}
            </div>

            <button
              type="button"
              onClick={run}
              disabled={loading}
              className="btn-primary mt-6 inline-flex items-center gap-2"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <Play size={16} />}
              Run as {ACTORS.find((a) => a.id === actor)?.label}
            </button>

            {error && (
              <p className="mt-4 rounded-lg border border-red-400/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
                {error}
              </p>
            )}

            {output && (
              <div className="mt-6">
                <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  <PenLine size={14} /> Result
                </p>
                <pre className="max-h-[420px] overflow-auto whitespace-pre-wrap rounded-xl border border-slate-700/50 bg-slate-950/80 p-4 text-sm leading-relaxed text-slate-200">
                  {output}
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
