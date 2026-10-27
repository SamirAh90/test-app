# MedborgaTest — archived project handoff

> **Update notice (2026-08-16):** This handoff predates the current Premium/payment system, advanced training architecture, simulator manifests/flags and account-management area. Its global-RTL description is obsolete: RTL is now landing-container-only while the app remains Swedish LTR. Use `MEDBORGATEST_CURRENT_PROJECT_DOCUMENTATION.md` as authoritative.

> Snapshot prepared from the actual repository on 2026-08-07. This is the best single context file to upload or paste into a new ChatGPT conversation. When this document conflicts with the older `Backend yet PROJECT_DOCUMENTATION.md`, the source code and this handoff are more current.

## 1. Product and purpose

MedborgaTest is a multilingual web application for preparing users for a future Swedish citizenship/civics test. It combines public information pages, study material, glossaries, practice quizzes, accounts and saved progress with a role-protected content administration portal.

Swedish is the canonical content language. English (`en`), Arabic (`ar`) and Farsi/Dari (`fa`) translations are supported. Arabic and Farsi/Dari use right-to-left page direction. The UI and question content share the selected i18next language, although the architecture conceptually treats UI translation and database content translation as separate concerns.

Main audiences:

- Visitors: landing page, information, glossary/study content and demo/practice flows.
- Registered users: authenticated “Min träning” dashboard and saved quiz progress.
- Editors: administer learning content.
- Admins: editor permissions plus users, analytics and system/user-cleanup settings.

The current repository is a development project, not yet production-ready. API URLs are hardcoded to localhost, payment is only represented by an unused model, and several advertised/product routes remain unimplemented.

## 2. Technology stack

Frontend:

- React 19.2, React DOM 19.2
- Vite 8
- React Router DOM 7 (declarative `BrowserRouter`, `Routes`, `Route`)
- i18next + react-i18next
- Axios plus native `fetch` (both are used)
- Material UI, Emotion and MUI X Data Grid for the admin portal
- TipTap rich-text editor for study material
- Plain CSS files and a shared design-system stylesheet for the public UI
- ESLint 10

Backend:

- Node.js, CommonJS modules
- Express 5.2
- MySQL through Sequelize 6 and mysql2
- JWT authentication (`jsonwebtoken`)
- Password hashing with `bcryptjs`
- CORS, dotenv
- Nodemon for local development

There is no TypeScript, automated test suite, Docker configuration, CI/CD pipeline or deployment configuration in the repository.

## 3. Repository layout

```text
MedborgaTest/
├── frontend/                     React/Vite public app and admin portal
│   ├── public/                   favicon and SVG icon sprite
│   ├── src/
│   │   ├── admin/                admin pages, layout, context, services, components
│   │   ├── assets/               logo image
│   │   ├── components/           shared/public and quiz components
│   │   ├── contexts/             public AuthContext
│   │   ├── hooks/                quiz and analytics hooks
│   │   ├── i18n/                 initialization and sv/en/ar/fa locale JSON
│   │   ├── pages/                route-level wrappers
│   │   ├── sections/             substantial public-page UI sections
│   │   ├── services/             public API clients
│   │   ├── App.jsx               complete route map
│   │   └── main.jsx              app entry point/providers
│   └── package.json
├── backend/
│   ├── database/                 schema checks and seed/import SQL
│   ├── src/
│   │   ├── config/database.js    Sequelize connection
│   │   ├── controllers/          public and admin business logic
│   │   ├── middlewares/          JWT and role authorization
│   │   ├── models/               Sequelize models
│   │   ├── routes/               public and admin Express routers
│   │   ├── utils/generateToken.js
│   │   └── server.js             associations, route mounting, startup
│   ├── .env                      local secrets (never share its values)
│   └── package.json
├── admin.md                      older admin planning/documentation
├── Backend yet PROJECT_DOCUMENTATION.md
├── MEDBORGATEST_FRONTEND_DOCUMENTATION.md
└── rember to do .txt             informal backlog/history; partly obsolete
```

The workspace is not currently a Git repository (no usable `.git` root was detected).

## 4. How the application starts

Backend setup:

```powershell
cd backend
npm install
npm run dev
```

Required `backend/.env` keys (values intentionally omitted):

```dotenv
PORT=5000
DB_NAME=...
DB_USER=...
DB_PASSWORD=...
DB_HOST=...
DB_PORT=3306
JWT_SECRET=...
JWT_EXPIRES_IN=...
```

The server authenticates with MySQL, calls `sequelize.sync()` and listens on `PORT` (default 5000). Root health response: `GET http://localhost:5000/`.

