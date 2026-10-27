logo for translaiton.
15 frågor. kanske 10... frgåor should be statsitc so it not take from database everytime.
A alsways correct anser . fix it in demo
when going to create accountit comes scrool down amke upp automatically. make it standard.
when creating accound the statstic form demo should come to the user created.
use in trining mode even same menu in mobile view.
wehn answerting the screen should go directly to the answer instead of scrooling down.
show the graf but block it for only premimum user for free users under percentage.
after premium loging it should go to the min training, not to the http://localhost:5173/trainer
from statsic the mmain in triaing the graf is lost, why
remove this Du har tillgång till alla 21 frågor i Premium. from Träna med hela frågebanken
in here http://localhost:5173/min-traning/smart-training when you click to ← Avsluta Smart träning it shoudl be go back to min triaing.
add source in admin http://localhost:5173/admin/materials
accoutn life time should be limtied what is easyist and chepest way of controoling people not share therie acount.

one session loggin so not many user with same user loging in the computer.

Premiumkoden kunde inte skapas. http://localhost:5173/admin/payments

http://localhost:5173/admin/settings ta bort betalningar 499

---

## AGENT OPERATING MANUAL: MEDBORGATEST ARCHITECTURE AND RULES

This is not a generic React app. It is a full-stack product with a clear separation between public UI, protected user features, premium logic, admin operations, and database-controlled domain rules. The goal of this file is to stop the agent from wandering and inventing redundant patterns.

### 1) Product architecture in one sentence

MedborgaTest is a Swedish citizenship-test preparation platform where the frontend is a thin UI layer, the backend is the real business logic layer, and the MySQL database is the source of truth for questions, translations, user progress, premium status, coupons, and payment state.

### 2) Core system topology

```text
Browser / React frontend
  ├─ marketing pages and education pages
  ├─ public quiz flows
  ├─ authenticated user dashboard
  ├─ premium-only training routes
  └─ admin portal
        │ HTTP JSON + JWT
        ▼
Express API (backend/src)
  ├─ routes/
  ├─ controllers/
  ├─ services/
  ├─ middlewares/
  └─ models/
        │ Sequelize ORM
        ▼
MySQL database
  ├─ subjects, questions, answers
  ├─ translations and study content
  ├─ quiz attempts and saved answers
  ├─ analytics events
  ├─ user accounts and roles
  ├─ premium state, coupons, premium codes
  └─ payment transactions
```

### 3) Frontend architecture: what belongs where

Frontend app entry:

- frontend/src/main.jsx: mounts the app and wraps it with AuthProvider
- frontend/src/App.jsx: route map for all public, protected and admin screens

Main frontend folders and ownership:

- frontend/src/pages/: route-level pages, mostly thin wrappers
- frontend/src/sections/: major UI sections and product features
- frontend/src/components/: shared UI widgets, headers, quiz controls, auth panels
- frontend/src/hooks/: stateful client logic; quiz/session state and analytics hooks
- frontend/src/contexts/: public auth context and token persistence
- frontend/src/services/: public API clients speaking to backend routes
- frontend/src/admin/: completely separate admin application with its own auth and route layout

Important rule:

- Do not put business rules into React components unless they are purely UI concerns.
- Do not invent new “database logic” in frontend files. Price, premium status, answer correctness, and user entitlement must be validated by the backend.

Frontend route responsibilities:

- / : marketing and landing page
- /trainer : learning mode selection
- /trainer/demo : public demo quiz
- /trainer/subject/:subjectId : subject-based quiz
- /results : quiz result presentation
- /register, /login : account creation and login
- /min-traning : authenticated dashboard
- /min-traning/free : free-user training mode
- /min-traning/premium : premium full-bank training
- /min-traning/smart-training : personalized mode
- /min-traning/simulator : timed simulator
- /konto : profile/account page
- /admin/\* : separate admin app

### 4) Backend architecture: real business logic layer

Backend entry:

- backend/src/server.js: imports all models, creates associations, mounts all routes, initializes DB, starts Express

Backend folder responsibilities:

