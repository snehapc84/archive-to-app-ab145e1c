import { createFileRoute } from "@tanstack/react-router";
import { Presentation } from "lucide-react";
import { LecturerAuthForm } from "@/components/lc/LecturerAuthForm";
import { LoginLayout } from "@/components/lc/LoginLayout";

export const Route = createFileRoute("/login/lecturer")({
  head: () => ({
    meta: [
      { title: "Lecturer Login — Lecturer Connect" },
      { name: "description", content: "Log in as a lecturer to update your availability and manage your weekly timetable." },
      { property: "og:title", content: "Lecturer Login — Lecturer Connect" },
      { property: "og:description", content: "Update your availability and timetable so students know when to find you." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: LecturerLogin,
});

function LecturerLogin() {
  return (
    <LoginLayout
      icon={<Presentation className="size-7" />}
      eyebrow="For lecturers"
      title="Lecturer Login"
      subtitle="Log in with your password, or register a new lecturer account."
      switchTo={{ to: "/login/student", label: "I'm a student" }}
    >
      <LecturerAuthForm />
      <p className="mt-5 text-center text-xs text-muted-foreground">
        Your account is private — only you can manage your profile, timetable and messages.
      </p>
    </LoginLayout>
  );
}
