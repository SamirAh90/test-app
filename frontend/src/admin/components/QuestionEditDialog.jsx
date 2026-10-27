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
  FormControl,
  FormControlLabel,
  FormLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

const createEmptyAnswers = () => [
  {
    id: null,
    answer: "",
    displayOrder: 1,
    isCorrect: true,
  },
  {
    id: null,
    answer: "",
    displayOrder: 2,
    isCorrect: false,
  },
  {
    id: null,
    answer: "",
    displayOrder: 3,
    isCorrect: false,
  },
  {
    id: null,
    answer: "",
    displayOrder: 4,
    isCorrect: false,
  },
];

function QuestionEditDialog({
  open,
  mode = "edit",
  question,
  subjects = [],
  loading = false,
  saving = false,
  error = "",
  onClose,
  onSave,
}) {
  const [formData, setFormData] = useState({
    subjectId: "",
    difficulty: "medium",
    question: "",
    explanation: "",
    answers: createEmptyAnswers(),
  });

  const [correctAnswerOrder, setCorrectAnswerOrder] = useState(1);
  const [validationError, setValidationError] = useState("");

  const isCreateMode = mode === "create";

  useEffect(() => {
    if (!open) {
      return;
    }

    const answerSource = Array.isArray(question?.Answers)
      ? question.Answers
      : Array.isArray(question?.answers)
        ? question.answers
        : [];

    const sortedAnswers = [...answerSource].sort(
      (firstAnswer, secondAnswer) =>
        firstAnswer.displayOrder - secondAnswer.displayOrder,
    );

    const normalizedAnswers =
      sortedAnswers.length === 4
        ? sortedAnswers.map((answer, index) => ({
            id: answer.id || null,
            answer: answer.answer || "",
            displayOrder: answer.displayOrder || index + 1,
            isCorrect: Boolean(answer.isCorrect),
          }))
        : createEmptyAnswers();

    const correctAnswer =
      normalizedAnswers.find((answer) => answer.isCorrect) ||
      normalizedAnswers[0];

    setFormData({
      subjectId: question?.subjectId || "",
      difficulty: question?.difficulty || "medium",
      question: question?.question || "",
      explanation: question?.explanation || "",
      answers: normalizedAnswers,
    });

    setCorrectAnswerOrder(correctAnswer.displayOrder);
    setValidationError("");
  }, [open, question]);

  const handleFieldChange = (event) => {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));

    setValidationError("");
  };

  const handleAnswerChange = (answerIndex, value) => {
    setFormData((currentData) => ({
      ...currentData,
      answers: currentData.answers.map((answer, index) =>
        index === answerIndex
          ? {
              ...answer,
              answer: value,
            }
          : answer,
      ),
    }));

    setValidationError("");
  };

  const handleCorrectAnswerChange = (event) => {
    setCorrectAnswerOrder(Number(event.target.value));
    setValidationError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const subjectId = Number(formData.subjectId);
    const normalizedQuestion = formData.question.trim();
    const normalizedExplanation = formData.explanation.trim();

    if (!Number.isInteger(subjectId) || subjectId <= 0) {
      setValidationError("Välj ett ämne.");
      return;
    }

    if (!["easy", "medium", "hard"].includes(formData.difficulty)) {
      setValidationError("Välj en giltig svårighetsgrad.");
      return;
    }

    if (!normalizedQuestion) {
      setValidationError("Frågan måste fyllas i.");
      return;
    }

    const normalizedAnswers = formData.answers.map((answer, index) => ({
      id: answer.id || null,
      answer: answer.answer.trim(),
      displayOrder: index + 1,
      isCorrect: index + 1 === correctAnswerOrder,
    }));

    const hasEmptyAnswer = normalizedAnswers.some((answer) => !answer.answer);

    if (hasEmptyAnswer) {
      setValidationError("Alla fyra svar måste fyllas i.");
      return;
    }

    const correctAnswers = normalizedAnswers.filter(
      (answer) => answer.isCorrect,
    );

    if (correctAnswers.length !== 1) {
      setValidationError("Exakt ett svar måste vara korrekt.");
      return;
    }

    await onSave({
      subjectId,
      difficulty: formData.difficulty,
      question: normalizedQuestion,
      explanation: normalizedExplanation || null,
      answers: normalizedAnswers,
    });
  };

  const handleClose = () => {
    if (!saving) {
      onClose();
    }
  };

  const answerLabels = ["A", "B", "C", "D"];

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle>
        <Stack spacing={0.5}>
          <Typography variant="h6">
            {isCreateMode ? "Skapa ny fråga" : "Redigera fråga"}
          </Typography>

          <Typography variant="body2" color="text.secondary">
            Lägg till frågan, förklaringen och fyra svarsalternativ.
          </Typography>
        </Stack>
      </DialogTitle>

      <DialogContent dividers>
        {loading ? (
          <Stack
            spacing={2}
            sx={{
              minHeight: 420,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CircularProgress />

            <Typography color="text.secondary">Hämtar frågan...</Typography>
          </Stack>
        ) : (
          <Stack
            component="form"
            id="question-edit-form"
            spacing={3}
            onSubmit={handleSubmit}
            sx={{
              pt: 1,
            }}
          >
            {(validationError || error) && (
              <Alert severity="error">{validationError || error}</Alert>
            )}

            <Stack
              direction={{
                xs: "column",
                sm: "row",
              }}
              spacing={2}
            >
              <TextField
                select
                required
                fullWidth
                name="subjectId"
                label="Ämne"
                value={formData.subjectId}
                onChange={handleFieldChange}
                disabled={saving}
              >
                {subjects.map((subject) => (
                  <MenuItem key={subject.id} value={subject.id}>
                    {subject.name}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                select
                required
                fullWidth
                name="difficulty"
                label="Svårighetsgrad"
                value={formData.difficulty}
                onChange={handleFieldChange}
                disabled={saving}
              >
                <MenuItem value="easy">Lätt</MenuItem>
                <MenuItem value="medium">Medel</MenuItem>
                <MenuItem value="hard">Svår</MenuItem>
              </TextField>
            </Stack>

            <TextField
              required
              fullWidth
              multiline
              minRows={3}
              name="question"
              label="Fråga"
              value={formData.question}
              onChange={handleFieldChange}
              disabled={saving}
            />

            <TextField
              fullWidth
              multiline
              minRows={4}
              name="explanation"
              label="Förklaring"
              value={formData.explanation}
              onChange={handleFieldChange}
              disabled={saving}
              helperText="Förklaringen visas efter att användaren har svarat."
            />

            <Box>
              <Typography variant="h6" sx={{ mb: 0.5 }}>
                Svarsalternativ
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  mb: 2,
                }}
              >
                Fyll i fyra svar och välj vilket svar som är korrekt.
              </Typography>

              <Stack spacing={2}>
                {formData.answers.map((answer, index) => (
                  <Stack
                    key={answer.displayOrder}
                    direction={{
                      xs: "column",
                      sm: "row",
                    }}
                    spacing={1.5}
                    sx={{
                      alignItems: {
                        xs: "stretch",
                        sm: "center",
                      },
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      sx={{
                        width: {
                          xs: "auto",
                          sm: 26,
                        },
                        fontWeight: 700,
                      }}
                    >
                      {answerLabels[index]}
                    </Typography>

                    <TextField
                      required
                      fullWidth
                      label={`Svar ${answerLabels[index]}`}
                      value={answer.answer}
                      onChange={(event) =>
                        handleAnswerChange(index, event.target.value)
                      }
                      disabled={saving}
                    />
                  </Stack>
                ))}
              </Stack>
            </Box>

            <FormControl>
              <FormLabel>Rätt svar</FormLabel>

              <RadioGroup
                row
                value={correctAnswerOrder}
                onChange={handleCorrectAnswerChange}
              >
                {answerLabels.map((label, index) => (
                  <FormControlLabel
                    key={label}
                    value={index + 1}
                    control={<Radio disabled={saving} />}
                    label={`Svar ${label}`}
                  />
                ))}
              </RadioGroup>
            </FormControl>
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
          form="question-edit-form"
          variant="contained"
          disabled={loading || saving}
          sx={{
            minWidth: 110,
          }}
        >
          {saving ? (
            <CircularProgress size={22} color="inherit" />
          ) : isCreateMode ? (
            "Skapa"
          ) : (
            "Spara"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default QuestionEditDialog;
