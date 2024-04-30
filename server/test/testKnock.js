require('dotenv').config();
const { Knock } = require("@knocklabs/node");

const api_key = process.env.KNOCK_API_KEY;

var clc = require("cli-color");
var knockColor = clc.xterm(202).bgXterm(236);
const arrow = knockColor(">") + "   ";

function validateEnvVariables() {
  const requiredEnvVars = ['KNOCK_API_KEY'];
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

  const knock = new Knock(api_key);

  console.log(knockColor(">> Testing Connection\n"));
  try {
    const response = await knock.messages.list();
    console.log(arrow + "Successfully connected to Knock.");
    console.log(arrow + "Retrieved latest message ID: " + clc.bold(response.items[0].id));
  } catch (err) {
    let errorMessage = (err.message || "Unknown error");
    let errorDetails = JSON.stringify(err, null, 2);
    console.error(arrow + "Error: " + clc.redBright(errorMessage));
    // TODO: SEND SYSTEM ALERT THROUGH MAILERSEND
  }
  
}

async function testKnock() {
  await testConnection();
}

module.exports = { testKnock };