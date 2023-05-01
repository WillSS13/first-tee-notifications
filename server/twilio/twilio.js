const accountSid = process.env.TWILIO_ACCOUNT_SID;
// const authToken = process.env.TWILIO_AUTH_TOKEN;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const sendMessage = (phone, message) => {
  const client = require('twilio')(accountSid, authToken);
  client.messages
    .create({
       body: message + ' Reply STOP to stop receiving future notifications',
       from: '+19107189243',
       to: phone
     })
    .then(message => console.log(message.sid));
}

module.exports = {sendMessage};