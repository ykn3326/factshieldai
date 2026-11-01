# Welcome to your Lovable project

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Open your project in the [Lovable editor](https://lovable.dev) and keep building.

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: connect the project to GitHub and every change made in Lovable is committed straight to your repository.
- **Full ownership**: this code is yours. Push to your repository and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

## Built with

- TanStack Start
- TypeScript
- React
- Tailwind CSS

## FACTSHIELD AI — Integration Guide

Verification is live: `verificationService` submits to the validated, guest-accessible
TanStack endpoint `/api/public/verify`, which streams real processing progress.
The endpoint reads images with AI, retrieves public links and evidence using Firecrawl,
and compares claim-bound quotations through the Lovable AI Gateway Responses API.
Credentials (`LOVABLE_API_KEY`, gateway-backed `FIRECRAWL_API_KEY`) are server-only.
Publication dates come only from retrieval metadata, never model-generated dates.
Search snippets alone cannot support a decisive verdict; every decisive citation is
checked against retrieved page text. Service failures never fall back to sample reports.

`USE_MOCK_DATA` in `src/lib/config.ts` now applies only to **legacy demo accounts/history**
and unused legacy adapter examples. It does not switch verification back to demo mode.
Guests' reports stay in sessionStorage; demo account history is browser-local and not
a secure authenticated cloud history. Existing sample reports remain labelled Demo.
Image input currently supports JPG, PNG, WEBP and GIF, up to 10 MB.

| Service | Replace mock with |
| --- | --- |
| `verificationService` | Live streaming TanStack endpoint; a future Flask adapter can preserve the service interface |
| `ocrService` | Unused legacy example; actual image extraction is in the live server pipeline |
| `languageDetectionService` | Backend language-ID model (demo uses Unicode script ranges) |
| `sourceSearchService` | Unused legacy example; actual Firecrawl search is in the live server pipeline |
| AI/LLM claim analysis | Server-only, streamed OpenAI Responses through Lovable AI Gateway |
| `authService` | Firebase Auth or Supabase Auth (same `login/signup/guest/logout` shape) |
| `reportService` | `GET/POST/DELETE /api/reports` |

**API keys must live on the backend or in server environment variables only.** Nothing
secret may use the `VITE_` prefix.

Provider access/credit blocks persist in the server-only `verification_service_blocks`
table. There are no automated retries or background jobs. After the owner restores
access, an authorised maintenance action must clear the relevant block before a fresh
user check. Do not automatically clear or probe provider denials on reload.
