"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { Play, RotateCcw } from "lucide-react";
import {
  canNandiTransition,
  demoTicketForScenario,
  INITIAL_TICKETS,
  NANDI_COLUMNS,
  NANDI_SCENARIOS,
  type NandiColumnId,
  type NandiTicket,
} from "@/lib/nandi-board";

type ActivityEntry = {
  id: string;
  text: string;
  at: string;
};

function priorityClass(p: NandiTicket["priority"]) {
  if (p === "high") return "border-l-red-400";
  if (p === "normal") return "border-l-amber-400";
  return "border-l-slate-500";
}

function TicketCard({
  ticket,
  dragging,
  highlight,
}: {
  ticket: NandiTicket;
  dragging?: boolean;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-lg border border-slate-600/50 border-l-4 bg-slate-900/80 px-3 py-2.5 shadow-md ${priorityClass(ticket.priority)} ${
        dragging ? "opacity-40" : ""
      } ${highlight ? "ring-2 ring-amber-300/60" : ""}`}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="font-mono text-[10px] text-amber-200/80">{ticket.id}</p>
        <span className="text-[10px] uppercase text-slate-500">{ticket.priority}</span>
      </div>
      <p className="mt-1 text-sm font-medium text-slate-100">{ticket.title}</p>
      <p className="mt-1 text-xs text-slate-400">{ticket.customer}</p>
      <p className="mt-2 line-clamp-2 text-xs text-slate-500">{ticket.summary}</p>
      <p className="mt-2 text-[10px] text-slate-600">{ticket.updatedAt}</p>
    </div>
  );
}

function DraggableTicket({
  ticket,
  highlight,
}: {
  ticket: NandiTicket;
  highlight?: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: ticket.id,
    data: { ticket },
  });

  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
    : undefined;

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes} className="cursor-grab active:cursor-grabbing">
      <TicketCard ticket={ticket} dragging={isDragging} highlight={highlight} />
    </div>
  );
}

function Column({
  columnId,
  label,
  hint,
  tickets,
  highlightId,
}: {
  columnId: NandiColumnId;
  label: string;
  hint: string;
  tickets: NandiTicket[];
  highlightId?: string | null;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: columnId });

  return (
    <div
      ref={setNodeRef}
      className={`flex min-h-[280px] flex-col rounded-xl border bg-slate-900/30 ${
        isOver ? "border-amber-300/50 bg-amber-500/5" : "border-slate-700/50"
      }`}
    >
      <div className="border-b border-slate-700/40 px-3 py-2.5">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-300">{label}</p>
        <p className="text-[10px] text-slate-500">{hint}</p>
        <p className="mt-1 font-mono text-[10px] text-amber-200/70">{columnId}</p>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-2">
        {tickets.map((t) => (
          <DraggableTicket key={t.id} ticket={t} highlight={highlightId === t.id} />
        ))}
        {tickets.length === 0 && (
          <p className="py-6 text-center text-[11px] text-slate-600">Drop tickets here</p>
        )}
      </div>
    </div>
  );
}

function nowLabel() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

export function NandiTicketBoard() {
  const [tickets, setTickets] = useState<NandiTicket[]>(INITIAL_TICKETS);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [highlightId, setHighlightId] = useState<string | null>(null);
  const [activity, setActivity] = useState<ActivityEntry[]>([
    { id: "boot", text: "Board loaded — drag tickets between columns or run a scenario", at: nowLabel() },
  ]);
  const [running, setRunning] = useState(false);
  const scenarioTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const autoScenarioRan = useRef(false);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

  const ticketsByColumn = useMemo(() => {
    const map = Object.fromEntries(NANDI_COLUMNS.map((c) => [c.id, [] as NandiTicket[]])) as Record<
      NandiColumnId,
      NandiTicket[]
    >;
    for (const t of tickets) {
      map[t.status]?.push(t);
    }
    return map;
  }, [tickets]);

  const activeTicket = activeId ? tickets.find((t) => t.id === activeId) : null;

  const log = useCallback((text: string) => {
    setActivity((prev) => [{ id: `${Date.now()}-${Math.random()}`, text, at: nowLabel() }, ...prev].slice(0, 12));
  }, []);

  const moveTicket = useCallback(
    (ticketId: string, to: NandiColumnId, note?: string) => {
      setTickets((prev) => {
        const ticket = prev.find((t) => t.id === ticketId);
        if (!ticket || ticket.status === to) return prev;
        if (!canNandiTransition(ticket.status, to)) {
          log(`Blocked: ${ticketId} cannot move ${ticket.status} → ${to}`);
          return prev;
        }
        log(note ?? `${ticketId} moved ${ticket.status} → ${to}`);
        return prev.map((t) =>
          t.id === ticketId ? { ...t, status: to, updatedAt: "Just now" } : t
        );
      });
    },
    [log]
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(String(event.active.id));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    const ticketId = String(event.active.id);
    const overId = event.over?.id;
    if (!overId) return;
    moveTicket(ticketId, overId as NandiColumnId);
  };

  const resetBoard = () => {
    if (scenarioTimer.current) clearTimeout(scenarioTimer.current);
    setRunning(false);
    setHighlightId(null);
    setTickets(INITIAL_TICKETS);
    log("Board reset to live sample tickets");
  };

  const runScenario = useCallback(
    (scenarioId: string) => {
      const scenario = NANDI_SCENARIOS.find((s) => s.id === scenarioId);
      if (!scenario || running) return;

      if (scenarioTimer.current) clearTimeout(scenarioTimer.current);
      setRunning(true);

      const demo = demoTicketForScenario(scenario);
      setTickets((prev) => [demo, ...prev.filter((t) => t.id !== demo.id)]);
      setHighlightId(demo.id);
      log(`Scenario started: ${scenario.title}`);

      let step = 0;
      const advance = () => {
        step += 1;
        if (step >= scenario.path.length) {
          setRunning(false);
          setHighlightId(null);
          log(`Scenario complete: ${scenario.title}`);
          return;
        }
        const to = scenario.path[step];
        moveTicket(demo.id, to, `${demo.id} · ${scenario.path[step - 1]} → ${to}`);
        scenarioTimer.current = setTimeout(advance, scenario.delayMs ?? 900);
      };

      scenarioTimer.current = setTimeout(advance, 600);
    },
    [log, moveTicket, running]
  );

  useEffect(() => {
    return () => {
      if (scenarioTimer.current) clearTimeout(scenarioTimer.current);
    };
  }, []);

  useEffect(() => {
    if (autoScenarioRan.current) return;
    const hash = window.location.hash.replace(/^#scenario-/, "");
    if (!hash) return;
    const match = NANDI_SCENARIOS.find((s) => s.id === hash);
    if (match) {
      autoScenarioRan.current = true;
      const t = setTimeout(() => runScenario(match.id), 400);
      return () => clearTimeout(t);
    }
  }, [runScenario]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-400">
          Live ticket board — drag cards between states. Valid transitions match the Nandi state machine.
        </p>
        <button
          type="button"
          onClick={resetBoard}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-600/60 px-3 py-1.5 text-xs text-slate-300 hover:border-amber-300/40"
        >
          <RotateCcw size={13} />
          Reset board
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {NANDI_SCENARIOS.map((s) => (
          <button
            key={s.id}
            type="button"
            disabled={running}
            onClick={() => runScenario(s.id)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-amber-400/25 bg-amber-500/10 px-3 py-1.5 text-xs text-amber-100 hover:bg-amber-500/20 disabled:opacity-50"
          >
            <Play size={12} />
            {s.title}
          </button>
        ))}
      </div>

      <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="grid gap-3 overflow-x-auto lg:grid-cols-6 md:grid-cols-3 sm:grid-cols-2">
          {NANDI_COLUMNS.map((col) => (
            <Column
              key={col.id}
              columnId={col.id}
              label={col.label}
              hint={col.hint}
              tickets={ticketsByColumn[col.id]}
              highlightId={highlightId}
            />
          ))}
        </div>
        <DragOverlay>{activeTicket ? <TicketCard ticket={activeTicket} /> : null}</DragOverlay>
      </DndContext>

      <section className="rounded-xl border border-slate-700/50 bg-slate-900/30 px-4 py-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Activity log</h3>
        <ul className="mt-3 max-h-40 space-y-1.5 overflow-y-auto">
          {activity.map((entry) => (
            <li key={entry.id} className="flex gap-3 text-xs">
              <span className="shrink-0 font-mono text-slate-600">{entry.at}</span>
              <span className="text-slate-300">{entry.text}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