- backend/src/routes/: HTTP endpoints by domain
- backend/src/controllers/: request handling and orchestration
- backend/src/services/: reusable backend logic such as quiz generation, premium activation, and training-session rules
- backend/src/middlewares/: auth, optional auth, editor/admin guards
- backend/src/models/: Sequelize schema definitions
- backend/src/config/database.js: MySQL connection and sequelize instance

Important architectural boundary:

- Controllers should orchestrate and respond.
- Services should own business logic.
- Models should own schema and persistence shape.
- Middleware should own authorization and active-user checks.

### 5) Request flow philosophy

A normal flow should look like this:

```text
Frontend page/component
  → API call to /api/...
  → Express route
  → controller or route logic
  → service logic if business rules exist
  → Sequelize model / DB query
  → JSON response back to frontend
```

The frontend should not be trusted for:

- premium entitlement
- price calculation
- discount validation
- answer correctness
- payment status
- user role checks
- content ownership

If a feature depends on DB truth, it belongs in the backend.

### 6) Database architecture: source of truth

The database is central to the product. Treat it as the system’s truth layer, not as an optional storage utility.

Main domain tables:

Users

- table: users
- purpose: accounts, role, premium state, activity status
- important fields: role, isActive, isPremium, emailVerified

Subjects

- table: subjects
- purpose: curriculum categories

Questions and Answers

- table: questions and answers
- purpose: canonical Swedish question bank and answer options

Translations

- table: question_translations and answer_translations
- purpose: en, ar, fa localized question and answer content

QuizAttempts and QuizAnswers

- table: quiz_attempts and quiz_answers
- purpose: saved user progress and per-answer evaluation

Study material and glossary

- table: subject_materials, subject_glossary, subject_sources
- purpose: educational content and official references

Analytics

- table: analytics_events
- purpose: anonymous and user-linked product analytics

App settings

- table: app_settings
- purpose: system settings and toggles

Payment + premium commercial data

- table: payment_transactions, coupons, premium_codes
- purpose: premium purchases, discounts, lifetime access codes

Relationship map from server.js:

- Subject -> many Questions
- Question -> many Answers
- Question -> many QuestionTranslation rows
- Answer -> many AnswerTranslation rows
- User -> many QuizAttempt rows
- QuizAttempt -> many QuizAnswer rows
- Subject -> one SubjectMaterial
- Subject -> many SubjectGlossary
- Subject -> many SubjectSource
- User -> many AnalyticsEvent rows
- User -> many PaymentTransaction rows

### 7) Authentication and authorization architecture

The app uses JWT role-based access.

Auth layers:

- public auth via frontend/src/contexts/AuthContext.jsx
- admin auth via frontend/src/admin/contexts/AdminAuthContext.jsx
- backend JWT middleware under backend/src/middlewares/

Roles:

- user
- editor
- admin

Guard hierarchy:

- authMiddleware: valid logged-in user required
- requireEditor: editor or admin required
- requireAdmin: admin only

Rule:

- user-level features should never trust frontend-only state
- account status must be checked both in middleware and on sensitive writes/reads

### 8) Premium and payment architecture

This is one of the most important product domains and also the biggest unfinished boundary.

Rules that must be respected:

- Premium is a one-time lifetime purchase
- Premium is not a subscription
- A successful payment grants lifelong access
- Premium code grants lifetime access without payment
- Coupon discount is only for paid Premium purchase
- Frontend pricing, discount or status must never be trusted

The backend is the authority for:

- price calculation
- coupon validation
- payment status transition
- premium activation through premiumService.js
- grantPremium(userId, options) central activation path

Never do this:

- never set user.isPremium = true directly in a controller without using the central premium service
- never trust frontend price values for server-side correctness
- never bypass the payment status pipeline

### 9) Quiz engine and training architecture

The app has several training modes that share a training and quiz system.

Training modes:

- free training
- premium full-bank mode
- smart training
- simulator mode
- subject-specific mode
- demo mode

Key backend logic:

- shared quiz engine in backend/src/services/quizEngine.js
- freeTrainingService.js for free-user quotas
- premiumTrainingService.js for premium full-bank mode
- smartTrainingService.js for weak-subject recommendations
- simulatorService.js for timed exam simulator rules

Important behavior:

