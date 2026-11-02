# Deploying FACTSHIELD AI on Vercel (direct mode)

Lovable Preview/hosting keeps the default `lovable` mode. Vercel uses `direct` mode with your own keys.
Never commit real values; set them in Vercel → Project → Settings → Environment Variables.

## Environment variables (server-only unless prefixed VITE_)
| Name | Required | Value |
|---|---|---|
| `VERIFY_PROVIDER_MODE` | yes | `direct` |
| `GEMINI_API_KEY` | yes | Google AI Studio key |
| `GEMINI_MODEL` | no | defaults to `gemini-2.5-flash` |
| `FIRECRAWL_API_KEY` | yes | firecrawl.dev key (`fc-...`); Lovable `lovc_` keys are rejected |
| `SUPABASE_URL` | optional pair | your Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | optional pair | your service role key (server-only) |
| `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`, `VITE_SUPABASE_PROJECT_ID` | yes (build) | public values used by the browser |
| `NITRO_PRESET` | yes | `vercel` |

Without the Supabase pair, provider denials stop only the current request (not remembered). Setting only one of the pair is reported as a missing setting.

## Supabase
Run `supabase-setup.sql` in your own project's SQL editor.

## Build settings
Framework: Other · Build command: `npm run build` (or `bun run build`) · Output: leave default (Nitro writes `.vercel/output`) · Node 20+.

## Steps
1. Create Gemini and Firecrawl keys; (optional) run the SQL in your Supabase.
2. Add the variables above in Vercel for Production (and Preview if used).
3. Redeploy (env changes need a new deployment).
4. Submit a real claim on the Vercel site. If setup is incomplete, the error's detail names the missing setting (never its value).

## Health check
Add `HEALTH_CHECK_TOKEN` (random, 16+ characters) in Vercel, then:
`curl -H "Authorization: Bearer <token>" https://<your-site>/api/public/health`
Returns `ai`, `search` and `database` states (`ok`, `missing`, `denied`, `unreachable`, `skipped`) and missing setting names — never key values or provider replies. Without the token it shows only mode and whether setup is complete, and makes no outbound calls.