Frontend setup in a second terminal:

```powershell
cd frontend
npm install
npm run dev
```

Useful frontend commands are `npm run build`, `npm run lint`, and `npm run preview`. Vite normally serves at `http://localhost:5173`. All frontend API clients currently hardcode `http://localhost:5000/api`; there is no `VITE_API_URL` yet.

Database SQL assets:

- `new.sql`: database evolution/data work.
- `medborgatest_20_questions_multilingual.sql`: multilingual question dataset.
- `demo-questions-seed.sql`: demo question data.
- `inserting-new-studymaterial.sql`: study material inserts.
- `database-check.sql`: creates/checks `subject_materials`, `subject_glossary`, and `subject_sources`.

Sequelize sync creates missing model tables but should not be treated as a production migration strategy.

## 5. Runtime architecture and data flow

```text
Browser / React
  ├─ public pages and quiz hooks
  ├─ AuthContext (public JWT)
  └─ AdminAuthContext (admin JWT)
          │ HTTP JSON
          ▼
Express /api
  ├─ public routes
  ├─ JWT middleware (required or optional)
  ├─ editor/admin role middleware
  └─ controllers / inline route logic
          │ Sequelize
          ▼
MySQL
```

Quiz flow:

1. `useQuiz` fetches all questions; `useSubjectQuiz` fetches one subject’s questions.
2. Both take the first 15 items by default. There is no randomization; database ID order determines the questions.
3. The selected answer ID is posted to the server. Correctness is never returned in the question-list response.
4. The server verifies the answer belongs to the question, returns `correct`, localized explanation and the subject’s sources.
5. The client builds an in-memory result array and navigates to `/results` at completion.
6. An authenticated result can be persisted as a `QuizAttempt` with child `QuizAnswer` records.
7. `/progress/summary` powers the registered user’s training overview.

Translation flow:

- Swedish question/answer text is stored directly on `questions` and `answers`.
- Other question/explanation text lives in `question_translations`.
- Other answer text lives in `answer_translations`.
- `?language=sv|en|ar|fa` controls included translation records and returned explanations.
- The frontend locale is saved under `medborgatest-language`; `<html lang>` and `dir` are updated, using RTL for `ar` and `fa`.

## 6. Frontend route map

Public routes:

| Route | Purpose |
|---|---|
| `/` | Landing page: announcement, navigation, hero, demo question, features, process, stats, disclaimer, CTA, FAQ and footer |
| `/trainer` | Training mode/subject selection |
| `/trainer/demo` | 15-question demo quiz |
| `/trainer/subject/:subjectId` | Quiz limited to one subject |
| `/results` | Quiz result, performance breakdown, registration/training calls to action |
| `/register` | Account registration |
| `/login` | Public user login |
| `/om-provet` | About the citizenship test |
| `/studiematerial` | All study subjects/material navigation |
| `/amnen/:subjectSlug` | One subject’s educational material, terms, sources and training link |
| `/amnen/:subjectSlug/begrepp` | One subject’s glossary |
| `/begrepp` | Complete glossary grouped by subject |
| `/min-traning` | JWT-protected registered-user training dashboard |

Admin routes:

| Route | Permission/purpose |
|---|---|
| `/admin/login` | Editor/admin login |
| `/admin` | Editor/admin dashboard |
| `/admin/subjects` | Subject CRUD |
| `/admin/materials` | Study material management with rich text |
| `/admin/glossary` | Glossary CRUD |
| `/admin/questions` | Questions and answers CRUD |
| `/admin/sources` | Source CRUD |
| `/admin/translations` | Question, explanation and answer translations |
| `/admin/users` | Admin-only user CRUD/status/roles/premium |
| `/admin/analytics` | Admin-only analytics |
| `/admin/settings` | Admin-only user cleanup settings and execution |

Known navigation gap: UI code navigates to `/premium`, but no `/premium` route exists. There is also no catch-all 404 route.

## 7. Frontend organization and state

- Route-level files in `pages/` are generally thin wrappers around components in `sections/`.
- Public authentication is managed by `AuthContext.jsx`; it restores a token, calls `/auth/me`, exposes registration/login/logout and guards `/min-traning` through `ProtectedRoute`.
- Admin authentication is separate in `AdminAuthContext.jsx` and `AdminProtectedRoute.jsx`.
- Question fetching/checking is centralized in `questionService.js`; `useQuiz.js` and `useSubjectQuiz.js` manage quiz state.
- `useAnalyticsSection.js` is used for analytics-related UI tracking.
- `analyticsService.js` creates a persistent anonymous session UUID and sends device, language, referrer and UTM metadata. Analytics failures are deliberately non-blocking.
- Demo results can be stored temporarily in localStorage as `medborgatest_demo_result`, then associated with the account after registration.
- The analytics session key is `medborgatest_analytics_session_id`.
- Authentication and admin services use localStorage tokens; inspect the respective contexts before changing key names because analytics currently checks both `token` and `authToken`.
- API access is inconsistent: `api.js` uses Axios, while most domain services use `fetch` and repeat response parsing/base URLs.

