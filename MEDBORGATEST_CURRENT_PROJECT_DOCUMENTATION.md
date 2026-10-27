# MedborgaTest — current project documentation

**Source audit date:** 2026-08-16  
**Purpose:** authoritative technical and product handoff for developers and AI agents  
**Authority:** current source code is always final; this document supersedes status claims in older planning files.

## 1. Executive summary

MedborgaTest is a multilingual Swedish citizenship-test preparation platform. It includes:

- A public marketing and information website.
- Swedish learning material organized into 13 subject areas.
- Glossaries and authoritative subject sources.
- Database-backed multiple-choice training.
- Swedish, English, Arabic and Farsi/Dari support.
- User registration, login, saved results and progress reporting.
- A role-protected administration portal.
- Analytics collection and admin reporting.
- A one-time, lifetime Premium commercial model.
- Admin-managed Premium pricing and payment methods.
- Admin-managed coupons and free Premium codes.
- A public Premium page and Stripe Checkout session creation.
- A shared backend quiz engine with randomized question selection.
- Separate free, full-bank Premium, personalized Smart Training and timed simulator modes.
- Live answer persistence and resumable authenticated training attempts.
- User account management for profile/password changes, Premium status and password-confirmed deletion.
- Simulator persistence for exact question order and flagged questions.
- A responsive public navigation drawer with authenticated account links and keyboard handling.

The product is now substantially built, but it is not production-ready. The most important unfinished boundary is Stripe payment fulfillment. The application can create a pending `PaymentTransaction` and attempt to create a Stripe Checkout Session, but it does not yet have a Stripe webhook. Therefore successful provider payment does not yet authoritatively mark the transaction paid, increment coupon usage, or grant Premium.

## 2. Product rules

### Premium

- Premium is a **one-time purchase**.
- Premium provides **lifetime access**.
- There are **no subscriptions**.
- A successful Stripe payment grants lifetime Premium.
- A Premium code grants lifetime Premium without payment.
- A coupon only discounts a paid Premium purchase.
- Premium activation is centralized through `backend/src/services/premiumService.js` and its `grantPremium(userId, options)` function.
- New payment or code flows must not directly set `user.isPremium = true` in controllers.

### Money

- Monetary amounts are stored as integers in the smallest currency unit.
- For SEK, `49900` means `499 SEK`.
- Premium price and coupon discount calculation are backend responsibilities.
- The frontend must never be trusted for price, discount or payment status.

### Content and language

- Swedish is canonical content.
- English (`en`), Arabic (`ar`) and Farsi/Dari (`fa`) are translations.
- Arabic and Farsi/Dari use RTL only inside the multilingual landing-page container. Global HTML and authenticated areas intentionally remain Swedish LTR.
- Quiz and learning content must remain database-backed rather than hardcoded in React.

## 3. Technology stack

Frontend:

- React 19.2 and React DOM 19.2
- Vite 8
- React Router DOM 7
- i18next and react-i18next
- Axios and native `fetch`
- Material UI, Emotion and MUI X Data Grid
- TipTap rich-text editor
- Plain CSS and a shared design system

Backend:

- Node.js with CommonJS
- Express 5.2
- MySQL
- Sequelize 6 with mysql2
- JWT authentication
- bcrypt password hashing
- Stripe Node SDK 22.5
- dotenv, CORS and Nodemon

Missing engineering infrastructure:

- Automated tests
- CI/CD
- Docker setup
- Production deployment configuration
- Versioned database migrations
- Centralized structured logging/observability

## 4. Repository map

