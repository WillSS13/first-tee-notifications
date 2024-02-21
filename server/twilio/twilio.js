// Connection to Twilio Programmable Messaging API

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const sendMessage = (phone, message) => {
  const client = require('twilio')(accountSid, authToken);
  console.log(phone);
  client.messages
    .create({
       body: message + '\n \n Please DO NOT reply to this message unless you want to opt out. Then, reply STOP to stop receiving future notifications',
       to: phone,
       from: '+18335911404'
     })
    .then(message => console.log(message.sid));
}

const testMessage = () => {
  const client = require('twilio')(accountSid, authToken);

  client.messages
      .create({
          shortenUrls: true,
          body: '\n \n \n THIS IS A TEST \n \n https://first-tee-notifications.herokuapp.com/b38a6c86e62761d3561f58c0be47e378.html \n',
          from: '+18335911404',
          to: '+14176316203'
      })
      .then(message => console.log(message.sid))
}

module.exports = {sendMessage, testMessage};