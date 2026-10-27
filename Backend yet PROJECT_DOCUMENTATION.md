============================================================
MEDBORGATEST
PROJECT DOCUMENTATION
============================================================

Last updated: 2026-07-28

============================================================
1. PROJECT OVERVIEW
============================================================

MedborgaTest is a Swedish citizenship-test training web application.

The application will provide:

- Questions about Sweden and Swedish society
- 13 subject areas
- Multiple-choice questions
- Explanations after answering
- Swedish as the original language
- English translations
- Arabic translations
- Farsi/Dari translations
- Language selector in the frontend
- Practice questions
- 20-question practice sessions
- Future exam simulator
- Future user progress and results


============================================================
2. TECHNOLOGY STACK
============================================================

CURRENT BACKEND:

- Node.js
- Express.js
- MySQL
- Sequelize ORM
- mysql2
- CORS
- dotenv
- Nodemon
- Postman

FRONTEND:

The frontend will be developed separately and connected to
the backend through the API.


============================================================
3. PROJECT FOLDER STRUCTURE
============================================================

MedborgaTest/
|
+-- backend/
|   |
|   +-- config/
|   |   |
|   |   +-- database.js
|   |
|   +-- models/
|   |   |
|   |   +-- User.js
|   |   +-- Subject.js
|   |   +-- Question.js
|   |   +-- Answer.js
|   |   +-- QuestionTranslation.js
|   |   +-- AnswerTranslation.js
|   |
|   +-- routes/
|   |   |
|   |   +-- subjectRoutes.js
|   |   +-- questionRoutes.js
|   |
|   +-- server.js
|   +-- package.json
|   +-- package-lock.json
|   +-- .env
|
+-- frontend/
|   |
|   +-- src/
|       |
|       +-- components/
|       +-- pages/
|       +-- services/
|       +-- i18n/
|       +-- ...
|   
+-- PROJECT_DOCUMENTATION.txt


============================================================
4. BACKEND ARCHITECTURE
============================================================

The backend currently works like this:

Frontend
   |
   | HTTP requests
   v
Express Server
   |
   +-- /api/subjects
   |
   +-- /api/questions
   |
   v
Routes
   |
   v
Sequelize Models
   |
   v
MySQL Database


============================================================
5. DATABASE ARCHITECTURE
============================================================

Database:

medborgatest

Tables:

medborgatest
|
+-- Users
|
+-- Subjects
|
+-- Questions
|
+-- Answers
|
+-- QuestionTranslations
|
+-- AnswerTranslations


============================================================
6. DATABASE RELATIONSHIPS
============================================================

Subjects
   |
   | 1
   |
   | many
   v
Questions
   |
   +-------------------- 1 to many ----------------> Answers
   |
   +-------------------- 1 to many ----------------> QuestionTranslations


Answers
   |
   +-------------------- 1 to many ----------------> AnswerTranslations


RELATIONSHIPS IN SEQUELIZE:

Subject.hasMany(Question)

Question.belongsTo(Subject)

Question.hasMany(Answer)

Answer.belongsTo(Question)

Question.hasMany(QuestionTranslation)

QuestionTranslation.belongsTo(Question)

Answer.hasMany(AnswerTranslation)

AnswerTranslation.belongsTo(Answer)


============================================================
7. USERS TABLE
============================================================

Users

Fields:

- id
- name
- email
- password
- createdAt
- updatedAt

Important:

id:
- Primary Key
- Auto Increment

email:
- Unique
- Not Null


============================================================
8. SUBJECTS TABLE
============================================================

Subjects

Fields:

- id
- name
- slug
- description
- createdAt
- updatedAt


============================================================
9. THE 13 SUBJECTS
============================================================

1. Landet Sverige
   slug: landet-sverige
   description:
   Geografi, klimat, naturresurser och indelning

2. Sveriges demokratiska system
   slug: demokratiskt-system
   description:
   Demokrati, folkstyre och hot mot demokratin

