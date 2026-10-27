import { Alert, Box, Divider, Paper, Stack, Typography } from "@mui/material";

function MaterialPreview({ title, introduction, body }) {
  const hasContent = title?.trim() || introduction?.trim() || body?.trim();

  if (!hasContent) {
    return (
      <Alert severity="info">
        Förhandsvisningen visas när du börjar skriva materialet.
      </Alert>
    );
  }

  return (
    <Paper
      variant="outlined"
      sx={{
        p: {
          xs: 2.5,
          sm: 4,
        },
        backgroundColor: "#FFFFFF",
      }}
    >
      <Stack spacing={3}>
        <Box>
          <Typography variant="overline" color="success.main" fontWeight={800}>
            Studiematerial
          </Typography>

          <Typography
            variant="h4"
            component="h2"
            sx={{
              mt: 0.5,
            }}
          >
            {title || "Rubrik saknas"}
          </Typography>

          {introduction && (
            <Typography
              color="text.secondary"
              sx={{
                mt: 1.5,
                lineHeight: 1.8,
              }}
            >
              {introduction}
            </Typography>
          )}
        </Box>

        <Divider />

        {body ? (
          <Box
            sx={{
              "& h2": {
                mt: 3,
                mb: 1.25,
                fontSize: 24,
              },

              "& h2:first-of-type": {
                mt: 0,
              },

              "& p": {
                color: "text.secondary",
                lineHeight: 1.8,
              },

              "& ul, & ol": {
                pl: 3,
                color: "text.secondary",
              },

              "& li": {
                mb: 0.75,
                lineHeight: 1.7,
              },

              "& a": {
                color: "primary.main",
              },
            }}
            dangerouslySetInnerHTML={{
              __html: body,
            }}
          />
        ) : (
          <Typography color="text.secondary">
            Artikelinnehållet saknas.
          </Typography>
        )}
      </Stack>
    </Paper>
  );
}

export default MaterialPreview;
