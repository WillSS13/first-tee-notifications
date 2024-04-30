require("dotenv").config();
const twilio = require("twilio");
var knock = require ('../api/knock.js');

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
          console.error(arrow + `Missing environment variable: ` + clc.redBright(varName));
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
    let errorMessage = (err.message || "Unknown error");
    let errorDetails = JSON.stringify(err, null, 2);
    console.error(arrow + "Error: " + clc.redBright(errorMessage));
    
    knock.sendSystemAlertEmail(
      "Twilio",
      "Please generate a new API key in Twilio and update the integration in Knock.\n" +
      "You'll also need to update the environment variables in Heroku.",
      errorMessage,
      errorDetails
    );
  }
}

async function testTwilio() {
  await testConnection();
}

module.exports = { testTwilio };
