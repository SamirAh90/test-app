const AppSetting = require('../models/AppSetting');
const key = 'announcement_enabled';

exports.getAnnouncement = async (req, res) => {
  res.set('Cache-Control', 'no-store');
  try {
    const setting = await AppSetting.findOne({ where: { key }, attributes: ['value'] });
    return res.json({ announcementEnabled: setting ? setting.value === 'true' : true });
  } catch (error) {
    console.error('Announcement settings read failed:', error.name);
    return res.status(500).json({ message: 'Meddelandets inställning kunde inte hämtas.' });
  }
};

exports.updateAnnouncement = async (req, res) => {
  const { announcementEnabled } = req.body;
  if (typeof announcementEnabled !== 'boolean') {
    return res.status(400).json({ message: 'Aktiveringen måste vara true eller false.' });
  }
  try {
    await AppSetting.upsert({ key, value: String(announcementEnabled), valueType: 'boolean', description: 'Show or hide the public announcement bar.' });
    return res.json({ announcementEnabled, message: announcementEnabled ? 'Meddelandefältet är aktiverat.' : 'Meddelandefältet är inaktiverat.' });
  } catch (error) {
    console.error('Announcement settings update failed:', error.name);
    return res.status(500).json({ message: 'Meddelandets inställning kunde inte sparas.' });
  }
};
