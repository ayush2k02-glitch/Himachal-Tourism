const https = require('https');

/**
 * Sends a normal SMS message programmatically in the background using Twilio, Fast2SMS, or TextBelt (Free fallback).
 * @param {string} text - Message to send
 * @returns {Promise<boolean>} Success status
 */
const sendSMSMessage = (text) => {
  return new Promise((resolve) => {
    const phone = process.env.ADMIN_PHONE || '918219935062';
    
    // Ensure phone has proper Indian prefix (+91) if it doesn't already have it
    let formattedPhone = phone.replace(/\D/g, '');
    if (formattedPhone.length === 10) {
      formattedPhone = `+91${formattedPhone}`;
    } else if (!formattedPhone.startsWith('91') && formattedPhone.length > 10) {
      formattedPhone = `+${formattedPhone}`;
    } else if (formattedPhone.startsWith('91')) {
      formattedPhone = `+${formattedPhone}`;
    }

    // 1. Option A: Fast2SMS if API key is provided
    const fast2smsKey = process.env.FAST2SMS_API_KEY;
    if (fast2smsKey) {
      const cleanPhone = formattedPhone.replace(/\D/g, '').slice(-10); // 10-digit format
      const encodedText = encodeURIComponent(text);
      const url = `https://www.fast2sms.com/dev/bulkV2?authorization=${fast2smsKey}&route=q&message=${encodedText}&numbers=${cleanPhone}`;

      https.get(url, (res) => {
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => {
          if (res.statusCode === 200) {
            console.log(`[INFO] SMS successfully sent to ${cleanPhone} via Fast2SMS.`);
            resolve(true);
          } else {
            console.error(`[ERROR] Fast2SMS returned status ${res.statusCode}: ${data}`);
            resolve(false);
          }
        });
      }).on('error', (err) => {
        console.error('[ERROR] Failed to send SMS via Fast2SMS:', err.message);
        resolve(false);
      });
      return;
    }

    // 2. Option B: Twilio if Twilio credentials are provided
    const twilioSid = process.env.TWILIO_ACCOUNT_SID;
    const twilioToken = process.env.TWILIO_AUTH_TOKEN;
    const twilioFrom = process.env.TWILIO_PHONE_NUMBER;

    if (twilioSid && twilioToken && twilioFrom) {
      try {
        const twilio = require('twilio');
        const client = twilio(twilioSid, twilioToken);

        client.messages.create({
          body: text,
          to: formattedPhone,
          from: twilioFrom
        })
        .then((message) => {
          console.log(`[INFO] SMS successfully sent to ${formattedPhone} via Twilio. SID: ${message.sid}`);
          resolve(true);
        })
        .catch((err) => {
          console.error('[ERROR] Twilio failed to send SMS:', err.message);
          resolve(false);
        });
      } catch (err) {
        console.error('[ERROR] Failed to initialize Twilio:', err.message);
        resolve(false);
      }
      return;
    }

    // 3. Option C: Fallback to TextBelt Free Tier (1 free message per day)
    console.log(`[INFO] No API key configured for Fast2SMS or Twilio. Using TextBelt free tier fallback to send SMS to ${formattedPhone}...`);
    
    const postData = JSON.stringify({
      phone: formattedPhone,
      message: text,
      key: 'textbelt'
    });

    const options = {
      hostname: 'textbelt.com',
      port: 443,
      path: '/text',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const responseJson = JSON.parse(body);
          if (responseJson.success) {
            console.log(`[INFO] Free SMS successfully sent to ${formattedPhone} via TextBelt. Remaining quota: ${responseJson.quotaRemaining}`);
            resolve(true);
          } else {
            console.warn(`[WARN] TextBelt failed to send SMS: ${responseJson.error || 'Quota limit reached'}`);
            resolve(false);
          }
        } catch (e) {
          console.error('[ERROR] Failed to parse TextBelt response:', e.message);
          resolve(false);
        }
      });
    });

    req.on('error', (err) => {
      console.error('[ERROR] Request error sending SMS via TextBelt:', err.message);
      resolve(false);
    });

    req.write(postData);
    req.end();
  });
};

module.exports = {
  sendSMSMessage
};
