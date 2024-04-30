require("dotenv").config();
const { MailerSend } = require("mailersend");
var knock = require ('../api/knock.js');

const api_key = process.env.MAILERSEND_API_KEY;

var clc = require("cli-color");
var mailersendColor = clc.xterm(93).bgXterm(236);
var arrow = mailersendColor(">") + "   ";

function validateEnvVariables() {
  const requiredEnvVars = ["MAILERSEND_API_KEY"];
  let isValid = true;

  requiredEnvVars.forEach(varName => {
      if (!process.env[varName]) {
          console.error(`Missing environment variable: ` + clc.redBright(varName));
          isValid = false;
      }
  });

  return isValid;
}

async function testConnection() {
  if (!validateEnvVariables()) {
    return;
  }

  const mailerSend = new MailerSend({
    apiKey: api_key,
  });

  console.log(mailersendColor(">> Testing Connection\n"));
  try {
    const response = await mailerSend.email.domain.list();
    console.log(arrow + "Successfully connected to MailerSend.");
    console.log(arrow + "Current domain is: ", clc.bold(response.body.data[0].name));
  } catch (err) {
    console.error(arrow + "Error: " + clc.redBright("Bad API key"));
    knock.sendSystemAlertSMS();
  }
}

async function testMailersend() {
  await testConnection();
}

module.exports = { testMailersend };
