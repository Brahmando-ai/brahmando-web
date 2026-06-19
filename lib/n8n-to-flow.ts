import type { Edge, Node } from "@xyflow/react";

export type N8nNode = {
  id: string;
  name: string;
  type: string;
  position: [number, number];
};

export type N8nWorkflowJson = {
  name: string;
  nodes: N8nNode[];
  connections: Record<
    string,
    {
      main?: Array<Array<{ node: string; type?: string; index?: number }>>;
    }
  >;
};

export function simplifyN8nType(type: string): string {
  const base = type.split(".").pop() ?? type;
  const labels: Record<string, string> = {
    webhook: "Webhook",
    function: "Function",
    switch: "Switch",
    executeWorkflow: "Sub-workflow",
    executeWorkflowTrigger: "Trigger",
    httpRequest: "HTTP",
    if: "If",
    noOp: "No-op",
  };
  return labels[base] ?? base;
}

export function n8nToFlow(workflow: N8nWorkflowJson): { nodes: Node[]; edges: Edge[] } {
  const nameToId = new Map(workflow.nodes.map((n) => [n.name, n.id]));

  const nodes: Node[] = workflow.nodes.map((n) => ({
    id: n.id,
    type: "n8nNode",
    position: { x: n.position[0], y: n.position[1] },
    data: {
      label: n.name,
      nodeType: simplifyN8nType(n.type),
      rawType: n.type,
    },
  }));

  const edges: Edge[] = [];
  for (const [sourceName, conn] of Object.entries(workflow.connections)) {
    const sourceId = nameToId.get(sourceName);
    if (!sourceId) continue;

    for (const outputGroup of conn.main ?? []) {
      for (const target of outputGroup) {
        const targetId = nameToId.get(target.node);
        if (!targetId) continue;
        edges.push({
          id: `${sourceId}->${targetId}`,
          source: sourceId,
          target: targetId,
          animated: target.node.toLowerCase().includes("execute"),
          style: { stroke: "#8b5cf6", strokeWidth: 2 },
        });
      }
    }
  }

  return { nodes, edges };
}
