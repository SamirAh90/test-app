import { useEffect, useState } from "react";

import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";

const LANGUAGE_OPTIONS = [
  {
    code: "en",
    label: "English",
    direction: "ltr",
  },
  {
    code: "ar",
    label: "Arabiska",
    direction: "rtl",
  },
  {
    code: "fa",
    label: "Persiska / Dari",
    direction: "rtl",
  },
];

const createEmptyTranslations = () => ({
  en: {
    translatedQuestion: "",
    translatedExplanation: "",
    answers: {},
  },
  ar: {
    translatedQuestion: "",
    translatedExplanation: "",
    answers: {},
  },
  fa: {
    translatedQuestion: "",
    translatedExplanation: "",
    answers: {},
  },
});

function TranslationDialog({
  open,
  question,
  loading = false,
  saving = false,
  error = "",
  onClose,
  onSave,
}) {
  const [selectedLanguage, setSelectedLanguage] = useState("en");

  const [translations, setTranslations] = useState(createEmptyTranslations());

  const [validationError, setValidationError] = useState("");

  useEffect(() => {
    if (!open) {
      return;
    }

    const initialTranslations = createEmptyTranslations();

    for (const language of LANGUAGE_OPTIONS) {
      const languageCode = language.code;

      initialTranslations[languageCode] = {
        translatedQuestion:
          question?.translations?.[languageCode]?.translatedQuestion || "",

        translatedExplanation:
          question?.translations?.[languageCode]?.translatedExplanation || "",

        answers: {},
      };

      for (const answer of question?.answers || []) {
        initialTranslations[languageCode].answers[answer.id] =
          answer.translations?.[languageCode] || "";
      }
    }

    setTranslations(initialTranslations);
    setSelectedLanguage("en");
    setValidationError("");
  }, [open, question]);

  const currentLanguage =
    LANGUAGE_OPTIONS.find((language) => language.code === selectedLanguage) ||
    LANGUAGE_OPTIONS[0];

  const currentTranslation =
    translations[selectedLanguage] ||
    createEmptyTranslations()[selectedLanguage];

  const handleQuestionChange = (field, value) => {
    setTranslations((currentTranslations) => ({
      ...currentTranslations,

      [selectedLanguage]: {
        ...currentTranslations[selectedLanguage],
        [field]: value,
      },
    }));

    setValidationError("");
  };

  const handleAnswerChange = (answerId, value) => {
    setTranslations((currentTranslations) => ({
      ...currentTranslations,

      [selectedLanguage]: {
        ...currentTranslations[selectedLanguage],

        answers: {
          ...currentTranslations[selectedLanguage].answers,
          [answerId]: value,
        },
      },
    }));

    setValidationError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    for (const language of LANGUAGE_OPTIONS) {
      const languageData = translations[language.code];

      const translatedQuestion = languageData.translatedQuestion.trim();

      const translatedAnswers = Object.values(languageData.answers).filter(
        (answer) => answer.trim(),
      );

      if (translatedAnswers.length > 0 && !translatedQuestion) {
        setSelectedLanguage(language.code);

        setValidationError(
          `${language.label}: frågan måste översättas om svaren har översatts.`,
        );

        return;
      }
    }

    await onSave(translations);
  };

  const handleClose = () => {
    if (!saving) {
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="lg">
      <DialogTitle>
        <Stack spacing={0.5}>
          <Typography variant="h6">Översätt fråga</Typography>

          <Typography variant="body2" color="text.secondary">
            Fråga #{question?.id || "—"} ·{" "}
            {question?.subject?.name || "Inget ämne"}
          </Typography>
        </Stack>
      </DialogTitle>

      <DialogContent dividers>
        {loading ? (
          <Stack
            spacing={2}
            sx={{
              minHeight: 460,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CircularProgress />

            <Typography color="text.secondary">
              Hämtar översättningar...
            </Typography>
          </Stack>
        ) : (
          <Stack
            component="form"
            id="translation-edit-form"
            spacing={3}
            onSubmit={handleSubmit}
          >
            {(validationError || error) && (
              <Alert severity="error">{validationError || error}</Alert>
            )}

            <Box
              sx={{
                p: 2.75,
                border: 1,
                borderColor: "divider",
                borderRadius: 2,
                backgroundColor: "background.default",
              }}
            >
              <Typography variant="overline" color="text.secondary">
                Svenska originalet
              </Typography>

              <Typography
                variant="h6"
                sx={{
                  mt: 0.5,
                }}
              >
                {question?.question || "Ingen fråga"}
              </Typography>

              {question?.explanation && (
                <Typography
                  color="text.secondary"
                  sx={{
                    mt: 1,
                    lineHeight: 1.7,
                  }}
                >
                  {question.explanation}
                </Typography>
              )}

              <Stack
                spacing={1}
                sx={{
                  mt: 2,
                }}
              >
                {(question?.answers || []).map((answer, index) => (
                  <Typography key={answer.id} variant="body2">
                    <Box
                      component="span"
                      sx={{
                        fontWeight: 700,
                      }}
                    >
                      {String.fromCharCode(65 + index)}.
                    </Box>{" "}
                    {answer.answer}
                  </Typography>
                ))}
              </Stack>
            </Box>

            <Divider />

            <Tabs
              value={selectedLanguage}
              onChange={(_event, newLanguage) => {
                setSelectedLanguage(newLanguage);
                setValidationError("");
              }}
              variant="scrollable"
              scrollButtons="auto"
            >
              {LANGUAGE_OPTIONS.map((language) => (
                <Tab
                  key={language.code}
                  value={language.code}
                  label={language.label}
                />
              ))}
            </Tabs>

            <Box
              dir={currentLanguage.direction}
              sx={{
                pb: 1.5,
              }}
            >
              <Stack spacing={2.5}>
                <TextField
                  fullWidth
                  multiline
                  minRows={2}
                  label={`Fråga – ${currentLanguage.label}`}
                  value={currentTranslation.translatedQuestion}
                  onChange={(event) =>
                    handleQuestionChange(
                      "translatedQuestion",
                      event.target.value,
                    )
                  }
                  disabled={saving}
                />

                <TextField
                  fullWidth
                  multiline
                  minRows={3}
                  label={`Förklaring – ${currentLanguage.label}`}
                  value={currentTranslation.translatedExplanation}
                  onChange={(event) =>
                    handleQuestionChange(
                      "translatedExplanation",
                      event.target.value,
                    )
                  }
                  disabled={saving}
                />

                <Divider />

                <Typography
                  variant="h6"
                  sx={{
                    direction: "ltr",
                    textAlign: "left",
                  }}
                >
                  Svarsalternativ
                </Typography>

                {(question?.answers || []).map((answer, index) => (
                  <TextField
                    key={answer.id}
                    fullWidth
                    multiline
                    minRows={2}
                    label={`Svar ${String.fromCharCode(
                      65 + index,
                    )} – ${currentLanguage.label}`}
                    value={currentTranslation.answers[answer.id] || ""}
                    onChange={(event) =>
                      handleAnswerChange(answer.id, event.target.value)
                    }
                    disabled={saving}
                    helperText={`Svenska: ${answer.answer}`}
                    slotProps={{
                      formHelperText: {
                        sx: {
                          direction: "ltr",
                          textAlign: "left",
                        },
                      },
                    }}
                  />
                ))}
              </Stack>
            </Box>
          </Stack>
        )}
      </DialogContent>

      <DialogActions
        sx={{
          px: 3,
          py: 2,
        }}
      >
        <Button
          type="button"
          color="inherit"
          onClick={handleClose}
          disabled={saving}
        >
          Avbryt
        </Button>

        <Button
          type="submit"
          form="translation-edit-form"
          variant="contained"
          disabled={loading || saving || !question}
          sx={{
            minWidth: 120,
          }}
        >
          {saving ? (
            <CircularProgress size={22} color="inherit" />
          ) : (
            "Spara allt"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default TranslationDialog;
