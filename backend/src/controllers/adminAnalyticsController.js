const { fn, col, literal, Op } = require("sequelize");

const User = require("../models/User");
const Subject = require("../models/Subject");
const Question = require("../models/Question");
const QuizAttempt = require("../models/QuizAttempt");
const QuizAnswer = require("../models/QuizAnswer");
const AnalyticsEvent = require("../models/AnalyticsEvent");

/* -------------------------------- */
/* Constants                        */
/* -------------------------------- */

const FUNNEL_STEPS = [
  {
    eventName: "landing_view",
    label: "Startsidan visad",
  },
  {
    eventName: "hero_start_training_clicked",
    label: "Klickade på Börja träna",
  },
  {
    eventName: "trainer_page_viewed",
    label: "Träningssidan visad",
  },
  {
    eventName: "trainer_demo_selected",
    label: "Gratis demo vald",
  },
  {
    eventName: "trainer_started",
    label: "Träningen startad",
  },
  {
    eventName: "free_test_completed",
    label: "Gratis test slutfört",
  },
  {
    eventName: "results_viewed",
    label: "Resultatsidan visad",
  },
  {
    eventName: "registration_started",
    label: "Registrering påbörjad",
  },
  {
    eventName: "account_created",
    label: "Konto skapat",
  },
  {
    eventName: "premium_viewed",
    label: "Premiumsidan visad",
  },
  {
    eventName: "checkout_started",
    label: "Betalning påbörjad",
  },
  {
    eventName: "payment_completed",
    label: "Betalning slutförd",
  },
];

/* -------------------------------- */
/* Helpers                          */
/* -------------------------------- */

const toNumber = (value) => {
  const number = Number(value);

  return Number.isFinite(number) ? number : 0;
};

const calculatePercentage = (value, total) => {
  if (total <= 0) {
    return 0;
  }

  return Math.round((value / total) * 100);
};

const formatDateKey = (value) => {
  if (!value) {
    return null;
  }

  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }

  return String(value).slice(0, 10);
};

/* -------------------------------- */
/* Get analytics                    */
/* -------------------------------- */