## 8. Backend API

All API responses are JSON. Protected requests use `Authorization: Bearer <JWT>`.

### Public/content API

| Method and path | Authentication | Behavior |
|---|---|---|
| `GET /` | none | API health/message |
| `GET /api/subjects` | none | All subjects with question counts |
| `GET /api/questions?language=sv` | none | All questions, subject, ordered answers, optional translations |
| `GET /api/questions/subject/:subjectId?language=sv` | none | Same shape filtered by subject |
| `POST /api/questions/:questionId/answer?language=sv` | none | Body `{answerId}`; returns `{correct, explanation, sources}` |
| `GET /api/study/:subjectIdentifier` | none | Study material by numeric ID or slug, glossary and sources |
| `GET /api/glossary` | none | Subjects and their ordered glossary words |
| `POST /api/analytics/events` | optional JWT | Saves anonymous or user-linked analytics event |

### Account/progress API

| Method and path | Authentication | Behavior |
|---|---|---|
| `POST /api/auth/register` | none | firstName, lastName, email, password; validates fields and 8-character minimum; hashes password; returns JWT/user |
| `POST /api/auth/login` | none | Email/password login; updates last login and returns JWT/user |
| `GET /api/auth/me` | JWT | Current safe user record |
| `POST /api/progress/attempt` | JWT | Validates and saves attempt plus answer rows transactionally |
| `GET /api/progress/summary` | JWT | Aggregate progress, subject statistics and recent attempts |

### Admin API

Admin login endpoints:

- `POST /api/admin/auth/login`
- `GET /api/admin/auth/me` — JWT plus editor/admin role
- `GET /api/admin/dashboard` — JWT plus editor/admin role

Editor/admin content routes:

- Subjects: `GET /api/admin/subjects`, `GET /:subjectId`, `POST /`, `PUT /:subjectId`, `DELETE /:subjectId`.
- Materials: `GET /api/admin/materials`, `GET /:subjectId`, `PUT /:subjectId`, `DELETE /:subjectId`.
- Glossary: `GET /api/admin/glossary`, `GET /:termId`, `POST /`, `PUT /:termId`, `DELETE /:termId`.
- Questions: `GET /api/admin/questions`, `GET /:questionId`, `POST /`, `PUT /:questionId`, `DELETE /:questionId`.
- Sources: `GET /api/admin/sources`, `GET /:sourceId`, `POST /`, `PUT /:sourceId`, `DELETE /:sourceId`.
- Translations: `GET /api/admin/translations/questions`, `GET /questions/:questionId`, `PUT /questions/:questionId`.

Admin-only routes:

- Users: list, create, get, update, activate, deactivate and delete under `/api/admin/users`.
- Analytics: `GET /api/admin/analytics`.
- Settings: `GET /api/admin/settings`, `PUT /user-cleanup`, `GET /user-cleanup/preview`, `POST /user-cleanup/run`.

Read the corresponding controller before changing an admin request/response shape; the frontend admin service is `frontend/src/admin/services/adminApi.js`.

## 9. Authorization model

User roles are `user`, `editor`, and `admin`.

- `authMiddleware`: requires a valid JWT, loads the user, rejects missing/deleted/inactive users, and sets `req.user`.
- `optionalAuth`: silently treats missing, invalid or inactive JWTs as anonymous; used for analytics.
- `requireEditor`: permits `editor` and `admin`.
- `requireAdmin`: permits only `admin`.
- JWT payload contains `userId`; expiry is controlled by `JWT_EXPIRES_IN`.
- Passwords use bcrypt hashing and are excluded from normal API user responses.

Content CRUD is deliberately editor-accessible. User management, analytics and cleanup settings are deliberately admin-only.

## 10. Database model reference

Every model uses Sequelize timestamps (`createdAt`, `updatedAt`) unless noted otherwise.

