import {
  Alert,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from "@mui/material";

function ConfirmDeleteDialog({
  open,
  title = "Bekräfta borttagning",
  itemName,
  description,
  deleting = false,
  error = "",
  onClose,
  onConfirm,
}) {
  const handleClose = () => {
    if (!deleting) {
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
      <DialogTitle>{title}</DialogTitle>

      <DialogContent dividers>
        <Stack spacing={2}>
          {error && <Alert severity="error">{error}</Alert>}

          <Typography>
            Är du säker på att du vill ta bort
            {itemName ? (
              <>
                {" "}
                <strong>{itemName}</strong>
              </>
            ) : null}
            ?
          </Typography>

          {description && (
            <Typography variant="body2" color="text.secondary">
              {description}
            </Typography>
          )}
        </Stack>
      </DialogContent>

      <DialogActions
        sx={{
          px: 3,
          py: 2,
        }}
      >
        <Button color="inherit" onClick={handleClose} disabled={deleting}>
          Avbryt
        </Button>

        <Button
          color="error"
          variant="contained"
          onClick={onConfirm}
          disabled={deleting}
          sx={{
            minWidth: 110,
          }}
        >
          {deleting ? (
            <CircularProgress size={22} color="inherit" />
          ) : (
            "Ta bort"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ConfirmDeleteDialog;
