import { useEffect, useState } from 'react';
import { Alert, Button, Card, CardContent, Chip, Stack, Typography } from '@mui/material';
import { useAdminAuth } from '../contexts/AdminAuthContext';
import { getAnnouncement, updateAnnouncement } from '../../services/announcementService';

export default function AnnouncementSettings() {
  const { token } = useAdminAuth();
  const [enabled, setEnabled] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [reload, setReload] = useState(0);

  useEffect(() => {
    let active = true;
    getAnnouncement().then(response => {
      if (active) { setEnabled(response.announcementEnabled); setError(''); }
    }).catch(() => { if (active) setError('Inställningen kunde inte hämtas. Försök igen.'); });
    return () => { active = false; };
  }, [reload]);

  async function toggle() {
    setBusy(true);
    setError('');
    setMessage('');
    try {
      const response = await updateAnnouncement(token, !enabled);
      setEnabled(response.announcementEnabled);
      setMessage(response.message);
    } catch (error) {
      setError(error.response?.data?.message || 'Inställningen kunde inte sparas. Försök igen.');
    } finally { setBusy(false); }
  }

  return (
    <Card variant="outlined" sx={{ borderRadius: 2.5 }}>
      <CardContent sx={{ p: 2.5 }}>
        <Stack spacing={2}>
          <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>Meddelandefält på webbplatsen</Typography>
          <Typography variant="body2" color="text.secondary">Visa eller dölj den smala informationsraden ovanför huvudmenyn på de publika sidorna.</Typography>
          <Chip size="small" sx={{ alignSelf: 'flex-start' }} label={enabled === null ? 'Hämtar status...' : enabled ? 'Aktiverat' : 'Inaktiverat'} color={enabled ? 'success' : 'default'} variant="outlined" />
          {error && <Alert severity="error">{error}</Alert>}
          {message && <Alert severity="success" role="status">{message}</Alert>}
          <Stack direction="row" spacing={1}>
            <Button variant="contained" size="small" onClick={toggle} disabled={busy || enabled === null}>
              {busy ? 'Sparar...' : enabled ? 'Inaktivera meddelandefält' : 'Aktivera meddelandefält'}
            </Button>
            {error && <Button size="small" onClick={() => setReload(value => value + 1)} disabled={busy}>Hämta status igen</Button>}
          </Stack>
          <Typography variant="caption" color="text.secondary">Ändringen sparas direkt. Öppna publika sidor uppdateras när de får fokus eller inom en minut.</Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}
