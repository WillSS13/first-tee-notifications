const { Knock } = require("@knocklabs/node");
const knock = new Knock(process.env.KNOCK_API_KEY);

const sendSMS = (id, phone, message) => {
  knock.workflows.trigger("sms", {
    data: { message },
    recipients: [
      {
        id: id,
        phone_number: phone,
      },
    ],
  })
  .then((response) => console.log(response))
  .catch((error) => console.error(error));
}

const sendEmail = (id, email, message) => {
  knock.workflows.trigger("email", {
    data: { message },
    recipients: [
      {
        id: id,
        email: email
        // email: "notifications@thefirstteepittsburgh.org"
      },
    ],
  })
  .then((response) => console.log(response))
  .catch((error) => console.error(error));
}

const testSMS = (id, phone, message) => {
  knock.workflows.trigger("sms", {
    data: { message },
    recipients: [
      {
        id: id,
        phone_number: phone,
      },
    ],
  })
  .then((response) => console.log(response))
  .catch((error) => console.error(error));
}

const testEmail = (id, email, message) => {
  knock.workflows.trigger("email", {
    data: { message },
    recipients: [
      {
        id: id,
        email: email
        // email: "notifications@thefirstteepittsburgh.org"
      },
    ],
  })
  .then((response) => console.log(response))
  .catch((error) => console.error(error));
}

module.exports = { testSMS, testEmail, sendSMS, sendEmail };