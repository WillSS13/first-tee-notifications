const accountSid = "AC73a23557bc6b1d47f5a9cbebeeb25c02";
// const authToken = process.env.TWILIO_AUTH_TOKEN;
const authToken = "96569ea3128395035e364b8c5217150f";
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