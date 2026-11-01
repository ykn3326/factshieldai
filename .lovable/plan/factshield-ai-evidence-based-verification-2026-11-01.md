# FACTSHIELD AI: evidence-based verification

## Current diagnosis
- Verification is a frontend simulation: mock mode defaults on and is forced when the API base URL is missing.
- Keywords select fixed verdicts and explanations. Screenshot text is fixed; submitted web pages are not retrieved.
- Listed sources are preset links, not claim-specific evidence. The source-search service is not called by verification.
- No verification backend, OCR endpoint, search endpoint, database or real authentication implementation exists in this project. Current login and saved history are browser-local demos.
- A managed `LOVABLE_API_KEY` exists. The authenticated model catalog lists `openai/gpt-6-astra`; no generation request has been tested.
- No web-search connection is linked. The available Google Search Console connection is not a general web-evidence search API.

## Connections required
1. Enable Lovable Cloud for the server-side verification implementation.
2. Connect Firecrawl for live web search and page retrieval. Use its connection form for available managed credentials or a user-supplied Firecrawl API key; never collect keys in chat.
3. Use the existing managed AI key for claim extraction, image text reading, evidence comparison and English/Hindi/Punjabi report content. No separate OpenAI key is required.

AI and search usage may incur charges. If either service cannot be authorised or returns an access/billing error, stop live verification and display that failure—never substitute a demo result.

## What will change
- Preserve the current design, guest access, language choices, status labels, sharing and printable reports.
- Separate live verification from remaining demo login/history functionality. Clearly label those remaining demo features; converting account authentication and cloud-saved history is outside this verification change.
- Replace simulated verification with actual input processing, claim extraction, live evidence search and evidence comparison.
- Read submitted public links and extract actual text from screenshots; neither input may silently become a canned claim.
- Search broadly and with topic-relevant authoritative-source queries. Prefer relevant official government sources, research institutions and recognised fact-check organisations without treating a domain alone as proof.
- Display claim-specific source titles, exact retrieved URLs, relevant summaries, citation-linked comparisons and publication dates only when available.
- Provide Verified, Misleading, Unverified and Needs Review verdicts. Require supporting/contradicting evidence for decisive verdicts. Explain incomplete searches and distinguish insufficient evidence from a false claim; zero usable evidence should lead to Needs Review with explicit limitations.
- Show safe, specific service errors and stop loading when retrieval or AI fails. Do not fabricate missing evidence or retry terminal failures.
- Keep historical mock reports visibly marked Demo regardless of whether live verification is enabled.

## Technical approach
- Keep backend access behind `src/services/*`; add server-only search/AI helpers and a validated streaming endpoint for actual progress, errors and completion.
- Use the Lovable AI Gateway SDK with streamed OpenAI Responses calls and server-held credentials. Preserve gateway statuses, safe failure messages and run correlation.
- Validate input sizes and types server-side. Restrict links to public HTTP(S) pages and use the retrieval service rather than unrestricted server fetching.
- Treat retrieved pages as untrusted evidence, not instructions. Bind model citations to retrieved source IDs; reject invented URLs, unsupported decisive verdicts and malformed reports.
- Extend the report contract for source summaries, dates, evidence citations and search limitations. Preserve separate detected-content and chosen-report languages; add every interface label in all three dictionaries.
- Keep guest reports session-only. Do not use demo identities as authenticated server users or write private reports into a shared public table.
- Stop the live path from importing canned templates or falling back to mock mode on missing configuration.

## Verification before completion
- Add and run focused tests for evidence requirements, no-result limitations, citation validation, source prioritisation and service-failure behaviour.
- Search a concrete claim, retrieve relevant primary-source content, and inspect the actual source URL, title and evidence.
- Run that claim through the guest interface end to end; confirm the evidence-based report, language selection, citations and printable/shareable output.
- Check screenshot and public-link input paths, mobile/desktop presentation and error states.
- Report exactly what passed and any unavailable integration. Do not call the system fully functional based on a model listing or compilation alone.