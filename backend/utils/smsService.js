// PRJ-A65E-0059: SMS gateway integration (simulated stub)
// Real gateway (jaise Twilio) plug karne ke liye niche wala block replace karo.
const sendSMS = async ({ to, message }) => {
  console.log('📱 [SIMULATED SMS]');
  console.log(`   To: ${to}`);
  console.log(`   Message: ${message}`);
  return { simulated: true };
};

module.exports = { sendSMS };