3. Så styrs Sverige
   slug: sa-styrs-sverige
   description:
   Stat, regioner, kommuner och statsskick (kungen)

4. Politiska val och partier
   slug: val-och-partier
   description:
   Rösträtt, valsystem och riksdagspartier

5. Lag och rätt
   slug: lag-och-ratt
   description:
   Grundlagar, rättsväsendet, polisen och domstolar

6. Medier och källkritik
   slug: mediernas-roll
   description:
   Fria medier, public service och källkritik

7. Mänskliga rättigheter
   slug: manskliga-rattigheter
   description:
   FN-konventioner, jämställdhet, barn och minoriteter

8. Arbetsmarknad och ekonomi
   slug: arbetsmarknad-och-ekonomi
   description:
   Facket, kollektivavtal, skatt och privatekonomi

9. Välfärdssamhället
   slug: valfardssamhallet
   description:
   Skattens roll, sjukvård, skola och socialtjänst

10. Sveriges moderna historia
    slug: sveriges-historia
    description:
    Industrialisering, rösträtt, folkhemmet och efterkrigstiden

11. Sverige och omvärlden
    slug: sverige-och-omvarlden
    description:
    EU, FN, Nato och totalförsvaret

12. Religion i Sverige
    slug: religion-i-sverige
    description:
    Religionsfrihet, sekulär stat och mångreligiositet

13. Traditioner och högtider
    slug: traditioner-och-hogtider
    description:
    Jul, midsommar, valborg, nationaldagen och nya traditioner


============================================================
10. QUESTIONS TABLE
============================================================

Questions

Fields:

- id
- subjectId
- question
- explanation
- difficulty
- createdAt
- updatedAt


IMPORTANT:

subjectId connects a question to a subject.

Example:

question:
Vilken är Sveriges huvudstad?

subjectId:
1

Subject:
Landet Sverige

explanation:
Stockholm är Sveriges huvudstad och ligger i landskapet Uppland.

difficulty:
easy


============================================================
11. ANSWERS TABLE
============================================================

Answers

Fields:

- id
- questionId
- answer
- isCorrect
- createdAt
- updatedAt


Example for Question 1:

A - Göteborg       - false
B - Stockholm      - true
C - Malmö           - false
D - Uppsala         - false


The relationship is:

Questions.id
     |
     v
Answers.questionId


============================================================
12. QUESTION TRANSLATIONS
============================================================

QuestionTranslations

Fields:

- id
- questionId
- language
- translatedQuestion
- translatedExplanation
- createdAt
- updatedAt


CURRENT LANGUAGES:

en = English
ar = Arabic
fa = Farsi/Dari


Example:

questionId:
1

language:
en

translatedQuestion:
What is the capital of Sweden?

translatedExplanation:
Stockholm is the capital of Sweden and is located
in the province of Uppland.


Arabic:

language:
ar

translatedQuestion:
ما هي عاصمة السويد؟

translatedExplanation:
ستوكهولم هي عاصمة السويد وتقع في إقليم أوبلاند.


Dari:

language:
fa

translatedQuestion:
پایتخت سویدن کدام است؟

translatedExplanation:
استکهلم پایتخت سویدن است و در منطقهٔ اوپلاند قرار دارد.


============================================================
13. ANSWER TRANSLATIONS
============================================================

AnswerTranslations

Fields:

- id
- answerId
- language
- translatedAnswer
- createdAt
- updatedAt


CURRENT LANGUAGES:

en = English
ar = Arabic
fa = Farsi/Dari


Example:

Original Swedish:
Göteborg

English:
Gothenburg

Arabic:
غوتنبرغ

Dari:
گوتنبرگ


The relationship is:

Answers.id
     |
     v
AnswerTranslations.answerId


============================================================
14. MULTILINGUAL ARCHITECTURE
============================================================

Swedish is the original language.

Original question and explanation are stored in:

Questions

Original answers are stored in:

Answers


Translations are stored separately.

Question:

