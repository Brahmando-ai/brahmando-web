"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Background,
  Controls,
  Handle,
  MiniMap,
  Position,
  ReactFlow,
  type Node,
  type NodeProps,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Download, ExternalLink, Loader2 } from "lucide-react";
import { N8N_URL } from "@/lib/agent-runtime";
import { n8nToFlow, type N8nWorkflowJson } from "@/lib/n8n-to-flow";

type N8nNodeData = {
  label: string;
  nodeType: string;
  rawType: string;
};

const nodeColors: Record<string, string> = {
  Webhook: "border-orange-400/80 bg-orange-500/10",
  Function: "border-emerald-400/70 bg-emerald-500/10",
  Switch: "border-cyan-400/70 bg-cyan-500/10",
  "Sub-workflow": "border-violet-400/80 bg-violet-500/15",
  Trigger: "border-violet-300/70 bg-violet-500/10",
  HTTP: "border-blue-400/70 bg-blue-500/10",
  If: "border-yellow-400/70 bg-yellow-500/10",
  "No-op": "border-slate-500/70 bg-slate-700/40",
};

function N8nNode({ data }: NodeProps<Node<N8nNodeData>>) {
  const style = nodeColors[data.nodeType] ?? "border-slate-500/70 bg-slate-800/80";
  return (
    <>
      <Handle type="target" position={Position.Left} className="!h-2 !w-2 !bg-violet-400 !border-0" />
      <div className={`min-w-[148px] rounded-lg border-2 px-3 py-2 shadow-lg ${style}`}>
        <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">{data.nodeType}</p>
        <p className="mt-0.5 text-xs font-medium leading-snug text-slate-100">{data.label}</p>
      </div>
      <Handle type="source" position={Position.Right} className="!h-2 !w-2 !bg-violet-400 !border-0" />
    </>
  );
}

const nodeTypes = { n8nNode: N8nNode };

type Props = {
  jsonUrl: string;
  workflowName: string;
  height?: number;
};

export function N8nWorkflowViewer({ jsonUrl, workflowName, height = 420 }: Props) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [workflow, setWorkflow] = useState<N8nWorkflowJson | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetch(jsonUrl)
      .then((r) => {
        if (!r.ok) throw new Error(`Failed to load workflow (${r.status})`);
        return r.json();
      })
      .then((data: N8nWorkflowJson) => {
        if (!cancelled) setWorkflow(data);
      })
      .catch((e: Error) => {
        if (!cancelled) setError(e.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [jsonUrl]);

  const { nodes, edges } = useMemo(() => {
    if (!workflow) return { nodes: [], edges: [] };
    return n8nToFlow(workflow);
  }, [workflow]);

  const onInit = useCallback((instance: { fitView: (opts?: { padding?: number }) => void }) => {
    requestAnimationFrame(() => instance.fitView({ padding: 0.2 }));
  }, []);

  if (loading) {
    return (
      <div
        className="flex items-center justify-center rounded-xl border border-slate-700/60 bg-[#1a1d24]"
        style={{ height }}
      >
        <Loader2 className="h-6 w-6 animate-spin text-violet-300" aria-label="Loading workflow" />
      </div>
    );
  }

  if (error || !workflow) {
    return (
      <div
        className="flex items-center justify-center rounded-xl border border-red-500/30 bg-red-500/5 px-4 text-sm text-red-200"
        style={{ height }}
      >
        {error ?? "Workflow unavailable"}
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-700/60 bg-[#1a1d24]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-700/50 px-4 py-2.5">
        <div>
          <p className="font-mono text-xs text-violet-200/90">{workflow.name}</p>
          <p className="text-[11px] text-slate-500">{workflow.nodes.length} n8n nodes · local template</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <a
            href={jsonUrl}
            download={`${workflowName}.json`}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-600/60 px-2.5 py-1.5 text-xs text-slate-300 hover:border-violet-400/40 hover:text-violet-100"
          >
            <Download size={13} />
            Import JSON
          </a>
          <a
            href={N8N_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg border border-violet-400/30 bg-violet-500/10 px-2.5 py-1.5 text-xs text-violet-100 hover:bg-violet-500/20"
          >
            <ExternalLink size={13} />
            Open n8n
          </a>
        </div>
      </div>
      <div style={{ height }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onInit={onInit}
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={false}
          panOnScroll
          zoomOnScroll
          minZoom={0.35}
          maxZoom={1.4}
          proOptions={{ hideAttribution: true }}
        >
          <Background color="#334155" gap={20} size={1} />
          <Controls showInteractive={false} className="!bg-slate-800/90 !border-slate-600" />
          <MiniMap
            nodeColor="#6366f1"
            maskColor="rgba(15,23,42,0.75)"
            className="!bg-slate-900/80 !border-slate-600"
          />
        </ReactFlow>
      </div>
    </div>
  );
}