- randomized question selection is handled by backend services
- training attempts persist answer rows while the user progresses
- resume logic must preserve exact order and flags for simulator sessions
- attempt completion should recalculate totals from saved answers rather than trusting browser-supplied values

### 10) Admin architecture

The admin app is separate from the public app and has its own auth flow and layout.

Admin app structure:

- frontend/src/admin/
- admin pages, layout, services, auth context, tables, dialogs, theme, protected routes

Admin routes include:

- /admin/login
- /admin
- /admin/subjects
- /admin/materials
- /admin/glossary
- /admin/questions
- /admin/sources
- /admin/translations
- /admin/users
- /admin/analytics
- /admin/settings
- /admin/payments

Important rule:

- Admin UI is not a playground. It must remain consistent with backend authorization and content validation.
- If an admin feature touches premium, pricing, codes, or payment records, it must align with the backend data model and server-validated rules.

### 11) Data flow and interpretation rules for AI agents

Before writing code, ask: What is the real source of truth for this feature?

Use this map:

- question content: database tables + backend API
- premium state: user record + payment transactions + premium service
- user progress: quiz_attempts and quiz_answers
- product analytics: analytics_events
- pricing: backend rules + app_settings + coupon logic
- account permissions: user role + middleware + JWT

If the answer is not clear, do not invent a new pattern. Read the exact service, route and model first.

### 12) What the agent must not do

The agent must not:

- create new database tables or models without a clear product requirement
- fabricate new route structures when the app already has a domain pattern
- add ad hoc premium logic in frontend components
- build a separate “local-only” state for pricing or payment status
- bypass the service layer for business logic
- add new secret keys or expose Stripe credentials in client code
- add generic “future-ready” abstractions that are not grounded in the current architecture
- create new page names or route trees without checking the existing app map
- sneak in random UX redesigns unrelated to the requested bug

### 13) What the agent should do before implementing

Follow this exact order:

1. Read the route or page involved.
2. Read the matching backend route and service.
3. Read the relevant model(s).
4. Check the auth and premium guards involved.
5. Confirm the DB table and field behavior.
6. Fix one root cause, not multiple speculative changes.
7. Validate with a focused run or test path.

### 14) Current project reality

This app is not a toy; it is a real platform under active development. It already has a substantial architecture and valid domain logic. But it is still not production-ready because of the final hardening pass.

Strongly built areas:

- public content and subject system
- authenticated user area
- quiz engine and training flows
- premium-product boundaries
- simulator and smart training logic
- admin content and analytics tools

Main unfinished areas:

- Stripe webhook completion and trusted payment settlement
- end-to-end premium activation with coupon and code redemption
- security hardening and rate-limiting
- migration system instead of sequelize.sync()
- tests and QA pass for edge cases
- some UX cleanup and route consistency issues

### 15) Decision rule for future AI agents

When a new task begins, the agent must operate under this rule:

“Do not create a new architecture. Extend the existing one. Use the backend for business logic, the database as the source of truth, and the frontend as a thin UI layer.”

This prevents drift, duplicate systems, and creative rewrites that do not match the product.

---

## PROJECT CODEX HANDOFF FOR MEDBORGATEST

What this app is

- MedborgaTest is a multilingual Swedish citizenship-test prep app.
- It includes a public marketing site, study material, glossaries, question practice, authenticated user progress, premium access, and an admin portal.
- The app is built with React + Vite on the frontend and Express + Sequelize + MySQL on the backend.

Stack

- Frontend: React 19, Vite 8, react-router-dom 7, i18next, MUI, TipTap, Axios, CSS
- Backend: Express 5, Sequelize 6, MySQL, JWT, bcrypt, Stripe, dotenv, nodemon
- Database: MySQL, with models and table sync via sequelize.sync()

Project structure

- frontend/src/App.jsx = main route map for public + protected + admin app
- frontend/src/main.jsx = React entry file; wraps the app with AuthProvider
- frontend/src/contexts/AuthContext.jsx = public auth state and JWT management
- frontend/src/admin/... = separate admin app and admin auth context
- backend/src/server.js = loads models, attaches associations, mounts every route, and starts the API
- backend/src/config/database.js = MySQL connection config
- backend/src/routes/... = API endpoints
- backend/src/controllers/... = route logic
- backend/src/models/... = Sequelize models
- backend/src/services/... = premium/training/quiz engine logic

