require("dotenv").config();
const twilio = require("twilio");

// TODO: CREATE DOCUMENTATION FOR EACH ENV VAR & WHAT HAPPENS IF THEY ARE NOT SET
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

var clc = require("cli-color");
var twilioColor = clc.xterm(196).bgXterm(236);
var arrow = twilioColor(">") + "   ";

async function testConnection() {
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
