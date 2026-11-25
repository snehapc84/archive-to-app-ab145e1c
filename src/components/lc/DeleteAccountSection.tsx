import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { deleteLecturerAccount } from "@/lib/auth.functions";

export function DeleteAccountSection() {
  const del = useServerFn(deleteLecturerAccount);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function confirm(e: React.FormEvent) {
    e.preventDefault();
    if (!password) return setError("Enter your password to confirm.");
    setBusy(true);
    setError(null);
    const res = await del({ data: { password } }).catch(() => ({ ok: false as const, error: "Couldn't delete your account. Please try again." }));
    if (!res.ok) {
      setBusy(false);
      setError(res.error);
      return;
    }
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    toast.success("Your lecturer account has been deleted.");
    navigate({ to: "/", replace: true });
  }

  return (
    <section className="mt-10 rounded-3xl border border-destructive/30 bg-card p-6 shadow-soft">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cobalt">Account settings</p>
      <div className="mt-1 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl font-semibold text-navy">Delete account</h2>
          <p className="text-sm text-muted-foreground">
            Leaving the college? Permanently remove your profile, availability and timetable from Lecturer Connect.
          </p>
        </div>
        <Button variant="destructive" onClick={() => setOpen(true)}>
          <Trash2 /> Delete Account
        </Button>
      </div>

      <AlertDialog
        open={open}
        onOpenChange={(o) => {
          if (busy) return;
          setOpen(o);
          if (!o) {
            setPassword("");
            setError(null);
          }
        }}
      >
        <AlertDialogContent className="rounded-2xl">
          <form onSubmit={confirm}>
            <AlertDialogHeader>
              <AlertDialogTitle className="font-display text-xl text-navy">Delete your account?</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to permanently delete your lecturer account? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="my-4 space-y-2">
              <Label htmlFor="delete-password">Confirm your password</Label>
              <Input
                id="delete-password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                aria-invalid={!!error}
              />
              {error && <p className="text-sm text-destructive">{error}</p>}
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel type="button" disabled={busy}>Cancel</AlertDialogCancel>
              <Button type="submit" variant="destructive" disabled={busy}>
                {busy ? "Deleting…" : "Confirm Delete"}
              </Button>
            </AlertDialogFooter>
          </form>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
}