```text
MedborgaTest/
├── frontend/
│   ├── src/
│   │   ├── App.jsx                    Complete browser route map
│   │   ├── main.jsx                   React entry/providers
│   │   ├── pages/                     Route wrappers
│   │   ├── sections/                  Main public feature UI
│   │   │   └── Premium/               Premium commercial UI
│   │   ├── components/                Shared/public/quiz components
│   │   ├── hooks/
│   │   │   ├── useQuiz.js
│   │   │   ├── useSubjectQuiz.js
│   │   │   ├── useQuizRunner.js       Shared quiz interaction state
│   │   │   └── usePaymentSettings.js
│   │   ├── components/Quiz/           Shared quiz runner and presentation
│   │   ├── components/Simulator/      Timed simulator runner
│   │   ├── components/PremiumRoute/   Account + Premium frontend guard
│   │   ├── contexts/AuthContext.jsx   Public account/JWT state
│   │   ├── services/                  Public API clients
│   │   ├── i18n/                      Landing sv/en/ar/fa; global Swedish LTR
│   │   └── admin/
│   │       ├── pages/                  Admin screens
│   │       │   └── AdminPayments.jsx
│   │       ├── components/payments/    Coupon and Premium-code management
│   │       ├── services/adminApi.js    Admin API client
│   │       ├── contexts/               Admin authentication
│   │       └── layouts/                Admin shell
│   └── package.json
├── backend/
│   ├── src/
│   │   ├── server.js                  Models, associations and route mounts
│   │   ├── config/database.js
│   │   ├── models/                    Sequelize models
│   │   ├── routes/                    Express route definitions
│   │   ├── controllers/               Business logic
│   │   ├── services/
│   │   │   ├── premiumService.js      Central Premium activation
│   │   │   └── stripeService.js       Lazy Stripe SDK client
│   │   │   ├── quizEngine.js          Shared randomized question builder
│   │   │   ├── freeTrainingService.js Free-account quota/session logic
│   │   │   ├── premiumTrainingService.js Full-bank Premium sessions
│   │   │   ├── smartTrainingService.js Weak-subject recommendations
│   │   │   └── simulatorService.js    Simulator rules/session builder
│   │   ├── middlewares/               JWT/editor/admin authorization
│   │   └── utils/generateToken.js
│   ├── database/                      SQL seeds/schema checks
│   ├── .env                           Secrets; never share values
│   └── package.json
├── paymnet.md                         Payment roadmap/conversation history
├── PROJECT_MAP_FOR_AI.md              Quick navigation map
├── CHATGPT_PROJECT_HANDOFF.md          Earlier deep handoff
└── MEDBORGATEST_CURRENT_PROJECT_DOCUMENTATION.md
```

## 5. Application architecture

```text
Browser
├── Public React application
├── Authenticated user application
└── Admin React application
        │ HTTP JSON + Bearer JWT where required
        ▼
Express API
├── Public content and validation
├── Account and progress services
├── Analytics ingestion
├── Checkout preparation
└── Editor/admin management
        │ Sequelize
        ▼
MySQL

External boundary:
Express checkout controller → Stripe API
Stripe webhook → NOT YET IMPLEMENTED
```

## 6. Frontend routes

| Route | Access | Purpose |
|---|---|---|
| `/` | public | Landing page |
| `/trainer` | public | Training modes and subjects |
| `/trainer/demo` | public | Demo quiz |
| `/trainer/subject/:subjectId` | public | Subject-specific quiz |
| `/results` | public | Quiz results |
| `/register` | public | Registration |
| `/login` | public | Login |
| `/om-provet` | public | Test information |
| `/premium` | public | Premium sales, coupons, Premium codes and checkout start |
| `/studiematerial` | public | Study index |
| `/amnen/:subjectSlug` | public | Subject education |
| `/amnen/:subjectSlug/begrepp` | public | Subject glossary |
| `/begrepp` | public | Complete glossary |
| `/min-traning` | authenticated | Personal training dashboard |
| `/min-traning/demo` | authenticated | Demo training inside the user area |
| `/min-traning/free` | authenticated non-Premium | Free-account training with a lifetime 30-question allowance |
| `/min-traning/premium` | Premium | Random training from the full question bank |
| `/min-traning/smart-training` | Premium | Personalized training from the user's weakest subjects |
| `/min-traning/simulator` | Premium | Timed 60-question, 90-minute simulator |
| `/konto` | authenticated | Profile/password editing, Premium status and account deletion |
| `/admin/login` | public form | Editor/admin login |
| `/admin` | editor/admin | Dashboard |
| `/admin/subjects` | editor/admin | Subject CRUD |
| `/admin/materials` | editor/admin | Study-material management |
| `/admin/glossary` | editor/admin | Glossary CRUD |
| `/admin/questions` | editor/admin | Question and answer CRUD |
| `/admin/sources` | editor/admin | Source CRUD |
| `/admin/translations` | editor/admin | Translation management |
| `/admin/users` | admin | User management |
| `/admin/analytics` | admin | Analytics |
| `/admin/settings` | admin | System/user-cleanup settings |
| `/admin/payments` | admin | Payment settings, codes, coupons, statistics and transactions |