Core product flows

1. Public landing/training pages live in frontend/src/pages and frontend/src/sections.
2. Public quiz routes:
   - /trainer
   - /trainer/demo
   - /trainer/subject/:subjectId
   - /results
3. Authenticated user dashboard:
   - /min-traning
   - /min-traning/free
   - /min-traning/premium
   - /min-traning/smart-training
   - /min-traning/simulator
   - /konto
4. Admin app:
   - /admin/login
   - /admin
   - /admin/subjects
   - /admin/materials
   - /admin/glossary
   - /admin/questions
   - /admin/sources
   - /admin/translations
   - /admin/users
   - /admin/analytics
   - /admin/settings
   - /admin/payments

Backend route map

- /api/subjects
- /api/questions
- /api/auth
- /api/progress
- /api/study
- /api/glossary
- /api/analytics
- /api/free-training
- /api/premium-training
- /api/smart-training
- /api/simulator
- /api/training-sessions
- /api/admin/\*
- /api/payment-settings
- /api/payment-codes
- /api/checkout

Auth / roles

- JWT-based auth with Bearer token
- Roles are user, editor, admin
- Protected routes use AuthContext for public users and AdminAuthContext for admin users
- Backend uses middleware files under backend/src/middlewares/

Important app rules from the canonical docs

- Premium is a one-time lifetime purchase; no subscriptions.
- Premium activation is centralized in backend/src/services/premiumService.js
- Coupon discounts are backend-calculated; frontend must not be trusted for price logic.
- Monetary amounts are stored as integers in smallest currency unit.
- Stripe Checkout is created, but webhook fulfillment is not implemented yet.
- The app is not production-ready; there is no migration system, tests, CI/CD, or real production deployment config.

Local startup
Backend:

- cd backend
- npm install
- npm run dev

Frontend:

- cd frontend
- npm install
- npm run dev

The backend server is configured to listen on port 5000 and connect to MySQL. It calls sequelize.sync() at startup.

Required environment for backend

- backend/.env must contain DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, JWT_SECRET, JWT_EXPIRES_IN.
- Do not expose or commit these values.

What to inspect first when starting work

1. frontend/src/App.jsx — route structure and app flow
2. frontend/src/contexts/AuthContext.jsx — public auth flow and token storage
3. backend/src/server.js — route registration and model associations
4. backend/src/config/database.js — DB config and connection behavior
5. backend/src/services/quizEngine.js and related training services — training logic and randomized session rules
6. backend/src/services/premiumService.js — central premium logic
7. frontend/src/admin/services/adminApi.js — the admin API client
8. frontend/src/pages/Premium.jsx and related premium frontend flow

Likely active problem areas

- Premium flow still does not complete payment approval without Stripe webhook fulfillment.
- Some admin routes and UI flows still need cleanup and consistency checks.
- Several user-facing bugs are already documented in the backlog above:
  - scroll/answer flow
  - registration flow and demo result handoff
  - mobile/training menu consistency
  - smart training exit navigation
  - admin materials missing source handling
  - premium account sharing / session control
  - premium code creation issues
  - bad settings duplication around payment value 499

Best approach for the next coding session

- Start from the route and auth files, not from the marketing pages.
- Understand the backend API contract before changing frontend behavior.
- Keep premium logic centralized; do not bypass premiumService.js.
- Treat the database as canonical for question and learning content.
- Use the documentation files and the actual code together; the code is the source of truth.

This is the project context to keep in mind for future Codex sessions.
If you want a working starting task list, start with these in order:

1. fix the local frontend/backend startup flow and confirm environment config
2. validate a happy path: register → login → free training → premium flow
3. fix the demo-result-to-account handoff
4. fix the Smart Training exit and any route-level UX issues
5. verify admin Premium code and payment settings flow
6. complete the Stripe webhook / payment fulfillment path

This file is the working handoff for ongoing development.

---

## DATABASE SCHEMA AND PROJECT MATURITY SUMMARY

