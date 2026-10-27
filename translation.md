I’ve now reviewed the current project documentation, project map, the older handoff, and the relevant current source snippets. The key rule is clear: current source is final, the current documentation is authoritative over older planning files, Swedish remains canonical, en/ar/fa are translations, and quiz content must stay database-backed.

Also importantly, we already have the pieces we should reuse rather than recreate: questionService.js, useQuiz.js, useSubjectQuiz.js, the shared useQuizRunner, the shared components/Quiz/ presentation layer, the backend quizEngine.js, the existing translation tables/admin translation workflow, and the separate SimulatorRunner. The shared QuizRunner already owns QuizQuestion, QuizAnswers, QuizFeedback, and QuizFooter, so that is where most of the standard-training translation work belongs.

One thing we should deliberately correct as part of this work: Demo and Subject currently use i18n.language as the question-request language. That no longer matches the product rule we have agreed on. UI/landing language and quiz translation language must be separated.

Translation implementation phases

Phase 1 — Lock the translation contract and Sequelize schema

No new translation tables. We keep:
questions/answers = Swedish
and
question_translations/answer_translations = en/ar/fa.

We mirror the UNIQUE constraints we just added in MySQL inside the Sequelize model definitions so source code and database describe the same rule. The existing admin translation system remains untouched because it already manages question, explanation, and answer translations for en/ar/fa.

Phase 2 — Central backend question formatter

This is the most important backend phase.

Instead of every endpoint exposing raw Sequelize translation arrays differently, create/reuse one central formatter that returns a predictable question shape:

Swedish question
Swedish explanation
Swedish answers

translation:
language
translated question
translated explanation

each answer:
Swedish answer
translated answer

The existing /api/questions endpoints already load QuestionTranslation and AnswerTranslation, so this is an evolution of the current API rather than a new translation API.

Phase 3 — Make the shared quizEngine.js translation-aware

This prevents a major duplication problem.

Free, Premium, Smart Training, and Simulator are built through backend training services and the shared quiz engine.

Therefore the quiz engine should be able to receive something like a requested translation language and return the same normalized question shape.

Then:

freeTrainingService
premiumTrainingService
smartTrainingService
simulatorService

do not each implement translation logic.

Phase 4 — Separate “question language” from “translation language” in frontend state

Swedish will be fixed as the canonical test content.

We introduce one central quiz preference:

translationLanguage:
none
en
ar
fa

This must not be i18n.language.

Landing-page i18n can stay exactly as it is. The documentation explicitly says landing translation is sv/en/ar/fa, while the rest of the application remains Swedish LTR.

I would persist the explanation choice in localStorage so if a learner chooses Dari/Persian once, the next quiz remembers that preference.

Phase 5 — Build one shared quiz translation control

Create one reusable control for standard quizzes:

Språk: Svenska
Förklaringar: Ingen / English / العربية / دری / فارسی

And:

Visa översättning / Dölj översättning

This control should feed the shared quiz state. We should not add separate selectors inside Demo, Premium, Smart, etc.

Phase 6 — Extend the existing shared Quiz components

We modify the components that already exist instead of replacing them.

QuizQuestion
receives:

Swedish question
optional translated question
translation language/direction

QuizAnswers
receives:

Swedish answer
optional translated answer

QuizFeedback
receives:

result
Swedish explanation
translated explanation

QuizRunner orchestrates these centrally. It already owns those components.

For ar and fa, only the translation text block receives dir="rtl". The card, header, buttons, navigation, and page remain LTR.

Phase 7 — Connect all shared-runner quiz modes

Once QuizRunner supports translations, we wire the existing modes to the same state/API contract:

Demo
Subject Training
Free Training
Premium Training
Smart Training

Subject Training is already using the shared QuizRunner, which is good and reduces our work.

Phase 8 — Integrate Simulator separately, using the same translation contract

Simulator must not be forced into QuizRunner, because the project deliberately has a dedicated SimulatorRunner for timer, navigation, flags, unanswered questions, and exact resume behavior.

We reuse the same:

translation preference
backend normalized question shape
translation text styling

but render it inside SimulatorRunner.

That preserves simulator behavior while avoiding a second translation system.

Phase 9 — Shared quiz/footer architecture

We should inspect the existing landing/footer implementation before creating anything new. If a reusable Footer already exists, we reuse it; otherwise we create one shared Footer component, not individual footer markup on every quiz page.

Then the standard structure becomes:

Header
Quiz/page content
Footer

The disclaimer/footer should be outside the quiz card, like your CitizenPrep reference.

We should also distinguish this from the existing QuizFooter: QuizFooter is the Svar/Nästa controls inside the quiz, not the website footer.

Phase 10 — Translation fallback and incomplete-content behavior

This matters because production data may not always have all three translations.

Rules should be central:

Swedish always displays.
If selected translation exists → display it.
If question translation is missing → don't show an empty gray block.
If one answer translation is missing → keep Swedish and omit only that translation.
If translated explanation is missing → fall back gracefully, never crash.
Admin can continue showing translation completeness.

Phase 11 — Results page decision

We should not automatically translate the entire Results page.

The current product direction is Swedish UI with translation assistance for learning content. Therefore the result statistics/navigation should remain Swedish.

We can later decide whether individual reviewed questions/explanations on Results should honor the selected translation preference. That is separate from translating the results UI itself.

Phase 12 — Verification across every mode

Before declaring the feature complete, verify all four selections:

Ingen
English
Arabic
Dari/Persian

across:

Demo, Subject, Free, Premium, Smart, Simulator.

We also verify:
answer correctness, saving, Smart Training statistics, simulator resume/flags, mobile layout, RTL text isolation, and footer placement. The project documentation explicitly requires frontend build/lint and focused backend/API checks after cross-layer changes.

What we are not going to create

This is important for avoiding extra work:

We will not create another translation database, another admin translation screen, separate translation APIs for every training mode, separate translation components for each page, or global RTL for quiz pages.

The existing project already gives us the correct ownership:

MySQL translations
↓
central backend formatting
↓
questionService / training APIs
↓
shared quiz translation state
↓
QuizRunner
├─ Demo
├─ Subject
├─ Free
├─ Premium
└─ Smart

same translation contract
↓
SimulatorRunner

That is the path I recommend.

Phase 1 is very small. Phase 2 and Phase 3 are the architectural core. After those are correct, most of the frontend work becomes much safer and faster.