Missing routes:

- `/premium/success` is referenced by Stripe `success_url` but is not registered in `App.jsx`.
- There is no dedicated cancellation page; Stripe redirects to `/premium?cancelled=true`, but the Premium UI does not currently present a specific cancellation message based on that query parameter.
- There is no catch-all 404 route.

## 7. Public API map

### Content and learning

```text
GET  /api/subjects
GET  /api/questions?language=sv|en|ar|fa
GET  /api/questions/subject/:subjectId?language=...
POST /api/questions/:questionId/answer?language=...
GET  /api/study/:subjectIdentifier
GET  /api/glossary
```

### Accounts and progress

```text
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me                         JWT required
PUT  /api/auth/profile                    JWT required
DELETE /api/auth/account                  JWT + password confirmation
POST /api/progress/attempt                JWT required
GET  /api/progress/summary                JWT required
```

### Analytics

```text
POST /api/analytics/events                optional JWT
```

### Training engines and live sessions

```text
GET  /api/free-training                   JWT; rejects Premium accounts
GET  /api/free-training/status            JWT
GET  /api/premium-training                JWT + Premium
GET  /api/smart-training                  JWT + Premium
GET  /api/simulator                       JWT + Premium

POST /api/training-sessions/start         JWT
POST /api/training-sessions/:attemptId/answer
PUT  /api/training-sessions/:attemptId/flags
POST /api/training-sessions/:attemptId/complete
```

`training-sessions/start` accepts `free`, `premium`, `subject`, `smart`, or `simulator`. It resumes an unfinished attempt of the same type when one exists. Each answer is persisted as the user progresses, and completion recalculates score and percentage from saved database rows rather than trusting totals supplied by the browser.

Simulator attempts persist `simulatorQuestionIds` to preserve exact question membership/order and `flaggedQuestionIds` for later review. The flags endpoint requires ownership of an active simulator attempt and rejects IDs outside that attempt's question manifest.

### Premium and payments

```text
GET  /api/payment-settings
POST /api/payment-codes/coupon/validate
POST /api/payment-codes/premium/validate
POST /api/payment-codes/premium/redeem    JWT required
POST /api/checkout/create-session         JWT required
```

No public payment webhook or checkout-session verification endpoint exists yet.

## 8. Admin API map

Content CRUD is protected by JWT plus `requireEditor`. User management, analytics, system settings and all payment administration are protected by JWT plus `requireAdmin`.

Payment administration:

```text
GET    /api/admin/payment-settings
PUT    /api/admin/payment-settings

GET    /api/admin/payments/stats
GET    /api/admin/payments
GET    /api/admin/payments/:transactionId

GET    /api/admin/coupons
GET    /api/admin/coupons/:couponId
POST   /api/admin/coupons
PUT    /api/admin/coupons/:couponId
DELETE /api/admin/coupons/:couponId

GET    /api/admin/premium-codes
GET    /api/admin/premium-codes/:premiumCodeId
POST   /api/admin/premium-codes
PUT    /api/admin/premium-codes/:premiumCodeId
DELETE /api/admin/premium-codes/:premiumCodeId
```

Payment transactions are read-only in the current admin API. Refund and receipt actions do not exist.

## 9. Authentication and authorization

Roles:

- `user`
- `editor`
- `admin`

Authorization pipeline:

```text
Authorization: Bearer <JWT>
→ authMiddleware verifies token
→ user is loaded from MySQL
→ missing, deleted or inactive user is rejected
→ requireEditor or requireAdmin applies role boundary
```

Public and admin frontend authentication contexts are separate. Premium purchase and Premium-code redemption require a logged-in user because lifetime access must be attached to an account.

## 10. Database models and relationships

### Core learning models

- `User`
- `Subject`
- `Question`
- `Answer`
- `QuestionTranslation`
- `AnswerTranslation`
- `QuizAttempt`
- `QuizAnswer`
- `SubjectMaterial`
- `SubjectGlossary`
- `SubjectSource`
- `AnalyticsEvent`
- `AppSetting`

`QuizAttempt` stores quiz type (`demo`, `free`, `premium`, `subject`, `smart`, `simulator`), status (`in_progress`, `completed`, `abandoned`), score, total, percentage and timestamps. Simulator attempts additionally store JSON `simulatorQuestionIds` and `flaggedQuestionIds` for exact resumption and review.