This project uses MySQL + Sequelize. The database is not just a simple app state store; it is the source of truth for all content, quiz logic, progress, analytics and premium logic.

1. Users
   Model: backend/src/models/User.js
   Table: users
   Purpose: account data and access permissions.
   Fields:

- id (INT PK)
- firstName (STRING, required)
- lastName (STRING, required)
- email (STRING, unique, email validation, required)
- password (STRING, required, hashed)
- role (ENUM: user, editor, admin)
- isActive (BOOLEAN, default true)
- deactivatedAt (DATE, nullable)
- lastLoginAt (DATE, nullable)
- isPremium (BOOLEAN, default false)
- emailVerified (BOOLEAN, default false)
- createdAt / updatedAt (timestamps)
  Important behavior:
- Public users are users.
- Editors and admins are privileged staff roles.
- Premium is a database flag, not a frontend-only state.
- Account status and deactivation are enforced in auth middleware.

2. Subjects
   Model: backend/src/models/Subject.js
   Table: subjects
   Purpose: knowledge categories / syllabus sections.
   Fields:

- id
- name (unique, required)
- slug (unique, required)
- description (TEXT, nullable)
- createdAt / updatedAt
  Important behavior:
- Each subject groups questions, glossaries, sources and study material.
- The app appears to support 13 curriculum subjects.

3. Questions
   Model: backend/src/models/Question.js
   Table: questions
   Purpose: canonical Swedish quiz question content.
   Fields:

- id
- subjectId (FK to subjects)
- question (TEXT, required)
- explanation (TEXT, nullable)
- difficulty (ENUM: easy, medium, hard)
- createdAt / updatedAt
  Important behavior:
- A question belongs to exactly one subject.
- The real canonical question text is Swedish.
- Additional languages are stored in separate translation tables.

4. Answers
   Model: backend/src/models/Answer.js
   Table: answers
   Purpose: possible answers for a question.
   Fields:

- id
- questionId (FK to questions)
- answer (TEXT, required)
- isCorrect (BOOLEAN, required, default false)
- displayOrder (INT, default 1)
- createdAt / updatedAt
  Important behavior:
- One question can have many answers.
- Only one answer is the correct one, but the project uses a server-side correct answer check and expects only one answer to be marked correct.
- displayOrder is used to preserve answer order and UI consistency.

5. Question translations
   Model: backend/src/models/QuestionTranslation.js
   Table: question_translations
   Purpose: localized versions of question text and explanations.
   Fields:

- id
- questionId (FK)
- language (STRING 10, e.g. en, ar, fa)
- translatedQuestion (TEXT)
- translatedExplanation (TEXT, nullable)
- createdAt / updatedAt
  Unique index:
- (questionId, language)
  Important behavior:
- This makes multilingual content database-backed instead of hardcoded.
- Swedes are canonical; other languages are translations.

6. Answer translations
   Model: backend/src/models/AnswerTranslation.js
   Table: answer_translations
   Purpose: localized answer text.
   Fields:

- id
- answerId (FK)
- language (STRING 10)
- translatedAnswer (TEXT)
- createdAt / updatedAt
  Unique index:
- (answerId, language)
  Important behavior:
- Reaction to translation is explicit and localized by answer.

7. Quiz attempts
   Model: backend/src/models/QuizAttempt.js
   Table: quiz_attempts
   Purpose: user training sessions and exam attempt persistence.
   Fields:

- id
- userId (FK to users)
- quizType (ENUM: demo, free, premium, subject, smart, simulator)
- status (ENUM: in_progress, completed, abandoned)
- score (INT)
- totalQuestions (INT)
- percentage (INT)
- simulatorQuestionIds (JSON, nullable)
- flaggedQuestionIds (JSON, nullable)
- startedAt (DATE)
- completedAt (DATE, nullable)
- createdAt / updatedAt
  Important behavior:
- This table is the heart of saved learning sessions.
- It supports long-running premium modes and simulator resume logic.
- simulatorQuestionIds preserves exact randomized question order for resumed exams.
- flaggedQuestionIds preserves review flags for the simulator.

