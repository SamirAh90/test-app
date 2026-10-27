# MedborgaTest Frontend Documentation

**Last updated:** 2026-07-30  
**Frontend status:** Landing page, multilingual support, trainer landing, demo quiz, backend integration, answer validation, automatic question progression, and results logic are working.

---

## 1. Project overview

MedborgaTest is a React web application that helps users prepare for the Swedish citizenship test.

The frontend currently supports:

- A public landing page
- Swedish, English, Arabic, and Dari/Farsi interface translations
- Right-to-left layout for Arabic and Dari/Farsi
- A trainer landing page
- A 15-question free demo
- Questions loaded from the backend and MySQL database
- Answer checking through the backend API
- Correct/incorrect feedback
- Explanations after every answer
- Automatic movement to the next question
- Automatic navigation to the results page after question 15
- Score and subject-level result statistics

The planned user journey is:

```text
Landing page
    ↓
Trainer landing page
    ↓
15-question free demo
    ↓
Results and subject statistics
    ↓
Create a free account
    ↓
Additional free questions
    ↓
Premium access
```

---

## 2. Technology stack

### Frontend

- React
- Vite
- React Router
- react-i18next
- CSS
- Fetch API

### Connected backend

- Node.js
- Express
- Sequelize
- MySQL

Frontend development server:

```text
http://localhost:5173
```

Backend API server:

```text
http://localhost:5000
```

---

## 3. Main frontend routes

The application currently uses these routes:

```text
/                 → Public landing page
/trainer          → Trainer landing page
/trainer/demo     → 15-question demo quiz
/results          → Demo results page
```

Current `App.jsx` structure:

```jsx
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Trainer from "./pages/Trainer";
import DemoTrainer from "./pages/DemoTrainer";
import Results from "./pages/Results";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/trainer" element={<Trainer />} />
        <Route path="/trainer/demo" element={<DemoTrainer />} />
        <Route path="/results" element={<Results />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
```

---

## 4. Current frontend folder structure

```text
frontend/
├── index.html
├── src/
│   ├── assets/
│   │   └── logo.png
│   │
│   ├── components/
│   │   ├── AnnouncementBar/
│   │   ├── Navbar/
│   │   ├── TrainerHeader/
│   │   │   ├── TrainerHeader.jsx
│   │   │   └── TrainerHeader.css
│   │   │
│   │   └── quiz/
│   │       ├── QuizProgress.jsx
│   │       ├── QuizQuestion.jsx
│   │       ├── QuizAnswers.jsx
│   │       ├── QuizFeedback.jsx
│   │       └── QuizFooter.jsx
│   │
│   ├── hooks/
│   │   └── useQuiz.js
│   │
│   ├── i18n/
│   │   ├── index.js
│   │   └── locales/
│   │       ├── sv.json
│   │       ├── en.json
│   │       ├── ar.json
│   │       └── fa.json
│   │
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Trainer.jsx
│   │   ├── DemoTrainer.jsx
│   │   └── Results.jsx
│   │
│   ├── sections/
│   │   ├── Hero/
│   │   ├── Stats/
│   │   ├── SubjectGrid/
│   │   ├── HowItWorks/
│   │   ├── DemoQuestion/
│   │   ├── Features/
│   │   ├── FAQ/
│   │   ├── CTA/
│   │   ├── Disclaimer/
│   │   ├── Footer/
│   │   ├── TrainerModes/
│   │   │   ├── TrainerModes.jsx
│   │   │   └── TrainerModes.css
│   │   └── DemoQuiz/
│   │       ├── DemoQuiz.jsx
│   │       └── DemoQuiz.css
│   │
│   ├── services/
│   │   └── questionService.js
│   │
│   ├── styles/
│   │   └── design-system.css
│   │
│   ├── App.jsx
│   ├── App.css
│   └── main.jsx
```

The exact folder structure may contain additional landing-page components, but the sections above represent the current working architecture.

---

## 5. Design system

The project uses CSS variables in `design-system.css`.

Main colors:

```css
--color-primary: #17324d;
--color-primary-hover: #10263a;
--color-accent: #2f7d6d;
--color-accent-soft: #eaf5f2;
--color-background: #f7f8fa;
--color-surface: #ffffff;
--color-surface-soft: #f1f4f6;
--color-text: #172033;
--color-text-muted: #64748b;
--color-border: #e2e8f0;
--color-success: #15803d;
--color-error: #b42318;
```

Typography:

```css
--font-sans: "Inter", sans-serif;
```

Arabic and Dari/Farsi use:

```css
font-family: "Noto Sans Arabic", sans-serif;
```

Google Fonts are loaded in `index.html`:

- Inter
- Noto Sans Arabic

---

## 6. Multilingual system

The landing page and trainer support four languages:

```text
sv → Swedish
en → English
ar → Arabic
fa → Dari/Farsi
```

Translation files:

```text
src/i18n/locales/sv.json
src/i18n/locales/en.json
src/i18n/locales/ar.json
src/i18n/locales/fa.json
```