### Commercial models

`PaymentTransaction`:

- Optional `userId` and customer email
- Integer `amount`
- Three-letter currency, default `SEK`
- Method: `card`, `swish`, `klarna`
- Status: `pending`, `paid`, `failed`, `refunded`, `cancelled`
- Provider and unique provider transaction/session ID
- Description
- `paidAt`, `refundedAt`
- JSON metadata
- Indexed by user, status, method and creation date

`Coupon`:

- Unique normalized code
- Type: `percentage` or `fixed`
- Percentage value or fixed amount in öre
- Optional usage limit and current usage count
- Optional start/end validity
- Active flag

`PremiumCode`:

- Unique normalized code
- Optional usage limit and current usage count
- Optional start/end validity
- Active flag
- Grants lifetime Premium without Stripe payment

Relationships:

```text
User 1 ── * QuizAttempt 1 ── * QuizAnswer
User 1 ── * AnalyticsEvent
User 1 ── * PaymentTransaction

Subject 1 ── * Question 1 ── * Answer
Question 1 ── * QuestionTranslation
Answer 1 ── * AnswerTranslation
Subject 1 ── 1 SubjectMaterial
Subject 1 ── * SubjectGlossary
Subject 1 ── * SubjectSource
```

Coupon and PremiumCode are currently independent records rather than linked through redemption/history tables.

## 11. Completed accomplishments

### Public product

- Responsive landing and informational experience.
- Reusable public layout, header, navigation, sections and design system.
- Four UI languages with persistent selection.
- Four-language landing translation with container-scoped RTL for Arabic/Farsi-Dari; the global document remains Swedish LTR.
- Database-backed subjects, study material, glossaries and sources.
- Demo and subject quiz experiences.
- Server-side answer verification and localized explanations.
- Results and calls to action.

### Accounts and learning progress

- Registration and login with bcrypt/JWT.
- Current-user restoration.
- Protected personal training page.
- Saved quiz attempts and individual answers.
- Progress summaries and subject-level performance.
- Active/inactive user enforcement on authenticated API requests.
- Shared `quizEngine.js` for server-side question loading, answer ordering, shuffling and bounded limits.
- Randomized free, Premium, Smart Training and simulator question selection.
- Free-account allowance of 30 unique questions, served in sessions of up to 15 by default.
- Full-bank Premium training with a configurable request limit capped at 60.
- Smart Training that analyzes saved `QuizAnswer` history, ranks weakest subjects by accuracy/wrong-answer history, selects up to three subjects and builds a focused randomized session.
- Smart Training no-history state that asks the user to complete questions first.
- Premium-only simulator configured for up to 60 randomized questions and 90 minutes.
- Shared `QuizRunner`/`useQuizRunner` architecture for standard training modes.
- Live creation/resumption of authenticated training attempts.
- Immediate per-answer persistence and backend-derived attempt completion totals.
- Dedicated simulator runner with its own timer, navigation, answer persistence and submission flow.
- Result-page support for `free`, `premium`, `smart` and `simulator` attempt types.
- Frontend `PremiumRoute` plus backend Premium checks as defense in depth.
- Exact simulator question-order persistence across resume.
- Persistent simulator flag/unflag workflow with membership validation and optimistic-UI rollback on failure.
- Simulator overview with answered, unanswered and flagged counts plus direct question navigation.

### Account and navigation accomplishments

- Protected `/konto` page.
- View and edit first name, last name and normalized email.
- Optional password replacement using bcrypt and an 8-character minimum.
- Duplicate-email protection and immediate AuthContext user refresh.
- Premium/free status display and upgrade navigation.
- Password-confirmed self-service account deletion and local logout.
- Responsive public navigation drawer with scroll lock, Escape handling, focus placement and Tab trapping.
- Authenticated links to Min träning and Mitt konto in both public navigation and application header.

### Admin portal

- Separate admin authentication and layout.
- Editor/admin role authorization.
- Dashboard.
- Subject CRUD.
- Study-material editing with rich text and preview.
- Glossary CRUD.
- Question/answer CRUD.
- Source CRUD.
- Translation management.
- Admin-only user management, activation/deactivation, roles and Premium flags.
- Admin analytics.
- App/user cleanup settings and preview/run workflow.

