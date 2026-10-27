# MedborgaTest — AI agent project map

Updated from the source code: 2026-08-16.

> For the deepest current status—including Premium, coupons, Premium codes, Stripe Checkout, accomplishments and remaining work—read `MEDBORGATEST_CURRENT_PROJECT_DOCUMENTATION.md` first.

## System map

```text
React/Vite browser application
├── Public website and study experience
├── Quiz and result flows
├── Registered-user training dashboard
└── Admin portal
        │ JSON over HTTP
        ▼
Node.js / Express API
├── Public content API
├── JWT account and progress API
├── Analytics ingestion API
└── Role-protected admin API
        │ Sequelize ORM
        ▼
MySQL database
```

## Root structure

```text
MedborgaTest/
├── frontend/                         React 19 + Vite 8 application
│   ├── public/                       Static SVG/favicon assets
│   └── src/
│       ├── main.jsx                  Browser entry point and global providers
│       ├── App.jsx                   Complete frontend route map
│       ├── pages/                    Thin route-level page wrappers
│       ├── sections/                 Main public page/feature implementations
│       ├── components/               Shared layout, header, auth and quiz UI
│       ├── hooks/                    Quiz and analytics state logic
│       ├── contexts/                 Public user authentication state
│       ├── services/                 Public API clients
│       ├── i18n/                     sv/en/ar/fa translation configuration
│       ├── styles/                   Shared public design system
│       ├── assets/                   Images
│       └── admin/
│           ├── pages/                Admin route screens
│           ├── components/           Tables, dialogs, sidebar, topbar
│           ├── contexts/             Separate admin authentication state
│           ├── layouts/              Admin shell and nested-route outlet
│           ├── services/adminApi.js  All admin HTTP operations
│           └── theme/                MUI admin theme
├── backend/                          Express 5 + Sequelize API
│   ├── src/
│   │   ├── server.js                 Models, associations, route mounting/startup
│   │   ├── config/database.js        MySQL/Sequelize connection
│   │   ├── routes/                   URL and middleware definitions
│   │   ├── controllers/              Business logic and response construction
│   │   ├── models/                   Sequelize table definitions
│   │   ├── middlewares/              JWT and role authorization
│   │   └── utils/generateToken.js    JWT generation
│   ├── database/                     Seed/import/schema-check SQL scripts
│   ├── .env                          Local secrets; never share or commit values
│   └── package.json
├── paymnet.md                        Payment roadmap (filename typo is intentional)
├── CHATGPT_PROJECT_HANDOFF.md         Detailed project documentation
├── PROJECT_MAP_FOR_AI.md              This quick navigation map
└── older documentation/backlog files
```

## Frontend feature ownership

| Feature | Route | Primary implementation |
|---|---|---|
| Landing page | `/` | `pages/Home.jsx`, `sections/Hero`, `Features`, `HowItWorks`, `FAQ`, etc. |
| Training selection | `/trainer` | `pages/Trainer.jsx`, `sections/TrainerModes`, `SubjectGrid` |
| Demo quiz | `/trainer/demo` | `pages/DemoTrainer.jsx`, `sections/DemoQuiz`, `hooks/useQuiz.js` |
| Subject quiz | `/trainer/subject/:subjectId` | `pages/SubjectTrainer.jsx`, `sections/SubjectQuiz`, `hooks/useSubjectQuiz.js` |
| Quiz results | `/results` | `pages/Results.jsx`, `sections/Results` |
| Registration/login | `/register`, `/login` | corresponding pages/sections, `contexts/AuthContext.jsx`, `services/authService.js` |
| User dashboard | `/min-traning` | `ProtectedRoute`, `AppHeader`, `sections/MyTraining` |
| Free training | `/min-traning/free` | `pages/FreeTraining.jsx`, free-training service/API, `QuizRunner` |
| Premium full bank | `/min-traning/premium` | `PremiumRoute`, `pages/PremiumTraining.jsx`, premium-training service |
| Smart Training | `/min-traning/smart-training` | `PremiumRoute`, `pages/SmartTraining.jsx`, `smartTrainingService.js` |
| Simulator | `/min-traning/simulator` | `PremiumRoute`, `pages/Simulator.jsx`, `SimulatorRunner.jsx`, simulator backend |
| Account | `/konto` | `ProtectedRoute`, `pages/Account.jsx`, `sections/Account`, AuthContext and auth API/controller |
| Study index | `/studiematerial` | `sections/StudyMaterial`, `services/studyService.js` |
| Subject education | `/amnen/:subjectSlug` | `sections/SubjectEducation` |
| Glossary | `/begrepp` and subject glossary route | `sections/Glossary`, `SubjectGlossary`, `services/glossaryService.js` |
| About test | `/om-provet` | `sections/AboutTest` |
| Admin portal | `/admin/*` | `src/admin/**` |
| Admin payments | `/admin/payments` | `admin/pages/AdminPayments.jsx`, `admin/services/adminApi.js` |