The selected language is saved in `localStorage`.

Arabic and Dari/Farsi automatically use right-to-left layout:

```js
document.documentElement.dir = isRtl ? "rtl" : "ltr";
```

The application has two language concepts:

1. Interface language
2. Question/explanation language

These should remain separate in future development.

---

## 7. Public landing page

The public landing page is complete and translated.

It currently includes:

- Announcement bar
- Navbar
- Hero section
- Statistics section
- Subject grid
- How it works
- Demo question preview
- Features
- FAQ
- Call to action
- Disclaimer
- Footer

Important message:

```text
Prova gratis – 15 frågor. Inget konto krävs.
```

The main CTA navigates users to:

```text
/trainer
```

---

## 8. Trainer landing page

The trainer landing page is available at:

```text
/trainer
```

It includes four compact training modes:

```text
Gratis demo        → Active
Smart träning      → Premium / locked
Provsimulator      → Premium / locked
Repetera fel       → Account required
```

The free demo includes:

- 15 questions
- Approximately 10 minutes
- No account required
- Immediate feedback
- Explanations

The trainer landing page also includes:

- Motivation section
- Full-access payment information
- Payment method information
- Premium feature overview

The free demo button uses React Router:

```jsx
<Link to="/trainer/demo">Börja träna →</Link>
```

---

## 9. Backend API service

File:

```text
src/services/questionService.js
```

Current code responsibilities:

### Load questions

```js
getQuestions(language)
```

Endpoint:

```text
GET http://localhost:5000/api/questions?language=sv
```

### Check an answer

```js
checkAnswer(questionId, answerId, language)
```

Endpoint:

```text
POST http://localhost:5000/api/questions/:questionId/answer?language=sv
```

Request body:

```json
{
  "answerId": 30
}
```

Expected response:

```json
{
  "correct": true,
  "explanation": "Stockholm är Sveriges huvudstad..."
}
```

Current service structure:

```js
const API_BASE_URL = "http://localhost:5000/api";

export async function getQuestions(language = "sv") {
  const response = await fetch(
    `${API_BASE_URL}/questions?language=${language}`
  );

  if (!response.ok) {
    throw new Error("Kunde inte hämta frågor från servern.");
  }

  return response.json();
}

export async function checkAnswer(
  questionId,
  answerId,
  language = "sv"
) {
  const response = await fetch(
    `${API_BASE_URL}/questions/${questionId}/answer?language=${language}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ answerId }),
    }
  );

  if (!response.ok) {
    throw new Error("Kunde inte kontrollera svaret.");
  }

  return response.json();
}
```

---

## 10. Demo trainer page

Page:

```text
src/pages/DemoTrainer.jsx
```

The page combines:

- `TrainerHeader`
- `DemoQuiz`

Route:

```text
/trainer/demo
```

---

## 11. Quiz architecture

The quiz has been split into reusable components.

```text
DemoQuiz.jsx
    ├── QuizProgress
    ├── QuizQuestion
    ├── QuizAnswers
    ├── QuizFeedback
    └── QuizFooter
```

All quiz styling currently remains in:

```text
src/sections/DemoQuiz/DemoQuiz.css
```

### QuizProgress

Shows:

```text
Fråga 1 av 15
Ingen timer
```

### QuizQuestion

Shows:

- Subject
- Question text

### QuizAnswers

Shows four answer buttons.

Current behavior:

- One answer can be selected
- Selected answer receives a highlighted style
- Answers are disabled after answer validation

### QuizFeedback

Displays:

```text
✓ Rätt!
```

or:

```text
✕ Fel
```

It also displays the explanation returned from the backend.

### QuizFooter

Before submission:

```text
Svara →
```

After an answer is submitted, the footer disappears because question progression is automatic.

---

## 12. Quiz state hook

File:

```text
src/hooks/useQuiz.js
```

The hook handles:

- Loading questions
- Limiting the demo to 15 questions
- Current question index
- Selected answer
- Answer validation
- Loading and error states
- Correct answer score
- Per-question result history
- Moving to the next question

Current state:

```text
questions
currentQuestionIndex
selectedAnswerId
answerResult
checkingAnswer
loading
error
score
results
```

The `results` array stores data similar to:

```js
{
  questionId,
  subjectId,
  subjectName,
  selectedAnswerId,
  correct
}
```

The hook returns:

```text
questions
currentQuestion
currentQuestionIndex
selectedAnswerId
answerResult
checkingAnswer
loading
error
isLastQuestion
score
results
selectAnswer
submitAnswer
nextQuestion
```

---

## 13. Demo quiz behavior

The demo uses 15 questions:

```js
useQuiz(i18n.language, 15)
```

The current flow is:

```text
Load questions from API
    ↓
Display question 1
    ↓
User selects answer
    ↓
User clicks Svara
    ↓
Backend checks answer
    ↓
Show Rätt/Fel and explanation
    ↓
Wait 1.2 seconds
    ↓
