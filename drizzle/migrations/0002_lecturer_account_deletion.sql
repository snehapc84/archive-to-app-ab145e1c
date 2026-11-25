ALTER TABLE public.lecturers ADD COLUMN deleted_at timestamptz;

DROP POLICY "Students and lecturers can view lecturers" ON public.lecturers;
CREATE POLICY "Students and lecturers can view lecturers" ON public.lecturers FOR SELECT TO authenticated
USING (deleted_at IS NULL AND (public.has_role(auth.uid(), 'student'::public.app_role) OR public.has_role(auth.uid(), 'lecturer'::public.app_role)));

DROP POLICY "Students send messages" ON public.messages;
CREATE POLICY "Students send messages" ON public.messages FOR INSERT TO authenticated
WITH CHECK (sender = 'student' AND student_id = auth.uid() AND read_at IS NULL
  AND public.has_role(auth.uid(), 'student'::public.app_role)
  AND EXISTS (SELECT 1 FROM public.lecturers l WHERE l.id = lecturer_id AND l.deleted_at IS NULL));