const getAdminAnalytics = async (req, res) => {
  try {
    const thirtyDaysAgo = new Date();

    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 29);
    thirtyDaysAgo.setHours(0, 0, 0, 0);

    const [
      totalUsers,
      activeUsers,
      premiumUsers,
      totalQuizAttempts,
      quizTotals,
      subjectStatistics,
      questionStatistics,
      latestAttempts,

      totalAnalyticsEvents,
      uniqueVisitorResult,
      eventStatistics,
      dailyTraffic,
      recentEvents,
    ] = await Promise.all([
      /* -------------------------------- */
      /* User statistics                  */
      /* -------------------------------- */

      User.count(),

      User.count({
        where: {
          isActive: true,
        },
      }),

      User.count({
        where: {
          isPremium: true,
        },
      }),

      /* -------------------------------- */
      /* Quiz statistics                  */
      /* -------------------------------- */

      QuizAttempt.count(),

      QuizAttempt.findOne({
        attributes: [
          [fn("SUM", col("totalQuestions")), "answeredQuestions"],
          [fn("SUM", col("score")), "correctAnswers"],
          [fn("AVG", col("percentage")), "averagePercentage"],
        ],
        raw: true,
      }),

      /* -------------------------------- */
      /* Subject statistics               */
      /* -------------------------------- */

      QuizAnswer.findAll({
        attributes: [
          "subjectId",
          [fn("COUNT", col("QuizAnswer.id")), "totalAnswers"],
          [
            fn(
              "SUM",
              literal("CASE WHEN `QuizAnswer`.`correct` = 1 THEN 1 ELSE 0 END"),
            ),
            "correctAnswers",
          ],
        ],
        include: [
          {
            model: Subject,
            attributes: ["id", "name", "slug"],
          },
        ],
        group: [
          "QuizAnswer.subjectId",
          "Subject.id",
          "Subject.name",
          "Subject.slug",
        ],
        raw: true,
        nest: true,
      }),

      /* -------------------------------- */
      /* Question statistics              */
      /* -------------------------------- */

      QuizAnswer.findAll({
        attributes: [
          "questionId",
          [fn("COUNT", col("QuizAnswer.id")), "totalAnswers"],
          [
            fn(
              "SUM",
              literal("CASE WHEN `QuizAnswer`.`correct` = 1 THEN 1 ELSE 0 END"),
            ),
            "correctAnswers",
          ],
        ],
        group: ["QuizAnswer.questionId"],
        raw: true,
      }),

      /* -------------------------------- */
      /* Latest quiz attempts             */
      /* -------------------------------- */

      QuizAttempt.findAll({
        attributes: [
          "id",
          "userId",
          "quizType",
          "score",
          "totalQuestions",
          "percentage",
          "completedAt",
        ],
        include: [
          {
            model: User,
            attributes: ["id", "firstName", "lastName", "email"],
            required: false,
          },
        ],
        order: [["completedAt", "DESC"]],
        limit: 10,
      }),

      /* -------------------------------- */
      /* Marketing-event totals           */
      /* -------------------------------- */

      AnalyticsEvent.count(),

      AnalyticsEvent.findOne({
        attributes: [
          [fn("COUNT", fn("DISTINCT", col("sessionId"))), "uniqueVisitors"],
        ],
        raw: true,
      }),

      /* -------------------------------- */
      /* Event statistics                 */
      /* -------------------------------- */

      AnalyticsEvent.findAll({
        attributes: [
          "eventName",
          [fn("COUNT", col("id")), "totalEvents"],
          [fn("COUNT", fn("DISTINCT", col("sessionId"))), "uniqueVisitors"],
        ],
        group: ["eventName"],
        order: [[literal("totalEvents"), "DESC"]],
        raw: true,
      }),

      /* -------------------------------- */
      /* Traffic during last 30 days      */
      /* -------------------------------- */

      AnalyticsEvent.findAll({
        attributes: [
          [fn("DATE", col("createdAt")), "date"],
          [fn("COUNT", col("id")), "totalEvents"],
          [fn("COUNT", fn("DISTINCT", col("sessionId"))), "uniqueVisitors"],
        ],
        where: {
          createdAt: {
            [Op.gte]: thirtyDaysAgo,
          },
        },
        group: [fn("DATE", col("createdAt"))],
        order: [[fn("DATE", col("createdAt")), "ASC"]],
        raw: true,
      }),

      /* -------------------------------- */
      /* Recent analytics events          */
      /* -------------------------------- */

      AnalyticsEvent.findAll({
        attributes: [
          "id",
          "userId",
          "sessionId",
          "eventName",
          "pagePath",
          "metadata",
          "createdAt",
        ],
        include: [
          {
            model: User,
            attributes: ["id", "firstName", "lastName", "email"],
            required: false,
          },
        ],
        order: [["createdAt", "DESC"]],
        limit: 20,
      }),
    ]);

    /* -------------------------------- */
    /* General quiz totals             */
    /* -------------------------------- */

    const answeredQuestions = toNumber(quizTotals?.answeredQuestions);

    const correctAnswers = toNumber(quizTotals?.correctAnswers);

    const wrongAnswers = Math.max(answeredQuestions - correctAnswers, 0);

    const averagePercentage = Math.round(
      toNumber(quizTotals?.averagePercentage),
    );

    /* -------------------------------- */
    /* Format subject statistics       */
    /* -------------------------------- */

    const formattedSubjects = subjectStatistics.map((item) => {
      const totalAnswers = toNumber(item.totalAnswers);

      const correctAnswersForSubject = toNumber(item.correctAnswers);

      const wrongAnswersForSubject = Math.max(
        totalAnswers - correctAnswersForSubject,
        0,
      );

      return {
        subjectId: Number(item.subjectId),

        subject: item.Subject
          ? {
              id: item.Subject.id,
              name: item.Subject.name,
              slug: item.Subject.slug,
            }
          : null,

        totalAnswers,
        correctAnswers: correctAnswersForSubject,
        wrongAnswers: wrongAnswersForSubject,

        accuracy: calculatePercentage(correctAnswersForSubject, totalAnswers),
      };
    });

    const popularSubjects = [...formattedSubjects]
      .sort(
        (firstSubject, secondSubject) =>
          secondSubject.totalAnswers - firstSubject.totalAnswers,
      )
      .slice(0, 10);

    const hardestSubjects = [...formattedSubjects]
      .filter((subject) => subject.totalAnswers > 0)
      .sort(
        (firstSubject, secondSubject) =>
          firstSubject.accuracy - secondSubject.accuracy,
      )
      .slice(0, 10);

    /* -------------------------------- */
    /* Load question details           */
    /* -------------------------------- */

    const questionIds = questionStatistics
      .map((item) => Number(item.questionId))
      .filter((questionId) => Number.isInteger(questionId) && questionId > 0);

    const questions =
      questionIds.length > 0
        ? await Question.findAll({
            where: {
              id: {
                [Op.in]: questionIds,
              },
            },
            attributes: ["id", "subjectId", "question", "difficulty"],
            include: [
              {
                model: Subject,
                attributes: ["id", "name", "slug"],
              },
            ],
          })
        : [];

    const questionMap = new Map(
      questions.map((question) => [question.id, question]),
    );

    /* -------------------------------- */
    /* Format hardest questions        */
    /* -------------------------------- */

    const hardestQuestions = questionStatistics
      .map((item) => {
        const questionId = Number(item.questionId);
        const question = questionMap.get(questionId);

        const totalAnswers = toNumber(item.totalAnswers);

        const correctAnswersForQuestion = toNumber(item.correctAnswers);

        const wrongAnswersForQuestion = Math.max(
          totalAnswers - correctAnswersForQuestion,
          0,
        );

        return {
          questionId,

          question: question?.question || "Okänd fråga",

          difficulty: question?.difficulty || null,

          subject: question?.Subject
            ? {
                id: question.Subject.id,
                name: question.Subject.name,
                slug: question.Subject.slug,
              }
            : null,

          totalAnswers,
          correctAnswers: correctAnswersForQuestion,
          wrongAnswers: wrongAnswersForQuestion,

          accuracy: calculatePercentage(
            correctAnswersForQuestion,
            totalAnswers,
          ),

          wrongPercentage: calculatePercentage(
            wrongAnswersForQuestion,
            totalAnswers,
          ),
        };
      })
      .filter((item) => item.totalAnswers > 0)
      .sort((firstQuestion, secondQuestion) => {
        if (secondQuestion.wrongPercentage !== firstQuestion.wrongPercentage) {
          return secondQuestion.wrongPercentage - firstQuestion.wrongPercentage;
        }

        return secondQuestion.totalAnswers - firstQuestion.totalAnswers;
      })
      .slice(0, 10);

    /* -------------------------------- */
    /* Format latest attempts          */
    /* -------------------------------- */

    const formattedLatestAttempts = latestAttempts.map((attempt) => ({
      id: attempt.id,
      userId: attempt.userId,
      quizType: attempt.quizType,
      score: attempt.score,
      totalQuestions: attempt.totalQuestions,
      percentage: attempt.percentage,
      completedAt: attempt.completedAt,

      user: attempt.User
        ? {
            id: attempt.User.id,
            firstName: attempt.User.firstName,
            lastName: attempt.User.lastName,
            email: attempt.User.email,
          }
        : null,
    }));

    /* -------------------------------- */
    /* Format event statistics         */
    /* -------------------------------- */

    const formattedEventStatistics = eventStatistics.map((item) => ({
      eventName: item.eventName,
      totalEvents: toNumber(item.totalEvents),
      uniqueVisitors: toNumber(item.uniqueVisitors),
    }));

    const eventStatisticsMap = new Map(
      formattedEventStatistics.map((item) => [item.eventName, item]),
    );

    /* -------------------------------- */
    /* Format conversion funnel        */
    /* -------------------------------- */

    const landingVisitors =
      eventStatisticsMap.get("landing_view")?.uniqueVisitors || 0;

    let previousVisitors = landingVisitors;

    const conversionFunnel = FUNNEL_STEPS.map((step, index) => {
      const eventData = eventStatisticsMap.get(step.eventName);

      const visitors = eventData?.uniqueVisitors || 0;

      const conversionFromPrevious =
        index === 0 ? 100 : calculatePercentage(visitors, previousVisitors);

      const conversionFromLanding = calculatePercentage(
        visitors,
        landingVisitors,
      );

      const dropOffFromPrevious =
        index === 0 ? 0 : Math.max(previousVisitors - visitors, 0);

      const dropOffPercentage =
        index === 0
          ? 0
          : calculatePercentage(dropOffFromPrevious, previousVisitors);

      previousVisitors = visitors;

      return {
        position: index + 1,
        eventName: step.eventName,
        label: step.label,
        visitors,
        conversionFromPrevious,
        conversionFromLanding,
        dropOffFromPrevious,
        dropOffPercentage,
      };
    });

    /* -------------------------------- */
    /* Landing-section funnel          */
    /* -------------------------------- */

    const landingSectionEvents = [
      {
        eventName: "landing_hero_seen",
        label: "Hero",
      },
      {
        eventName: "landing_stats_seen",
        label: "Provstatistik",
      },
      {
        eventName: "landing_subjects_seen",
        label: "Ämnen",
      },
      {
        eventName: "landing_how_it_works_seen",
        label: "Så fungerar det",
      },
      {
        eventName: "landing_demo_question_seen",
        label: "Exempelfråga",
      },
      {
        eventName: "landing_features_seen",
        label: "Funktioner",
      },
      {
        eventName: "landing_faq_seen",
        label: "Vanliga frågor",
      },
      {
        eventName: "landing_cta_seen",
        label: "Avslutande uppmaning",
      },
      {
        eventName: "landing_disclaimer_seen",
        label: "Information",
      },
    ];

    let previousSectionVisitors = landingVisitors;

    const landingSections = landingSectionEvents.map((section, index) => {
      const visitors =
        eventStatisticsMap.get(section.eventName)?.uniqueVisitors || 0;

      const conversionFromPrevious = calculatePercentage(
        visitors,
        previousSectionVisitors,
      );

      const conversionFromLanding = calculatePercentage(
        visitors,
        landingVisitors,
      );

      const dropOffFromPrevious = Math.max(
        previousSectionVisitors - visitors,
        0,
      );

      previousSectionVisitors = visitors;

      return {
        position: index + 1,
        eventName: section.eventName,
        label: section.label,
        visitors,
        conversionFromPrevious,
        conversionFromLanding,
        dropOffFromPrevious,
      };
    });

    /* -------------------------------- */
    /* Format daily traffic            */
    /* -------------------------------- */

    const formattedDailyTraffic = dailyTraffic.map((item) => ({
      date: formatDateKey(item.date),
      totalEvents: toNumber(item.totalEvents),
      uniqueVisitors: toNumber(item.uniqueVisitors),
    }));

    /* -------------------------------- */
    /* Format recent events            */
    /* -------------------------------- */

    const formattedRecentEvents = recentEvents.map((event) => ({
      id: event.id,
      userId: event.userId,
      sessionId: event.sessionId,
      eventName: event.eventName,
      pagePath: event.pagePath,
      metadata: event.metadata,
      createdAt: event.createdAt,

      user: event.User
        ? {
            id: event.User.id,
            firstName: event.User.firstName,
            lastName: event.User.lastName,
            email: event.User.email,
          }
        : null,
    }));

    /* -------------------------------- */
    /* Response                        */
    /* -------------------------------- */

    return res.status(200).json({
      analytics: {
        overview: {
          totalUsers,
          activeUsers,
          inactiveUsers: Math.max(totalUsers - activeUsers, 0),
          premiumUsers,

          totalQuizAttempts,
          answeredQuestions,
          correctAnswers,
          wrongAnswers,
          averagePercentage,

          totalAnalyticsEvents,
          uniqueVisitors: toNumber(uniqueVisitorResult?.uniqueVisitors),

          landingVisitors,

          trainerVisitors:
            eventStatisticsMap.get("trainer_page_viewed")?.uniqueVisitors || 0,

          accountsCreated:
            eventStatisticsMap.get("account_created")?.uniqueVisitors || 0,

          premiumClicks:
            eventStatisticsMap.get("trainer_premium_clicked")?.totalEvents || 0,

          checkoutStarts:
            eventStatisticsMap.get("checkout_started")?.uniqueVisitors || 0,

          completedPayments:
            eventStatisticsMap.get("payment_completed")?.uniqueVisitors || 0,
        },

        marketing: {
          conversionFunnel,
          landingSections,
          topEvents: formattedEventStatistics.slice(0, 15),
          dailyTraffic: formattedDailyTraffic,
          recentEvents: formattedRecentEvents,
        },

        learning: {
          popularSubjects,
          hardestSubjects,
          hardestQuestions,
          latestAttempts: formattedLatestAttempts,
        },
      },
    });
  } catch (error) {
    console.error("Admin analytics error:", error);

    return res.status(500).json({
      message: "Analysinformationen kunde inte hämtas.",
    });
  }
};

module.exports = {
  getAdminAnalytics,
};