Automatically show next question
```

After question 15:

```text
Show feedback
    ↓
Wait 1.2 seconds
    ↓
Automatically navigate to /results
```

The quiz sends this route state:

```js
{
  score,
  results,
  totalQuestions: questions.length
}
```

---

## 14. Results page

File:

```text
src/pages/Results.jsx
```

The Results page currently calculates:

- Total score
- Total number of questions
- Percentage
- Performance grouped by subject
- Strong subjects
- Subjects that need more practice

Strong subjects are currently defined as:

```text
70% or higher
```

Improvement subjects are:

```text
Below 70%
```

Current result example:

```text
Demo slutfört

Bra jobbat! 🎉
Du fick 3 av 15 rätt.
20%

Du behöver träna mer på:
- Landet Sverige
- Sveriges demokratiska system
- Så styrs Sverige
- Politiska val och partier
- Lag och rätt
- Medier och källkritik
- Mänskliga rättigheter
```

Current Results actions:

```text
Skapa gratis konto
Gör demot igen
```

The create-account button is not connected yet.

The retry button navigates to:

```text
/trainer/demo
```

Results styling has not yet been created.

Planned file:

```text
src/pages/Results.css
```

---

## 15. Current working user flow

```text
1. User visits /
2. User reads the landing page
3. User clicks Börja träna
4. User opens /trainer
5. User clicks Gratis demo
6. User opens /trainer/demo
7. Frontend loads questions from MySQL through the API
8. User answers 15 questions
9. Backend checks every answer
10. User sees feedback and explanation
11. Questions advance automatically
12. After question 15, user goes to /results
13. Results page shows score and subject statistics
```

---

## 16. Current database/API integration status

The frontend has successfully loaded:

```text
21 questions
```

The first 15 are used in the demo:

```js
data.slice(0, 15)
```

Current known database content:

```text
13 subjects
21 questions
84 answers
Question translations
Answer translations
```

The current question API response uses relationship properties similar to:

```js
currentQuestion.Subject
currentQuestion.Answers
```

Example usage:

```jsx
currentQuestion.Subject?.name
currentQuestion.Answers?.map(...)
```

---

## 17. Important decisions already made

### Demo access

- 15 questions
- No account required

### Free account

Planned:

- Save result
- Continue later
- Additional free questions
- Basic statistics

### Premium access

Planned:

- Full question bank
- Provsimulator
- Smart training
- Repeat mistakes
- Advanced statistics
- Future updates

### Result flow

The user should receive value before being asked to register.

```text
Demo
→ Results
→ Motivation
→ Create free account
→ Additional free questions
→ Premium
```

---

## 18. Known limitations

1. The demo currently uses the first 15 API questions, not randomized questions.
2. The demo is not balanced by subject through backend selection.
3. Subject statistics may be based on only one or two questions.
4. Results are passed through React Router state and disappear after browser refresh.
5. There is no account creation yet.
6. Results are not stored in MySQL.
7. There is no question review on the Results page.
8. No progress bar animation has been added yet.
9. No timer is used in demo mode.
10. The interface text inside the quiz and Results page is not fully moved to i18next yet.
11. The explanation language selector is displayed in the Trainer header but is not yet fully connected to separate translation state.
12. Premium buttons and login buttons are visual only.

---

## 19. Recommended next development steps

### Next immediate task

Create and style:

```text
src/pages/Results.css
```

Update `Results.jsx` to include:

- Result summary card
- Percentage indicator
- Strong subject cards
- Improvement subject cards
- Motivation message
- Create free account CTA
- Retry demo button

### After Results styling

1. Store more information in each quiz result:
   - Question text
   - Selected answer text
   - Explanation
   - Correct answer, if the backend supports returning it

2. Add wrong-answer review.

3. Move quiz UI text into i18next translation files.

4. Improve demo question selection:
   - Random 15 questions
   - Balanced across subjects
   - Stable during a quiz session

5. Build account creation.

6. Save demo results to the user account.

7. Build the authenticated user dashboard.

8. Add premium access and payment flow.

---

## 20. How to run the project

### Backend

Open the backend terminal:

```bash
npm run dev
```

Expected server:

```text
http://localhost:5000
```

### Frontend

Open the frontend terminal:

```bash
npm run dev
```

Expected application:

```text
http://localhost:5173
```

### Test the full flow

```text
http://localhost:5173/
http://localhost:5173/trainer
http://localhost:5173/trainer/demo
http://localhost:5173/results
```

Do not open `/results` directly when testing score logic. Complete the quiz so React Router passes the result state.

---

## 21. Current milestone

The following milestone is complete:

```text
Public landing page
+ multilingual interface
+ trainer landing
+ real database questions
+ API answer validation
+ 15-question demo flow
+ automatic progression
+ automatic Results navigation
+ score calculation
+ subject-level statistics
```

The next milestone is:

```text
Polished Results page
+ account creation CTA
+ result persistence
+ free user dashboard
```
