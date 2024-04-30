require("dotenv").config();
const twilio = require("twilio");

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

var clc = require("cli-color");
var twilioColor = clc.xterm(196).bgXterm(236);
var arrow = twilioColor(">") + "   ";

function validateEnvVariables() {
  const requiredEnvVars = ["TWILIO_ACCOUNT_SID", "TWILIO_AUTH_TOKEN"];
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

  const client = twilio(accountSid, authToken);

  console.log(twilioColor(">> Testing Connection\n"));
  try {
    const service = await client.messaging.v1.services("MG9b2473188fbfa7fb5d552f574a7b7959").fetch();
    console.log(arrow + "Successfully connected to Twilio.");
    console.log(arrow + "Active messaging service: " + clc.bold(service.friendlyName));
  } catch (err) {
    console.error("Failed to connect to Twilio", err);
  }
}

async function testTwilio() {
  await testConnection();
}

module.exports = { testTwilio };
