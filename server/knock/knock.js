const { Knock } = require("@knocklabs/node");
const knock = new Knock(process.env.KNOCK_API_KEY);

// sendSMS
// params: id, phone, message
/**
 * Sends an SMS message to a recipient.
 *
 * @param {string} id - Knock ID.
 * @param {string} phone - The phone number of the recipient.
 * @param {string} message - The message to be sent.
 */
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

// sendEmail
// params: id, email, message
/**
 * Sends an email message to a recipient.
 *
 * @param {string} id - Knock ID.
 * @param {string} email - The email of the recipient.
 * @param {string} message - The message to be sent.
 */
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

module.exports = { sendSMS, sendEmail };