8. Quiz answers
   Model: backend/src/models/QuizAnswer.js
   Table: quiz_answers
   Purpose: saves each selected answer during a quiz attempt.
   Fields:

- id
- attemptId (FK to quiz_attempts)
- questionId (FK to questions)
- subjectId (FK to subjects)
- selectedAnswerId (FK to answers)
- correct (BOOLEAN)
- createdAt / updatedAt
  Important behavior:
- This table is used to reconstruct score and learning analytics after a session.
- The app recalculates correctness from saved rows rather than trusting browser totals.

9. Subject study material
   Model: backend/src/models/SubjectMaterial.js
   Table: subject_materials
   Purpose: educational content for each subject.
   Fields:

- id
- subjectId (FK, unique)
- title
- introduction (TEXT, nullable)
- body (TEXT long)
- createdAt / updatedAt
  Important behavior:
- One subject material block per subject.
- Used by the study-material pages and subject pages.

10. Subject glossary
    Model: backend/src/models/SubjectGlossary.js
    Table: subject_glossary
    Purpose: glossary terms and definitions per subject.
    Fields:

- id
- subjectId (FK)
- word
- definition (TEXT)
- displayOrder (INT, default 0)
- createdAt / updatedAt
  Important behavior:
- Glossary entries are kept tied to a subject and ordered by displayOrder.

11. Subject sources
    Model: backend/src/models/SubjectSource.js
    Table: subject_sources
    Purpose: links to official sources for each subject.
    Fields:

- id
- subjectId (FK)
- title
- url (STRING 500)
- displayOrder (INT, default 0)
- createdAt / updatedAt
  Important behavior:
- These are educational and trust references used in quiz explanations and study pages.

12. Analytics events
    Model: backend/src/models/AnalyticsEvent.js
    Table: analytics_events
    Purpose: anonymous or user-linked tracking events.
    Fields:

- id
- userId (nullable FK)
- sessionId (STRING 100)
- eventName (STRING 100)
- pagePath (STRING 500, nullable)
- metadata (JSON)
- createdAt / updatedAt
  Index fields:
- eventName
- sessionId
- userId
- createdAt
  Important behavior:
- This drives product analytics, user flow analysis and admin analytics.
- It supports both anonymous and signed-in behavior.

13. App settings
    Model: backend/src/models/AppSetting.js
    Table: app_settings
    Purpose: key/value configuration in the database.
    Fields:

- id
- key (unique STRING 100)
- value (TEXT)
- valueType (ENUM: string, number, boolean, json)
- description (STRING 500)
- createdAt / updatedAt
  Important behavior:
- System settings are not hardcoded everywhere; this table holds database settings.
- Good place for feature toggles, pricing config, or system flags.

14. Payment transactions
    Model: backend/src/models/PaymentTransaction.js
    Table: payment_transactions
    Purpose: premium purchase and payment tracking.
    Fields:

- id
- userId (nullable FK)
- email
- amount (INT, smallest currency unit)
- currency (STRING 3, default SEK)
- paymentMethod (ENUM: card, swish, klarna)
- status (ENUM: pending, paid, failed, refunded, cancelled)
- provider (STRING)
- providerTransactionId (STRING, unique)
- description (STRING 500)
- paidAt (DATE)
- refundedAt (DATE)
- metadata (JSON)
- createdAt / updatedAt
  Indexes:
- userId
- status
- paymentMethod
- createdAt
  Important behavior:
- This is the payment ledger for premium purchases.
- The system stores amounts in smallest currency unit, so 49900 = 499 SEK.
- Stripe integration exists at the API boundary, but full webhook fulfillment is still incomplete.

15. Coupons
    Model: backend/src/models/Coupon.js
    Table: coupons
    Purpose: discount codes for premium purchase.
    Fields:

- id
- code (unique STRING 100)
- discountType (ENUM: percentage, fixed)
- discountValue (INT)
- usageLimit (INT nullable)
- usageCount (INT default 0)
- validFrom (DATE nullable)
- validUntil (DATE nullable)
- isActive (BOOLEAN default true)
- createdAt / updatedAt
  Important behavior:
- Coupons can be percentage or fixed amount.
- usageLimit = null means unlimited.
- Discount logic and validation are backend-controlled.