### Payment administration

- Payment transaction model connected to users.
- Admin-only payment route and page.
- Revenue/status statistics.
- Server-side transaction search, date/method/status filtering and pagination.
- Transaction-details backend lookup.
- Dynamic Premium price stored in `AppSetting`.
- Dynamic card, Swish and Klarna enablement settings.
- Public payment-settings endpoint and reusable React hook.
- Coupon model, validation and complete admin CRUD UI/API.
- Premium-code model, validation and complete admin CRUD UI/API.

### Premium and Stripe preparation

- Public `/premium` page.
- Dynamic price display.
- Dynamic payment-method display.
- Coupon validation and pricing breakdown.
- Premium-code validation and authenticated redemption.
- Transactional Premium-code usage increment plus Premium activation.
- Centralized idempotent `grantPremium()` service.
- Stripe SDK installed.
- Lazy Stripe client using `STRIPE_SECRET_KEY`.
- Authenticated checkout-session endpoint.
- Server-calculated Premium price and coupon discount.
- Pending transaction creation before provider redirect.
- Stripe Checkout Session creation.
- Stripe session ID saved as provider transaction ID.
- Frontend redirects to returned Stripe Checkout URL.

## 12. Exact current Stripe flow

What works in code:

```text
User opens /premium
→ frontend loads backend payment settings
→ optional coupon is validated by backend
→ user clicks purchase
→ unauthenticated user is redirected to login
→ POST /api/checkout/create-session with JWT
→ backend rejects existing Premium account
→ backend reloads authoritative price/settings
→ backend validates coupon again
→ backend calculates final amount
→ PaymentTransaction created as pending
→ Stripe Checkout Session requested
→ Stripe Session ID stored on transaction
→ checkoutUrl returned
→ browser redirects to Stripe-hosted checkout
```

Important current behavior:

- Card and Klarna may be passed to Stripe when enabled.
- Swish is intentionally not passed to Stripe yet, even if enabled in admin settings.
- `FRONTEND_URL` defaults to `http://localhost:5173`.
- Stripe success URL targets `/premium/success?session_id=...`, which does not yet exist.
- Stripe cancellation returns to `/premium?cancelled=true`.
- Coupon usage is not incremented during session creation, which is correct; it should only be incremented after authoritative successful payment.

## 13. Remaining Stripe work — required order

### External prerequisite: Stripe account

Create and configure the Stripe account. Recommended naming:

- Legal business name: registered legal company/entity name.
- Public business name: MedborgaTest.
- Statement descriptor: recognizable form such as `MEDBORGATEST` subject to Stripe rules.
- Start with Stripe Test Mode.

Required secrets/configuration:

```dotenv
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
FRONTEND_URL=http://localhost:5173
```

Never expose the secret or webhook keys in frontend code, documentation values, commits or chat messages. A publishable key is not currently needed because the application redirects to a server-created hosted Checkout URL.

### Step 1: raw-body webhook route

Create a Stripe webhook endpoint before global JSON parsing consumes its body, or mount route-specific `express.raw({type: "application/json"})` correctly. Verify the `Stripe-Signature` header using `STRIPE_WEBHOOK_SECRET` and `stripe.webhooks.constructEvent`.

At minimum handle:

- `checkout.session.completed`
- Appropriate asynchronous success/failure events if selected methods require them
- Refund events when refund support is added

The webhook must be idempotent because Stripe can retry and deliver duplicate events.

### Step 2: successful-payment fulfillment

For a verified successful Checkout event:

1. Read `paymentTransactionId` and `userId` from trusted Stripe session metadata.
2. Load and lock the transaction in a database transaction.
3. Confirm it is the expected pending Stripe transaction.
4. Cross-check provider amount/currency/payment status against the database transaction.
5. If already paid, return success without double-processing.
6. Update status to `paid`.
7. Set `paidAt`.
8. Save the stable provider reference(s) without overwriting useful session/payment-intent identity accidentally.
9. Save the actual payment method where safely available.
10. If a coupon ID exists, lock and increment `Coupon.usageCount` exactly once.
11. Call `grantPremium(userId, {transaction})`.
12. Commit and return HTTP 200 quickly.

Do not activate Premium from the success browser page.

### Step 3: failed/cancelled state synchronization

