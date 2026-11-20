import api from './api';

export async function getAnnouncement() {
  const response = await api.get('/public-settings/announcement');
  return response.data;
}

export async function updateAnnouncement(token, announcementEnabled) {
  const response = await api.put('/admin/settings/announcement', { announcementEnabled }, {
    headers: { Authorization: `Bearer ${token}` },
  });
  window.dispatchEvent(new Event('announcement-updated'));
  return response.data;
}
