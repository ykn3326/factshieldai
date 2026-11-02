-- Run once in YOUR OWN Supabase project (SQL editor) for Vercel direct mode.
-- Not applied to the Lovable Cloud database. Mirrors public.verification_service_blocks.
CREATE TABLE IF NOT EXISTS public.verification_service_blocks (
  service text PRIMARY KEY,
  status integer NOT NULL,
  message text NOT NULL,
  blocked_at timestamptz NOT NULL DEFAULT now()
);
-- Server-only table: only the service role may touch it; no anon/authenticated access.
REVOKE ALL ON public.verification_service_blocks FROM anon, authenticated;
GRANT ALL ON public.verification_service_blocks TO service_role;
ALTER TABLE public.verification_service_blocks ENABLE ROW LEVEL SECURITY;
-- No policies on purpose: RLS denies every non-service-role request.

-- To clear a block after fixing billing/access with your provider:
-- DELETE FROM public.verification_service_blocks WHERE service = 'ai';
