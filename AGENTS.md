<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Project rules
- UI backend access goes through `src/services/*`; live verification uses a validated streaming TanStack endpoint and server-only helpers, never mock fallback. `USE_MOCK_DATA` applies only to legacy demo account/history features, so verification can be live without misrepresenting account security.
- All UI text comes from typed dictionaries in `src/i18n` (`en.ts` defines the `Dict` shape; `hi.ts`/`pa.ts` must match) — every string must exist in all three languages.
- Content language (detected) and report language (user-chosen) are separate state; report screens render labels from `dictionaries[reportLang]`, not the global UI language.
- Mock data must always be visibly labelled as demo; never claim real verification or accuracy percentages.
- App state lives in React contexts under `src/context` (Language, Auth, Verification); guests' reports use sessionStorage only.
- AI calls use request-scoped streamed Responses and gateway-issued correlation IDs; provider access blocks persist in a server-only Cloud table so reloads cannot automatically replay denied work.
- Live verdicts validate claim-bound quotations against retrieved page text and resolve citation IDs to server-held URLs; model output cannot invent sources or publication dates.