| Model / table | Main fields |
|---|---|
| `User` / `users` | id, firstName, lastName, unique email, password hash, role (`user/editor/admin`), isActive, deactivatedAt, lastLoginAt, isPremium, emailVerified |
| `Subject` / `subjects` | id, unique name, unique slug, description |
| `Question` / `questions` | id, subjectId, question, explanation, difficulty (`easy/medium/hard`) |
| `Answer` / `answers` | id, questionId, answer, isCorrect, displayOrder |
| `QuestionTranslation` / `question_translations` | id, questionId, language, translatedQuestion, translatedExplanation |
| `AnswerTranslation` / `answer_translations` | id, answerId, language, translatedAnswer |
| `QuizAttempt` / `quiz_attempts` | id, userId, quizType (`demo/free/subject/simulator`), score, totalQuestions, percentage, completedAt |
| `QuizAnswer` / `quiz_answers` | id, attemptId, questionId, subjectId, selectedAnswerId, correct |
| `SubjectMaterial` / `subject_materials` | id, unique subjectId, title, introduction, long-text HTML body |
| `SubjectGlossary` / `subject_glossary` | id, subjectId, word, definition, displayOrder |
| `SubjectSource` / `subject_sources` | id, subjectId, title, URL, displayOrder |
| `AnalyticsEvent` / `analytics_events` | id, optional userId, sessionId, eventName, pagePath, JSON metadata; indexed for reporting |
| `AppSetting` / `app_settings` | id, unique key, text value, valueType (`string/number/boolean/json`), description |
| `PaymentTransaction` / `payment_transactions` | id, optional userId/email, amount in smallest unit, currency, method (`card/swish/klarna`), status, provider IDs/timestamps/metadata |

`PaymentTransaction` is defined but is not imported into `server.js`, associated with `User`, exposed through routes, or used by the frontend. Therefore payments/premium purchasing are not implemented.

Relationships configured in `server.js`:

- Subject 1—many Questions (cascade delete)
- Question 1—many Answers (cascade delete)
- Question 1—many QuestionTranslations (cascade delete)
- Answer 1—many AnswerTranslations (cascade delete)
- User 1—many QuizAttempts (cascade delete)
- QuizAttempt 1—many QuizAnswers (cascade delete)
- Question, Subject and selected Answer each relate to many QuizAnswers (cascade delete)
- Subject 1—1 SubjectMaterial (cascade delete)
- Subject 1—many SubjectGlossary entries (cascade delete)
- Subject 1—many SubjectSources (cascade delete)
- User 1—many AnalyticsEvents (user deletion sets userId to null)

Potential schema-hardening gap: translation models do not declare composite unique constraints on `(questionId, language)` or `(answerId, language)` in the Sequelize definitions.

## 11. Subject/content domain

The intended curriculum contains 13 subjects:

1. Landet Sverige
2. Sveriges demokratiska system
3. Så styrs Sverige
4. Politiska val och partier
5. Lag och rätt
6. Medier och källkritik
7. Mänskliga rättigheter
8. Arbetsmarknad och ekonomi
9. Välfärdssamhället
10. Sveriges moderna historia
11. Sverige och omvärlden
12. Religion i Sverige
13. Traditioner och högtider

Do not hardcode questions in React. Questions, answers, explanations, translations, educational material, terms and sources belong in MySQL and are managed through the admin portal.

Question answers are explicitly sorted by `displayOrder`, then ID. Questions are sorted by ID and then sliced on the client; this means “random practice” is not currently random.

## 12. Admin portal details

The admin UI is a separate visual system built mainly with MUI. `AdminLayout` contains a sidebar/topbar and an outlet. Admin pages are data-driven and use dialogs/tables:

- Reusable page header and DataGrid wrappers.
- Subject edit dialog.
- Material table, rich text edit dialog and preview.
- Glossary table/edit dialog.
- Question table/edit dialog including answer management.
- Translation table/dialog for `en`, `ar`, and `fa` question/explanation/answers.
- Source table/edit dialog.
- User table, create/view/edit dialogs, activation and deletion confirmation.
- Analytics dashboard.
- Settings interface for inactive-user cleanup policy, preview and execution.

The older `admin.md` and informal backlog describe phases that have since largely been implemented. Treat them as design history, not an exact current-status authority.

## 13. Implemented versus incomplete

Implemented in source:

- Public responsive marketing/information UI.
- Four-language UI infrastructure and RTL switching.
- Database-backed subjects, questions, answers and translations.
- Demo and per-subject quiz flows with server-side answer checking.
- Results experience.
- Registration/login/current-user JWT flow.
- Saved quiz attempts and user progress summary.
- Study material, subject pages, glossary and sources.
- Anonymous/authenticated analytics event capture and admin reporting.
- Role-based admin portal covering content, translations, users, analytics and cleanup settings.