Questions
   |
   +-- Swedish original
   |
   +-- QuestionTranslations
          |
          +-- en
          +-- ar
          +-- fa


Answer:

Answers
   |
   +-- Swedish original
   |
   +-- AnswerTranslations
          |
          +-- en
          +-- ar
          +-- fa


This means the original Swedish content is always preserved.


============================================================
15. LANGUAGE SYSTEM
============================================================

The frontend will eventually have a language button at the
top or corner of the page.

Example:

[ Svenska ] [ English ] [ العربية ] [ دری ]


When the user selects English:

GET /api/questions?language=en

When the user selects Arabic:

GET /api/questions?language=ar

When the user selects Farsi/Dari:

GET /api/questions?language=fa


Swedish is the default language.


============================================================
16. SERVER.JS
============================================================

server.js currently does the following:

1. Loads Express
2. Loads CORS
3. Loads dotenv
4. Loads database connection
5. Loads Sequelize
6. Loads all models
7. Defines model relationships
8. Enables JSON requests
9. Enables API routes
10. Connects to MySQL
11. Synchronizes database tables
12. Starts the Express server


SERVER:

http://localhost:5000


ROOT ENDPOINT:

GET /

Returns:

{
    "message": "MedborgaTest API is running 🚀"
}


============================================================
17. API ROUTES
============================================================

SUBJECTS:

GET /api/subjects

Returns all 13 subjects.


QUESTIONS:

GET /api/questions

Returns all questions.

Swedish is the default language.


ENGLISH:

GET /api/questions?language=en


ARABIC:

GET /api/questions?language=ar


FARSI/DARI:

GET /api/questions?language=fa


QUESTIONS BY SUBJECT:

GET /api/questions/subject/1


For example:

Subject 1 = Landet Sverige


============================================================
18. ANSWER CHECKING API
============================================================

Endpoint:

POST /api/questions/:questionId/answer


Example:

POST /api/questions/1/answer


Request body:

{
    "answerId": 30
}


The backend checks:

1. Does the answer exist?
2. Does the answer belong to the question?
3. Is the answer correct?
4. What explanation should be returned?


Example:

{
    "correct": true,
    "explanation": "Stockholm är Sveriges huvudstad och ligger i landskapet Uppland."
}


Wrong answer example:

{
    "correct": false,
    "explanation": "Stockholm är Sveriges huvudstad och ligger i landskapet Uppland."
}


============================================================
19. MULTILINGUAL ANSWER CHECKING
============================================================

The answer-checking system will use the selected language
for the explanation.

English:

POST /api/questions/1/answer?language=en


Arabic:

POST /api/questions/1/answer?language=ar


Farsi/Dari:

POST /api/questions/1/answer?language=fa


This allows the frontend to show the explanation in the
user's selected language.


============================================================
20. POSTMAN TESTING
============================================================

The backend has been tested successfully using Postman.

TESTED:

- MySQL connection
- Sequelize
- Subjects
- Questions
- Answers
- Question relationships
- Answer relationships
- English translations
- Arabic translations
- Farsi/Dari translations
- Questions by subject
- Answer checking
- Correct answer
- Wrong answer
- Explanations


Example:

Answer 29:

{
    "correct": false,
    "explanation": "Stockholm is the capital of Sweden and is located in the province of Uppland."
}


Answer 30:

{
    "correct": true,
    "explanation": "Stockholm is the capital of Sweden and is located in the province of Uppland."
}


This confirms that the answer-checking endpoint works.


============================================================
21. TARGET FRONTEND QUESTION EXPERIENCE
============================================================

The frontend should eventually show something like:

Fråga 1 av 20

🌐 Dölj översättning

Sveriges demokratiska system

Vad betyder ordet demokrati?

What does the word 'democracy' mean?


A

Kungastyre

Rule by the king


B

Folkstyre

Rule by the people


C

Militärstyre

Rule by the military


D

Enpartistyre

One-party rule


After selecting an answer:

❌ Fel. Rätt svar är B: Folkstyre.

