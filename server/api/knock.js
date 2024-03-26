const { Knock } = require("@knocklabs/node");
const knock = new Knock(process.env.KNOCK_API_KEY);

const sendSMS = (phone, msg) => {
  knock.workflows.trigger("twilio", {
    data: {
      message: msg,
    },
    recipients: [
      {
        id: phone,
        phone_number: phone,
      },
    ],
  })
    .then((response) => console.log(response))
    .catch((error) => console.error(error));
}

const sendEmail = (email, subject, msg) => {
  knock.workflows.trigger("mailersend", {
    data: {
      subject: subject,
      message: msg,
    },
    recipients: [
      {
        id: email,
        email: email,
      },
    ],
  })
    .then((response) => console.log(response))
    .catch((error) => console.error(error));
}

module.exports = { sendSMS, sendEmail };