CREATE TABLE public.verification_service_blocks (
 service text PRIMARY KEY,
 status integer NOT NULL,
 message text NOT NULL,
 blocked_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.verification_service_blocks TO service_role;
ALTER TABLE public.verification_service_blocks ENABLE ROW LEVEL SECURITY;
COMMENT ON TABLE public.verification_service_blocks IS 'Server-only persistent terminal provider-access circuit state. No submitted content or reports stored here.';