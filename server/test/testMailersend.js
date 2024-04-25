require("dotenv").config();

const { MailerSend } = require("mailersend");

const mailerSend = new MailerSend({
  apiKey: process.env.MAILERSEND_API_KEY,
});

var clc = require("cli-color");
var mailersendColor = clc.xterm(93).bgXterm(236);
var arrow = mailersendColor(">") + "   ";

async function testConnection() {
  console.log(mailersendColor(">> Testing Connection\n"));
  try {
    const response = await mailerSend.email.domain.list();
    console.log(arrow + "Successfully connected to MailerSend.");
    console.log(arrow + "Current domain is: ", clc.bold(response.body.data[0].name));
  } catch (err) {
    console.error('Connection failed:', err);
  }
}

async function testMailersend() {
  await testConnection();
}

module.exports = { testMailersend };