Define provider events and rules for moving transactions to `failed` or `cancelled`. A browser cancellation redirect alone is not authoritative. Consider expiry of abandoned Checkout Sessions so pending rows do not remain pending forever.

### Step 4: success page

Add:

```text
/premium/success
```

The page should:

- Display a processing/success state.
- Use a safe backend verification/status endpoint or refresh current user until the webhook fulfillment is visible.
- Never itself grant Premium.
- Refresh `AuthContext` user state.
- Offer/perform redirect to the appropriate training page.
- Handle delayed payment methods gracefully rather than promising immediate success.

### Step 5: cancellation experience

Either add `/premium/cancelled` or deliberately handle `?cancelled=true` in `PremiumSection`. Explain that no payment was completed and allow retry.

### Step 6: admin transaction drawer

Connect the existing `GET /api/admin/payments/:transactionId` endpoint to a MUI right-side drawer in `AdminPayments.jsx`. Display user, email, amount, currency, status, provider IDs, description, dates and safe metadata. Do not allow manual editing of provider-owned status or amounts.

### Step 7: refunds

- Only allow eligible paid transactions.
- Require admin authentication and explicit confirmation.
- Call Stripe first.
- Mark refunded only after provider confirmation/webhook.
- Set `refundedAt`.
- Define the business rule for lifetime Premium removal before implementation.
- Do not blindly remove Premium if the user may have another valid purchase or Premium code.

### Step 8: receipts

After authoritative payment fulfillment:

- Send a receipt email containing customer, email, date, product, amount, currency, method and reference.
- Store only a safe provider/email receipt reference or URL if available.
- Add admin “Skicka kvitto igen”.
- Add backend-generated/retrieved PDF receipt download.
- Generate receipts from trusted backend transaction data.

## 14. Remaining non-payment product work

- Implement a dedicated “repeat incorrect answers” mode; historical wrong answers currently influence Smart Training, but there is no separate retry-only route/session.
- Fully QA the new free, Premium, Smart Training and simulator flows, especially resume behavior, timer expiry, duplicate questions and browser refresh/re-entry.
- Verify Premium feature gates match every benefit advertised on the Premium page.
- Populate and quality-review the complete 13-subject curriculum.
- Verify all question/content translations.
- Decide whether simulator questions require an official subject distribution and pass threshold rather than random selection from the full bank.
- Decide whether exact question manifests should extend from simulator to every randomized resumable mode; simulator already persists its manifest and flags.
- Add email verification and password-reset flows.
- Add privacy/consent/retention behavior for analytics.
- Add data export and formal privacy/retention workflows. Self-service account deletion is implemented.

## 15. Production readiness gaps

1. No automated tests around auth, roles, payment calculation, code redemption or webhooks.
2. API origins are hardcoded to localhost in frontend services.
3. CORS is unrestricted.
4. No Helmet/security-header configuration.
5. No rate limiting on login, registration, code validation, analytics or checkout.
6. Request validation is hand-written and inconsistent.
7. `sequelize.sync()` is used instead of versioned migrations.
8. Rich-text sanitization must be verified to prevent stored XSS.
9. Payment webhook/idempotency/audit history are missing.
10. Coupon and Premium-code use is counted but there is no redemption ledger identifying which user used which code.
11. No recovery strategy for pending transactions created when Stripe Session creation fails. The current controller creates the database row before calling Stripe and returns 500 without marking that row failed if Stripe creation throws.
12. No webhook-aware distinction between Checkout Session ID and PaymentIntent/Charge IDs.
13. No tests proving concurrent code redemptions cannot exceed usage limits across the deployed database configuration.
14. No Git repository was detected during the earlier workspace audit; source control is essential.
15. Documentation and some terminal rendering show mojibake; preserve files as UTF-8.
16. Training-session authorization validates attempt ownership, but the complete validation/security behavior of question, subject, selected answer and client-supplied `correct` values must be tested carefully. Ideally correctness should always be recomputed from authoritative answer data.
17. Free-training quota is derived from previously saved unique questions; test concurrent sessions and abandoned/resumed attempts so users cannot exceed or accidentally lose their allowance.
18. The shared quiz engine loads all matching rows and shuffles in application memory before slicing. This is acceptable for the current dataset but may need a database-efficient strategy as the question bank grows.
19. Password replacement requires a valid JWT but not the current password. Consider current-password confirmation or recent-authentication checks for email/password changes.
20. Self-service deletion calls `user.destroy()`: attempts cascade while analytics/payment records detach via `SET NULL`. Confirm this retention policy against GDPR and accounting requirements.
21. The application-header notification bell is visual only; no notification backend exists.
22. Footer contact, privacy, terms and repeat-training links still use `href="#"` placeholders.
23. Mobile navigation contains a duplicate `/om-provet` link and a temporary Forum label; clean these before release.
24. Global HTML is forced to Swedish LTR. Verify whether non-landing study, Premium, login and account pages are intentionally untranslated/LTR.

