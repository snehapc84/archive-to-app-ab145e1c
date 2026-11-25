import { describe, expect, it } from "vitest";
import { groupStudentConversations } from "./messages";

describe("student conversations", () => {
  it("groups by lecturer, counts only unread lecturer replies, newest first", () => {
    const out = groupStudentConversations([
      { lecturer_id: "a", sender: "student", body: "hi", created_at: "2026-01-01T10:00:00Z", read_at: null },
      { lecturer_id: "a", sender: "lecturer", body: "hello", created_at: "2026-01-01T11:00:00Z", read_at: null },
      { lecturer_id: "b", sender: "student", body: "q", created_at: "2026-01-02T09:00:00Z", read_at: null },
      { lecturer_id: "a", sender: "lecturer", body: "old", created_at: "2026-01-01T10:30:00Z", read_at: "2026-01-01T10:31:00Z" },
    ]);
    expect(out.map((c) => c.lecturer_id)).toEqual(["b", "a"]);
    expect(out[1]?.unread).toBe(1);
    expect(out[1]?.last_body).toBe("hello");
    expect(out[0]?.unread).toBe(0);
  });
});
