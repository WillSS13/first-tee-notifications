const { Knock } = require("@knocklabs/node");
const { response } = require("express");
const { user } = require("fontawesome");
const knock = new Knock(process.env.KNOCK_API_KEY);

const sendSMS = (user_id, phone, msg) => {
  knock.workflows.trigger("twilio", {
    data: {
      message: msg,
    },
    recipients: [
      {
        id: user_id,
        phone_number: phone,
      },
    ],
  })
    .then((response) => console.log(response))
    .catch((error) => console.error(error));
}

const sendEmail = (user_id, email, subject, msg) => {
  knock.workflows.trigger("mailersend", {
    data: {
      subject: subject,
      message: msg,
    },
    recipients: [
      {
        id: user_id,
        email: email,
      },
    ],
  })
    .then((response) => console.log(response))
    .catch((error) => console.error(error));
}

async function getStatuses(userIds, res) {
  let responses = [];
  for (let userId of userIds) {
    try {
      let response = await knock.users.getMessages(userId);
      responses.push({
        id: userId.split("_")[1],
        status: response.items[0].status,
        link_clicked: response.items[0].link_clicked_at ? response.items[0].link_clicked_at : "null"
      });
    } catch (error) {
      // do nothing
    }
  }
  res.send(responses);
}

module.exports = { sendSMS, sendEmail, getStatuses };