'Democracy' comes from Greek and means
rule by the people (folkstyre).


Nästa →

Avsluta

Tangentbord:
A · B · C · D
Enter = nästa


============================================================
22. FRONTEND LANGUAGE CONCEPT
============================================================

The frontend itself will support:

1. Swedish
2. English
3. Arabic

The question content will support:

1. Swedish
2. English
3. Arabic
4. Farsi/Dari


IMPORTANT:

Frontend interface language and question translation language
are related but should be treated separately.

For example:

Frontend:
English

Question:
Swedish original + English translation


or:

Frontend:
Arabic

Question:
Swedish original + Arabic translation


============================================================
23. IMPORTANT DEVELOPMENT PRINCIPLE
============================================================

Questions must NOT be hardcoded into the frontend.

The correct architecture is:

MySQL
   |
   v
Sequelize
   |
   v
Express API
   |
   v
Frontend


The frontend should fetch questions from the backend.

This will allow us to later:

- Add hundreds of questions
- Add more subjects
- Edit questions
- Add more languages
- Add explanations
- Create random tests
- Create 20-question tests
- Create a full exam simulator
- Track correct/wrong answers
- Track user progress
- Build an admin panel


============================================================
24. CURRENT STATUS
============================================================

DATABASE:

MySQL                         DONE
Users                         DONE
Subjects                      DONE
13 subjects                   DONE
Questions                     DONE
Answers                       DONE
Question translations         DONE
Answer translations           DONE


BACKEND:

Express                       DONE
Sequelize                     DONE
Database connection            DONE
Models                         DONE
Relationships                  DONE
Subject routes                 DONE
Question routes                DONE
Nodemon                        DONE
CORS                           DONE
dotenv                         DONE


LANGUAGES:

Swedish                       DONE
English                       DONE
Arabic                        DONE
Farsi/Dari                    DONE


TESTING:

Postman                       DONE
GET subjects                   DONE
GET questions                  DONE
GET translations               DONE
POST answer checking           DONE


FRONTEND:

Question interface             NEXT
Language selector              NEXT
Question progress              NEXT
Answer selection               NEXT
Correct/wrong feedback         NEXT
Explanation display            NEXT
Next button                    NEXT
20-question practice           NEXT
Results page                   NEXT
Exam simulator                 LATER
User progress                  LATER
Authentication                 LATER
Admin panel                    LATER


============================================================
25. COMPLETE SYSTEM MAP
============================================================

                         MEDBORGATEST
                              |
             +----------------+----------------+
             |                                 |
             v                                 v
         FRONTEND                          BACKEND
             |                                 |
             |                              Node.js
             |                              Express
             |                              Sequelize
             |                                 |
             |                         +-------+-------+
             |                         |               |
             |                         v               v
             |                  Subject Routes   Question Routes
             |                         |               |
             |                         +-------+-------+
             |                                 |
             |                              MODELS
             |                                 |
             |       +------------+-------------+-------------+
             |       |            |             |             |
             |       v            v             v             v
             |     User        Subject       Question       Answer
             |                                     |          |
             |                                     |          |
             |                                     v          v
             |                            QuestionTranslation
             |                                                |
             |                                                v
             |                                      AnswerTranslation
             |                                 |
             +------------- API ---------------+
                                           |
                                           v
                                         MySQL


============================================================
26. NEXT DEVELOPMENT STEP
============================================================

The backend is now working.

The next step is to build the FRONTEND.

The first frontend version should:

1. Connect to the backend API
2. Load questions from MySQL through the API
3. Display one question at a time
4. Display four answer options
5. Allow the user to select an answer
6. Send the answer to the backend
7. Display correct/incorrect feedback
8. Display the explanation
9. Display "Nästa"
10. Show "Fråga 1 av 20"
11. Add the language selector
12. Display the selected translation
13. Support Swedish, English and Arabic frontend UI
14. Support Swedish, English, Arabic and Farsi/Dari
    question content


============================================================
END OF DOCUMENTATION
============================================================