const { Knock } = require("@knocklabs/node");
const knock = new Knock(process.env.KNOCK_API_KEY);

const testSMS = () => {
  knock.workflows.trigger("twilio", {
    data: { message: "THIS IS A TEST MESSAGE" },
    recipients: [
      {
        id: "1",
        name: "Will Squibb",
        phone_number: "+14176316203",
      },
    ],
  })
    .then((response) => console.log(response))
    .catch((error) => console.error(error));
}

const testEmail = () => {
  knock.workflows.trigger("mailersend", {
    data: { message: "THIS IS A TEST MESSAGE" },
    recipients: [
      {
        id: "1",
        name: "Will Squibb",
        email: "wsquibb@andrew.cmu.edu"
      },
    ],
  })
    .then((response) => console.log(response))
    .catch((error) => console.error(error));
}

module.exports = { testSMS, testEmail };