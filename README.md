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

This is a frontend prototype. All backend calls live in `src/services/*` behind typed
interfaces; with `VITE_USE_MOCK=true` (or no `VITE_API_BASE_URL`) they return clearly
labelled demo data. Config is in `src/lib/config.ts`.

| Service | Replace mock with |
| --- | --- |
| `verificationService` | Python/Flask API: `POST /api/verify/{text,image,link}` → job, `GET /api/jobs/:id` → `{ steps, contentLanguage, report }` |
| `ocrService` | OCR engine on the backend (Tesseract, cloud vision) via `POST /api/ocr` |
| `languageDetectionService` | Backend language-ID model (demo uses Unicode script ranges) |
| `sourceSearchService` | Trusted-source / fact-check search API via `POST /api/sources` |
| AI/LLM claim analysis | Called by the Flask pipeline, never from the browser |
| `authService` | Firebase Auth or Supabase Auth (same `login/signup/guest/logout` shape) |
| `reportService` | `GET/POST/DELETE /api/reports` |

**API keys must live on the backend or in server environment variables only.** Nothing
secret may use the `VITE_` prefix.
