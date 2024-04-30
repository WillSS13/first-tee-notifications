const { Knock } = require("@knocklabs/node");
const { response } = require("express");
const knock = new Knock(process.env.KNOCK_API_KEY);

const sendSMS = (user_id, phone, subject, msg, coach) => {
  knock.workflows.trigger("twilio", {
    data: {
      subject: subject,
      message: msg,
      coach: coach,
    },
    recipients: [
      {
        id: user_id,
        name: phone,
        phone_number: phone,
      },
    ],
  })
    .then((response) => console.log(response))
    .catch((error) => console.error(error));
}

const sendEmail = (user_id, email, subject, msg, coach) => {
  knock.workflows.trigger("mailersend", {
    data: {
      subject: subject,
      message: msg,
      coach: coach,
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

const sendSystemAlertEmail = (system, errCode, suggestion, errorDetails) => {
  knock.workflows.trigger("api-test-email", {
    data: {
      system: system,
      errCode: errCode,
      suggestion: suggestion,
      errorDetails: errorDetails,
    },
    recipients: [
      {
        id: "api-test",
        // email: "pcoultas@thefirstteepittsburgh.org"
        email: "notifications@thefirstteepittsburgh.org",
      },
    ],
  })
    .then((response) => console.log(response))
    .catch((error) => console.error(error));
}

const sendSystemAlertSMS = () => {
  knock.workflows.trigger("api-test-sms", {
    data: {},
    recipients: [
      {
        id: "api-test-sms",
        phone_number: "+14128754933",
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
        link_clicked: response.items[0].link_clicked_at ? response.items[0].link_clicked_at : "null",
        created_at: response.items[0].updated_at,
        workflow: response.items[0].workflow,
      });
    } catch (error) {
      // do nothing
    }
  }
  res.send(responses);
}

module.exports = { sendSMS, sendEmail, sendSystemAlertEmail, sendSystemAlertSMS, getStatuses };