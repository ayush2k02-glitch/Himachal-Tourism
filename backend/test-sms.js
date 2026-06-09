require('dotenv').config();
const { sendSMSMessage } = require('./utils/sms');

console.log('Sending test SMS to your number: 8219935062...');

const testMessage = `🏔️ Himachal Tourism Alert 🏔️\nTest SMS sent successfully to your number 8219935062! Your backend SMS configuration is fully active.`;

sendSMSMessage(testMessage).then((success) => {
  if (success) {
    console.log('✅ Success! Check your phone for the SMS text message.');
    process.exit(0);
  } else {
    console.error('❌ Failed to send SMS. Ensure your phone number is correct and check the logs above.');
    process.exit(1);
  }
});