16. Premium codes
    Model: backend/src/models/PremiumCode.js
    Table: premium_codes
    Purpose: free lifetime premium access codes.
    Fields:

- id
- code (unique STRING 100)
- usageLimit (INT nullable)
- usageCount (INT default 0)
- validFrom (DATE nullable)
- validUntil (DATE nullable)
- isActive (BOOLEAN default true)
- createdAt / updatedAt
  Important behavior:
- These codes grant lifetime premium without payment.
- Redemptions should be tracked to avoid multiple-use abuse.

Relationships in server.js

- Subject has many Questions
- Question belongs to Subject
- Question has many Answers
- Answer belongs to Question
- Question has many QuestionTranslation rows
- Answer has many AnswerTranslation rows
- User has many QuizAttempt rows
- QuizAttempt belongs to User
- QuizAttempt has many QuizAnswer rows
- QuizAnswer belongs to QuizAttempt
- Question has many QuizAnswer rows
- Subject has many QuizAnswer rows
- Answer has many QuizAnswer rows
- Subject has one SubjectMaterial
- Subject has many SubjectGlossary
- Subject has many SubjectSource
- User has many AnalyticsEvent rows
- User has many PaymentTransaction rows

Database-level summary

- The app is content-driven and database-backed.
- Questions, answers, translations, study material, glossary and sources are all stored in MySQL.
- Progress and premium state are also stored in the database, not just in client localStorage.
- The database is the true source of user authorization, premium entitlement, training results and analytics.

---

## PROJECT DEVELOPMENT HISTORY AND CURRENT STATUS

The app is not a one-day prototype. The codebase shows a multi-stage project that developed over time from a simple public demo/training tool into a larger SaaS-style platform with:

- public landing pages
- multilingual question content
- user accounts
- quiz persistence
- premium gating
- training modes
- simulator mode
- admin portal
- analytics
- payment/coupon workflow

Based on the repository docs, the project was being built and reworked across several phases, with the current source audit dated 2026-08-16. That means the app is already far beyond a basic MVP. It is a substantially engineered product, but it is not yet production-safe and not final.

Completed / strong areas

- Public marketing site and subject pages
- Multi-language content structures (sv/en/ar/fa)
- Auth system and protected routes
- Admin content management for subjects, materials, glossary, questions, sources, translations
- Quiz engine and answer validation
- Training sessions and live answer persistence
- Premium gating and premium-only routes
- Smart Training and simulator logic
- Analytics event capture
- Coupon and Premium-code models and admin support
- Stripe Checkout session creation

Still remaining or unfinished

- Stripe webhook fulfillment is not implemented
- Successful external payment does not currently authorize Premium in a trusted way
- Coupon usage and Premium-code redemption are not safely finished end-to-end
- No automated test suite
- No real migration system; sequelize.sync() is used instead of versioned DB migrations
- No production deployment configuration
- No rate limiting or hardened API security
- No webhook verification / signed-event verification
- No retry-safe payment ledger workflow
- No dedicated 404 handling in the frontend
- Some visual UX bugs remain: scroll behavior, menu consistency, result handoff, trainer navigation issues, premium redirection, admin flows, and copy/UX cleanup
- Account sharing control and session limits are still open problems
- Some admin/settings issues remain, including payment-value cleanup and Premium code creation problems
- Some features are partially implemented but still require QA and hardening

In practical terms:

- The app is already a serious, real-world product in active development.
- It has strong backend + frontend structure and a real database-driven business model.
- The main open risk is not basic app setup anymore; it is payment completion, security hardening, clean QA, and production reliability.

This is the most honest status:

- Functional and broad in scope
- Not production-ready yet
- Very close to a full platform, but still requiring a final hardening and fulfillment pass

---

## WORKING DEVELOPER NOTE

When working on this project, treat the database schema above as the truth. The backend uses Sequelize models, the frontend is just UI over the API, and the database defines what the product really supports.

If a feature is not clearly reflected in the models or in server.js, assume it is incomplete or untrusted until proven by code and runtime testing.

---

## END OF DATABASE + MATURITY SUMMARY