The public `/premium` route is implemented through `pages/Premium.jsx` and `sections/Premium/PremiumSection.jsx`. The Stripe success target `/premium/success` is not implemented yet.

## Backend route-to-code map

Public API:

| Mounted path | Route/controller responsibility |
|---|---|
| `/api/subjects` | `routes/subjectRoutes.js` — subjects and question counts |
| `/api/questions` | `routes/questionRoutes.js` — list questions, subject questions, check answers |
| `/api/auth` | `routes/authRoutes.js` → `controllers/authController.js` |
| `/api/progress` | `routes/progressRoutes.js` → `controllers/progressController.js` |
| `/api/study` | `routes/studyRoutes.js` — subject material, glossary and sources |
| `/api/glossary` | `routes/glossaryRoutes.js` — all terms grouped by subject |
| `/api/analytics` | `routes/analyticsRoutes.js` → `controllers/analyticsController.js` |
| `/api/free-training` | Free-user quota/status and randomized sessions |
| `/api/premium-training` | Premium full-bank randomized sessions |
| `/api/smart-training` | Premium weak-subject recommendations and sessions |
| `/api/simulator` | Premium 60-question/90-minute simulator session |
| `/api/training-sessions` | Start/resume attempts, save each answer, complete/recalculate results |
| `/api/auth/profile`, `/api/auth/account` | Profile/password update and password-confirmed self-deletion |

Admin API:

| Mounted path | Files | Minimum role |
|---|---|---|
| `/api/admin/auth` | `adminAuthRoutes.js`, `adminAuthController.js` | login; editor/admin for current admin |
| `/api/admin/dashboard` | `adminRoutes.js`, `adminController.js` | editor |
| `/api/admin/subjects` | subject route/controller | editor |
| `/api/admin/materials` | material route/controller | editor |
| `/api/admin/glossary` | glossary route/controller | editor |
| `/api/admin/questions` | question route/controller | editor |
| `/api/admin/sources` | source route/controller | editor |
| `/api/admin/translations` | translation route/controller | editor |
| `/api/admin/users` | user route/controller | admin |
| `/api/admin/analytics` | analytics route/controller | admin |
| `/api/admin/settings` | settings route/controller | admin |
| `/api/admin/payments` | payment route/controller | admin |

Payment endpoints currently implemented:

```text
GET /api/admin/payments/stats
GET /api/admin/payments
    query: status, paymentMethod, search, startDate, endDate, page, limit
GET /api/admin/payments/:transactionId
```

They support admin statistics, server-side filtering/search/pagination, and transaction details. There are no create-checkout, webhook, refund, coupon, premium-code or receipt endpoints yet.

## Database relationship map

```text
User
├── QuizAttempt[]
│   └── QuizAnswer[] ──> Question / Subject / selected Answer
├── AnalyticsEvent[]
└── PaymentTransaction[]

Subject
├── Question[]
│   ├── Answer[]
│   │   └── AnswerTranslation[]
│   └── QuestionTranslation[]
├── SubjectMaterial (one)
├── SubjectGlossary[]
└── SubjectSource[]

AppSetting (independent key/value system settings)
```

Tables/models:

- `users`: account, role, active status, premium and email verification flags.
- `subjects`: curriculum subjects.
- `questions`, `answers`: canonical Swedish quiz content.
- `question_translations`, `answer_translations`: `en`, `ar`, `fa` content.
- `quiz_attempts`, `quiz_answers`: saved performance.
- `subject_materials`, `subject_glossary`, `subject_sources`: learning content.
- `analytics_events`: anonymous/session or user-linked events.
- `app_settings`: typed configuration values.
- `payment_transactions`: safe payment metadata, amount in smallest currency unit, method, status and provider reference.

Payment status values: `pending`, `paid`, `failed`, `refunded`, `cancelled`.

Payment methods: `card`, `swish`, `klarna`.

## Authentication and authorization

```text
Bearer JWT
  └── authMiddleware
      ├── loads user and rejects inactive accounts
      ├── requireEditor → editor or admin
      └── requireAdmin  → admin only
```

- Public UI authentication: `frontend/src/contexts/AuthContext.jsx`.
- Admin authentication: `frontend/src/admin/contexts/AdminAuthContext.jsx`.
- Backend middleware: `authMiddleware.js`, `optionalAuth.js`, `requireEditor.js`, `requireAdmin.js`.
- Roles: `user`, `editor`, `admin`.

