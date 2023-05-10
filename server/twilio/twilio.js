// const accountSid = process.env.TWILIO_ACCOUNT_SID;
const accountSid = "AC73a23557bc6b1d47f5a9cbebeeb25c02";
// const authToken = process.env.TWILIO_AUTH_TOKEN;
const authToken = "96569ea3128395035e364b8c5217150f";
const sendMessage = (phone, message) => {
  const client = require('twilio')(accountSid, authToken);
  // console.log(phone);
  // client.messages
  //   .create({
  //      body: message + '\n \n Please DO NOT reply to this message unless you want to opt out. Then, reply STOP to stop receiving future notifications',
  //      to: phone,
  //      from: '+19107189243'
  //    })
  //   .then(message => console.log(message.sid));

    Promise.all(
      phone.map(number => {
        return client.messages.create({
          to: number,
          from: '+19107189243',
          body: body
        });
      })
    )
      .then(messages => {
        console.log('Messages sent!');
      })
      .catch(err => console.error(err));
}

module.exports = {sendMessage};