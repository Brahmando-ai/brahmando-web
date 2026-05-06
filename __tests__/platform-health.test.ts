import { mapHealthResponse, type StatusMap } from "@/lib/platform-health";

describe("mapHealthResponse", () => {
  it("maps known statuses correctly", () => {
    const result: StatusMap = mapHealthResponse({
      services: {
        api: { status: "online", responseTimeMs: 42 },
        mcp: { status: "protected", responseTimeMs: 88 },
        ollama: { status: "offline" },
      },
    });

    expect(result.api).toEqual({ status: "online", responseTimeMs: 42 });
    expect(result.mcp).toEqual({ status: "protected", responseTimeMs: 88 });
    expect(result.ollama).toEqual({ status: "offline", responseTimeMs: undefined });
  });

  it("normalises unknown status strings to 'offline'", () => {
    const result = mapHealthResponse({
      services: {
        foo: { status: "degraded" },
      },
    });

    expect(result.foo.status).toBe("offline");
  });

  it("preserves responseTimeMs when present", () => {
    const result = mapHealthResponse({
      services: {
        agents: { status: "online", responseTimeMs: 123 },
      },
    });

    expect(result.agents.responseTimeMs).toBe(123);
  });

  it("handles an empty services object", () => {
    const result = mapHealthResponse({ services: {} });
    expect(result).toEqual({});
  });
});
