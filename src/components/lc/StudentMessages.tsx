import { useQuery } from "@tanstack/react-query";
import { Inbox, MessageCircle } from "lucide-react";
import { useState } from "react";
import { formatMessageTime, studentConversationsQuery } from "@/lib/messages";
import type { Lecturer } from "@/lib/queries";
import { ChatThread } from "./ChatThread";
import { LecturerAvatar } from "./LecturerAvatar";

export function StudentMessages({ studentId, lecturers }: { studentId: string; lecturers: Lecturer[] }) {
  const { data: conversations = [], isLoading } = useQuery(studentConversationsQuery(studentId));
  const [selected, setSelected] = useState<string | null>(null);
  const byId = new Map(lecturers.map((l) => [l.id, l]));
  const activeLecturer = selected ? byId.get(selected) : undefined;
  const totalUnread = conversations.reduce((n, c) => n + c.unread, 0);

  return (
    <section id="messages" className="mt-10 scroll-mt-24">
      <div className="mb-4">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cobalt">Messages</p>
        <h2 className="flex items-center gap-2 font-display text-2xl font-semibold text-navy">
          Your conversations
          {totalUnread > 0 && (
            <span className="rounded-full bg-absent px-2.5 py-0.5 font-sans text-xs font-bold text-white">{totalUnread} unread</span>
          )}
        </h2>
        <p className="text-sm text-muted-foreground">
          Private chats with your lecturers. To start a new one, open a lecturer's profile and tap Message Lecturer.
        </p>
      </div>
      <div className="grid gap-4 rounded-3xl border border-border bg-card p-4 shadow-soft md:grid-cols-[minmax(0,280px)_minmax(0,1fr)]">
        <ul className="max-h-[480px] space-y-1 overflow-y-auto md:border-r md:border-border md:pr-3">
          {isLoading ? (
            <li className="px-3 py-6 text-sm text-muted-foreground">Loading…</li>
          ) : conversations.length === 0 ? (
            <li className="flex flex-col items-center px-3 py-10 text-center text-sm text-muted-foreground">
              <Inbox className="mb-2 size-8 text-cobalt" /> No messages yet. Pick a lecturer below and send your first message.
            </li>
          ) : (
            conversations.map((c) => {
              const l = byId.get(c.lecturer_id);
              const name = l?.name ?? "Lecturer";
              return (
                <li key={c.lecturer_id}>
                  <button
                    type="button"
                    onClick={() => setSelected(c.lecturer_id)}
                    className={
                      (c.lecturer_id === selected ? "bg-secondary " : "hover:bg-muted ") +
                      "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors"
                    }
                  >
                    <LecturerAvatar name={name} id={c.lecturer_id} size="sm" className="size-10 text-sm" />
                    <span className="grid min-w-0 flex-1 grid-cols-[minmax(0,1fr)_auto] gap-x-2">
                      <span className="truncate font-semibold text-navy">{name}</span>
                      {c.unread > 0 ? (
                        <span className="rounded-full bg-absent px-2 py-0.5 text-[11px] font-bold text-white">{c.unread}</span>
                      ) : (
                        <span />
                      )}
                      <span className="truncate text-xs text-muted-foreground">
                        {c.last_sender === "student" ? "You: " : ""}
                        {c.last_body}
                      </span>
                      <span className="text-[11px] text-muted-foreground">{formatMessageTime(c.last_at)}</span>
                    </span>
                  </button>
                </li>
              );
            })
          )}
        </ul>
        <div className="flex h-[480px] min-w-0 flex-col">
          {selected ? (
            <>
              <div className="flex items-center gap-3 border-b border-border pb-2">
                <LecturerAvatar name={activeLecturer?.name ?? "Lecturer"} id={selected} size="sm" className="size-10 text-sm" />
                <div className="min-w-0">
                  <p className="truncate font-display text-lg font-semibold text-navy">{activeLecturer?.name ?? "Lecturer"}</p>
                  {activeLecturer && <p className="truncate text-xs text-muted-foreground">{activeLecturer.department}</p>}
                </div>
              </div>
              <ChatThread key={selected} lecturerId={selected} studentId={studentId} viewer="student" otherName={activeLecturer?.name ?? "Lecturer"} />
            </>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center text-center text-sm text-muted-foreground">
              <MessageCircle className="mb-2 size-8 text-cobalt" /> Select a conversation to read replies and respond.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