## Training and quiz data flow

```text
useQuiz/useSubjectQuiz
→ questionService.js
→ GET /api/questions[...]
→ user selects answer
→ POST /api/questions/:questionId/answer
→ backend returns correct + localized explanation + sources
→ client accumulates results
→ /results
→ authenticated attempt saved through /api/progress/attempt
```

New authenticated modes use `backend/src/services/quizEngine.js`, which loads questions with ordered answers, shuffles them server-side and applies a maximum limit of 60. Free training excludes previously used question IDs and enforces a 30-question allowance. Smart Training analyzes saved history and targets up to three weakest subjects. The simulator requests 60 randomized questions with a 90-minute duration.

Simulator attempts persist `simulatorQuestionIds` and `flaggedQuestionIds`. This preserves exact question order and review flags across resume. `PUT /api/training-sessions/:attemptId/flags` validates ownership, active simulator status and membership of every flagged ID.

```text
Mode page requests session
→ mode-specific backend service
→ shared quizEngine
→ QuizRunner or SimulatorRunner
→ POST training-sessions/start (new or resumed attempt)
→ every checked answer saved immediately
→ POST training-sessions/:attemptId/complete
→ backend recalculates score from saved rows
→ /results
```

## Translation map

- UI locale files: `frontend/src/i18n/locales/{sv,en,ar,fa}.json`.
- Initialization/direction: `frontend/src/i18n/index.js`.
- Swedish is canonical database content.
- Translations are separate database rows.
- `sv/en/ar/fa` translate the landing page. Arabic and Farsi/Dari apply RTL only to its container; global HTML/authenticated pages intentionally remain Swedish LTR.
- Admin translation management lives in `AdminTranslations.jsx` and translation table/dialog components.

## Payment feature map

Implemented:

```text
AdminPayments.jsx
→ adminApi.js
→ /api/admin/payments
→ adminPaymentRoutes.js
→ adminPaymentController.js
→ PaymentTransaction + associated User
```

- Admin-only page and sidebar link.
- Statistics.
- Transaction search, filters and pagination.
- Transaction detail backend endpoint.
- User/payment association.
- Payment settings are described as done in `paymnet.md`; verify the exact settings controller/UI before modifying them because payment routes currently expose transaction reads only.

Implemented since the earlier payment mapping:

- Dynamic payment settings and public settings endpoint.
- Coupon and Premium-code models, admin CRUD and public validation.
- Transactional Premium-code redemption and centralized lifetime-Premium activation.
- Public `/premium` page.
- Stripe SDK client and authenticated Checkout Session creation.
- Pending transaction creation and frontend redirect to Stripe Checkout.

Still planned/not implemented end-to-end:

- Stripe account keys/configuration.
- Verified provider webhook.
- Premium activation after confirmed payment.
- Provider-confirmed refunds.
- Receipt email, resend and PDF download.

`paymnet.md` is the roadmap and desired business flow, not proof that every item exists in code.

## Configuration and local startup

Backend environment variable names:

```text
PORT
DB_NAME
DB_USER
DB_PASSWORD
DB_HOST
DB_PORT
JWT_SECRET
JWT_EXPIRES_IN
```

Never share their values.

```powershell
cd backend
npm install
npm run dev

cd frontend
npm install
npm run dev
```

The frontend currently hardcodes `http://localhost:5000/api` in its API services.

## Rules for an AI agent working here

1. Inspect the relevant current source before editing; old Markdown files contain outdated status claims.
2. Do not read, print, copy or modify secret values in `backend/.env` unless explicitly required and authorized.
3. Keep Swedish canonical. Preserve landing `sv/en/ar/fa` with container-scoped RTL and global Swedish LTR unless product direction changes.
4. Do not hardcode questions, answers, prices or commercial rules in React when they belong in the database/backend.
5. Preserve role boundaries: content CRUD is editor/admin; users, analytics, settings and payments are admin-only.
6. Payment provider/webhook data must be authoritative. Never mark a transaction paid/refunded only because the browser says so.
7. Never store card numbers, CVV, bank credentials or other sensitive payment details.
8. Amounts are integers in the smallest currency unit (for SEK, öre).
9. Update model, association, controller, route, admin API client and UI together when a feature crosses layers.
10. Verify with frontend lint/build and focused backend/API tests. The repository currently has no automated test suite.

## Best context prompt

> Read `MEDBORGATEST_CURRENT_PROJECT_DOCUMENTATION.md` and `PROJECT_MAP_FOR_AI.md` first. Preserve landing multilingual/container RTL, global Swedish LTR, database-backed content, JWT roles, Premium guards, simulator manifests/flags and safe payments. Never expose `.env` values. My task is: [TASK].
