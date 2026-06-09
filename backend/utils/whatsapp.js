const https = require('https');

/**
 * Sends a WhatsApp message programmatically in the background using CallMeBot.
 * @param {string} text - Message to send
 * @returns {Promise<boolean>} Success status
 */
const sendWhatsAppMessage = (text) => {
  return new Promise((resolve) => {
    const phone = process.env.ADMIN_PHONE || '918219935062';
    const apikey = process.env.CALLMEBOT_API_KEY;

    if (!apikey) {
      console.warn('[WARN] CALLMEBOT_API_KEY is not set in backend/.env. WhatsApp notification skipped.');
      return resolve(false);
    }

    const encodedText = encodeURIComponent(text);
    const url = `https://api.callmebot.com/whatsapp.php?phone=${phone}&text=${encodedText}&apikey=${apikey}`;

    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        if (res.statusCode === 200) {
          console.log(`[INFO] WhatsApp message successfully sent to ${phone} via CallMeBot.`);
          resolve(true);
        } else {
          console.error(`[ERROR] CallMeBot API returned status ${res.statusCode}: ${data}`);
          resolve(false);
        }
      });
    }).on('error', (err) => {
      console.error('[ERROR] Failed to send WhatsApp message via CallMeBot:', err.message);
      resolve(false);
    });
  });
};

module.exports = {
  sendWhatsAppMessage
};