Incomplete, missing or only modeled/planned:

- Full exam simulator behavior despite `simulator` being an allowed attempt type.
- Premium checkout/payment; `/premium` is linked but has no route.
- Payment provider integration; payment model is dormant.
- Email verification and password reset despite an `emailVerified` field.
- Random question selection and robust exam rules.
- Production deployment and environment-aware API URLs.
- Automated tests and CI.
- Database migrations/backups/restore/system-health UI.
- Audit logs and advanced maintenance.
- A not-found route/error boundary.
- Confirming/populating complete production-quality content for all 13 subjects.

## 14. Important risks and technical debt

Highest-priority production concerns:

1. **Secrets:** never paste `backend/.env` values into ChatGPT or commit them. Rotate secrets if they have ever been shared.
2. **Hardcoded API origin:** all services assume localhost. Introduce a shared `VITE_API_URL` configuration.
3. **CORS is unrestricted:** configure allowed production origin(s).
4. **No rate limiting/security headers:** add rate limits (especially login/register/analytics), Helmet, payload limits and robust validation.
5. **`sequelize.sync()` at startup:** replace with versioned migrations for production.
6. **No tests:** auth, authorization, admin destructive actions, answer checking and progress transactions need integration tests; key React flows need component/E2E coverage.
7. **Rich HTML content:** study material is rendered/previewed as rich text; verify sanitization at write and render boundaries to prevent stored XSS.
8. **Analytics privacy:** metadata includes traffic/device data. Define consent, retention, minimization and GDPR/privacy behavior before launch.
9. **Account cleanup:** deletion is destructive; ensure preview, authorization, logging, transaction safety and recovery policy.
10. **Data constraints:** add uniqueness/index constraints for translations and review foreign keys/indexes against the actual database.
11. **Payment model:** do not infer that premium payments work merely because a model exists.
12. **API consistency:** consolidate duplicate `fetch`/Axios clients, base URL and error/token handling.
13. **Question selection:** client-side `slice(0, 15)` repeatedly shows the earliest questions and fetches more data than needed; move limit/randomization/session construction server-side.
14. **Documentation encoding:** old docs/terminal output show mojibake for Swedish/Arabic emoji text. Source files should be preserved and edited as UTF-8.
15. **No Git history in this workspace:** initialize/use source control before substantial collaboration.

The informal TODO says ordinary login may not check `isActive`; verify `authController.login` before release even though protected requests do reject inactive accounts. An inactive account must be rejected at login as well as on subsequent authenticated requests.

## 15. Recommended development order

1. Put the workspace under Git and create a clean baseline commit.
2. Add `.env.example`, a root README and shared environment-aware API client without exposing secrets.
3. Add backend validation/error middleware, security headers, rate limiting and restricted CORS.
4. Add Sequelize migrations and constraints, then stop relying on sync for production schema evolution.
5. Build automated API tests for auth/roles/questions/progress/admin routes and basic frontend flow tests.
6. Complete and verify all 13 subjects’ material, glossary, sources, questions and translations.
7. Move quiz composition/randomization to the backend and implement a real exam simulator.
8. Add the premium route and a secure provider-backed payment workflow only after product/pricing decisions.
9. Add email verification, forgotten-password and account/privacy workflows.
10. Prepare production hosting, observability, backups, privacy documentation and deployment checks.

## 16. Guidance for another ChatGPT session

Upload this file plus only the specific source files relevant to the next task. State whether you want analysis only or code changes. Ask the assistant to preserve current architecture, inspect real files before proposing edits, avoid hardcoding content, keep Swedish as canonical content, preserve all four languages/RTL, and respect the `user/editor/admin` authorization boundary.

Suggested opening prompt:

> I am building MedborgaTest. Read the attached `CHATGPT_PROJECT_HANDOFF.md` first; it describes the current source as of 2026-08-07. Treat source files I attach afterward as the final authority. Do not expose secrets or invent endpoints. Preserve Swedish canonical content, English/Arabic/Farsi-Dari translations, RTL behavior, database-backed content, and the user/editor/admin permission model. Before coding, summarize the relevant existing flow and list exactly which files must change. My next task is: [describe task].

## 17. Source-of-truth rule

Use this priority when facts conflict:

1. Current source code and `package.json` files.
2. Current database schema/data after inspecting it safely.
3. This handoff document.
4. `admin.md`, `rember to do .txt`, and the two older documentation files.

The old documents contain valuable product intent but describe earlier milestones and may call already-built features “future” work.