## 16. Environment variables

Currently referenced by backend source:

```text
PORT
DB_NAME
DB_USER
DB_PASSWORD
DB_HOST
DB_PORT
JWT_SECRET
JWT_EXPIRES_IN
NODE_ENV
FRONTEND_URL
STRIPE_SECRET_KEY
```

Required by the planned webhook but not yet referenced:

```text
STRIPE_WEBHOOK_SECRET
```

Create an `.env.example` containing names and safe placeholders. Never copy real values into documentation.

## 17. Recommended verification strategy

Before production, add automated tests for:

- Registration/login/inactive accounts.
- User/editor/admin authorization matrix.
- Coupon date, active-state, percentage/fixed discount and usage-limit rules.
- Premium-code validation and transactional redemption.
- Existing-Premium behavior.
- Checkout price recalculation independent of frontend values.
- Disabled payment methods.
- Stripe API failures after pending transaction creation.
- Valid, invalid and replayed webhook signatures/events.
- Duplicate successful webhook delivery.
- Amount/currency mismatch.
- Coupon increment exactly once.
- Premium grant exactly once.
- Refund eligibility and multiple-entitlement behavior.

Manual Stripe Test Mode scenarios:

- Successful card payment.
- Declined card.
- User cancels Checkout.
- Coupon purchase.
- Invalid/expired/exhausted coupon.
- Duplicate webhook delivery.
- Delayed payment method if enabled.
- Existing Premium user attempts purchase.

Training scenarios:

- New free user receives up to 15 questions and never exceeds 30 unique lifetime free questions.
- Premium user is rejected from the free endpoint and accepted by Premium modes.
- Non-Premium user is rejected by both frontend and backend Premium guards.
- Smart Training returns `no_history` for a user without saved answers.
- Smart Training ranks weak subjects correctly after mixed results.
- An interrupted attempt resumes without duplicate answer rows.
- Final score is recalculated from saved answers.
- Simulator submits manually and automatically on timer expiration.
- Simulator refresh/resume behavior is predictable and does not silently change the exam question set.
- Simulator flags persist and restore, and invalid out-of-exam flag IDs are rejected.
- Profile updates normalize email, block duplicates and refresh AuthContext.
- Account deletion rejects a wrong password and follows the intended cascade/retention rules.

## 18. Safe continuation prompt for a future AI agent

> Continue MedborgaTest from the current repository. Read `MEDBORGATEST_CURRENT_PROJECT_DOCUMENTATION.md`, then inspect relevant source before editing. Completed learning work includes randomized free/Premium/Smart modes, a 60-question/90-minute simulator, exact simulator question-order and flag persistence, shared quiz UI, live answer saving and resumable attempts. Account work includes protected `/konto`, profile/password updates, Premium status and password-confirmed deletion. Global HTML remains Swedish LTR; RTL is scoped to the multilingual landing container. Stripe Checkout creation exists, but fulfillment is incomplete: no verified raw-body webhook, authoritative paid transition, post-payment coupon increment, Stripe-triggered `grantPremium()`, or `/premium/success`. Preserve authorization, Premium guards, simulator manifests and server authority over correctness/prices/payment status. Never expose secrets. My task is: [TASK].

## 19. Source-of-truth priority

When information conflicts, use:

1. Current source code and dependency manifests.
2. Actual database schema/data inspected safely.
3. This document.
4. `PROJECT_MAP_FOR_AI.md` and `CHATGPT_PROJECT_HANDOFF.md`.
5. `paymnet.md`, `admin.md`, older backend/frontend documentation and informal TODO files.

Planning documents describe intentions and conversation history. A checked box in them is not proof of an end-to-end working feature.
